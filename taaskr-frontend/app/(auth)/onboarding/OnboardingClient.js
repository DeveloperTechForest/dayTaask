// app/(auth)/onboarding/OnboardingClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/taaskr/Logo";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  FileText,
  CreditCard,
  Check,
  Upload,
  Loader2,
  Camera,
  MapPin,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { useToast } from "@/components/taaskr/ToastProvider";
import { useAuth } from "@/app/context/AuthContext";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Services", icon: Briefcase },
  { id: 3, title: "Service Areas", icon: MapPin },
  { id: 4, title: "Documents", icon: FileText },
  { id: 5, title: "Bank Details", icon: CreditCard },
];

const emptyAddress = {
  label: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

export default function OnboardingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams?.get("edit") === "1";
  const { addToast } = useToast();
  const { authStage, loading: authLoading, reloadUser, logout } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const [services, setServices] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    dob: "",
    bio: "",
    bank_account_holder_name: "",
    bank_account_number: "",
    bank_ifsc_code: "",
    bank_name: "",
    bank_upi_id: "",
  });

  const [addresses, setAddresses] = useState({
    Permanent: { ...emptyAddress, label: "Permanent" },
    Current: { ...emptyAddress, label: "Current" },
  });

  const [documents, setDocuments] = useState({
    government_id_image: null,
    address_proof_image: null,
    profile_photo_image: null,
  });

  const [docPreviews, setDocPreviews] = useState({
    government_id_image: null,
    address_proof_image: null,
    profile_photo_image: null,
  });

  const toAbsoluteUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http")) return value;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${base}${value.startsWith("/") ? value : `/${value}`}`;
  };
  console.log("authStage", authStage);
  useEffect(() => {
    if (authLoading) return;
    if (authStage === "unauth") {
      router.replace("/login");
      return;
    }
    if (authStage === "active") {
      router.replace("/dashboard");
      return;
    }
    if (authStage === "pending" && !isEditMode) {
      reloadUser();
      router.replace("/pending");
      return;
    }

    const loadInitial = async () => {
      setInitialLoading(true);
      setError("");

      try {
        const [
          profileRes,
          addressRes,
          servicesRes,
          areasRes,
          selectedAreasRes,
        ] = await Promise.all([
          apiFetch("/api/taaskr/profile/"),
          apiFetch("/api/taaskr/addresses/"),
          apiFetch("/api/services/all-services/?page_size=100"),
          apiFetch("/api/taaskr/service-areas/"),
          apiFetch("/api/taaskr/service-areas/selected/"),
        ]);

        if (!profileRes?.error) {
          setProfileForm((prev) => ({
            ...prev,
            full_name: profileRes?.user?.full_name || "",
            phone: profileRes?.user?.phone || "",
            email: profileRes?.user?.email || "",
            dob: profileRes?.dob || "",
            bio: profileRes?.bio || "",
            bank_account_holder_name:
              profileRes?.bank_account_holder_name || "",
            bank_account_number: profileRes?.bank_account_number || "",
            bank_ifsc_code: profileRes?.bank_ifsc_code || "",
            bank_name: profileRes?.bank_name || "",
            bank_upi_id: profileRes?.bank_upi_id || "",
          }));

          setSelectedServices(
            Array.isArray(profileRes?.skill_tags) ? profileRes.skill_tags : [],
          );

          setDocPreviews({
            government_id_image: toAbsoluteUrl(profileRes?.government_id_image),
            address_proof_image: toAbsoluteUrl(profileRes?.address_proof_image),
            profile_photo_image: toAbsoluteUrl(
              profileRes?.profile_photo_image ||
                profileRes?.user?.profile_image,
            ),
          });
        }

        const addrList = Array.isArray(addressRes)
          ? addressRes
          : addressRes?.results || [];
        const permanent = addrList.find(
          (a) => a.label?.toLowerCase() === "permanent",
        );
        const current = addrList.find(
          (a) => a.label?.toLowerCase() === "current",
        );

        setAddresses({
          Permanent: {
            ...emptyAddress,
            label: "Permanent",
            ...(permanent || {}),
          },
          Current: {
            ...emptyAddress,
            label: "Current",
            ...(current || {}),
          },
        });

        const serviceList = Array.isArray(servicesRes?.results)
          ? servicesRes.results
          : Array.isArray(servicesRes)
            ? servicesRes
            : [];
        setServices(serviceList);

        setServiceAreas(
          Array.isArray(areasRes?.results)
            ? areasRes.results
            : Array.isArray(areasRes)
              ? areasRes
              : [],
        );

        setSelectedAreas(
          Array.isArray(selectedAreasRes)
            ? selectedAreasRes.map((a) => a.id)
            : [],
        );
      } catch (err) {
        setError("Failed to load onboarding data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitial();
  }, [authLoading, authStage, router, reloadUser, isEditMode]);

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const missing = [];

    const requireField = (value, label, step) => {
      if (value === null || value === undefined) {
        missing.push({ label, step });
        return;
      }
      if (typeof value === "string" && value.trim() === "") {
        missing.push({ label, step });
      }
    };

    requireField(profileForm.full_name, "Full name", 1);
    requireField(profileForm.phone, "Phone", 1);
    requireField(profileForm.email, "Email", 1);
    requireField(profileForm.dob, "Date of birth", 1);
    requireField(profileForm.bio, "Bio", 1);

    requireField(addresses.Permanent.street, "Permanent address street", 1);
    requireField(addresses.Permanent.city, "Permanent address city", 1);
    requireField(addresses.Permanent.state, "Permanent address state", 1);
    requireField(addresses.Permanent.pincode, "Permanent address pincode", 1);

    requireField(addresses.Current.street, "Current address street", 1);
    requireField(addresses.Current.city, "Current address city", 1);
    requireField(addresses.Current.state, "Current address state", 1);
    requireField(addresses.Current.pincode, "Current address pincode", 1);

    if (!selectedServices.length) {
      missing.push({ label: "At least one service", step: 2 });
    }

    if (!selectedAreas.length) {
      missing.push({ label: "At least one service area", step: 3 });
    }

    const hasGovernmentId =
      documents.government_id_image || docPreviews.government_id_image;
    const hasAddressProof =
      documents.address_proof_image || docPreviews.address_proof_image;
    const hasProfilePhoto =
      documents.profile_photo_image || docPreviews.profile_photo_image;

    if (!hasGovernmentId) {
      missing.push({ label: "Government ID document", step: 4 });
    }
    if (!hasAddressProof) {
      missing.push({ label: "Address proof document", step: 4 });
    }
    if (!hasProfilePhoto) {
      missing.push({ label: "Profile photo", step: 1 });
    }

    requireField(
      profileForm.bank_account_holder_name,
      "Bank account holder name",
      5,
    );
    requireField(
      profileForm.bank_account_number,
      "Bank account number",
      5,
    );
    requireField(profileForm.bank_ifsc_code, "Bank IFSC code", 5);
    requireField(profileForm.bank_name, "Bank name", 5);

    if (missing.length) {
      const first = missing[0];
      setError(`Please complete: ${first.label}`);
      setCurrentStep(first.step);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const onboardingCompleted = true;
      const profilePayload = {
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        email: profileForm.email,
        profile: {
          dob: profileForm.dob,
          bio: profileForm.bio,
          skill_tags: selectedServices,
          bank_account_holder_name: profileForm.bank_account_holder_name,
          bank_account_number: profileForm.bank_account_number,
          bank_ifsc_code: profileForm.bank_ifsc_code,
          bank_name: profileForm.bank_name,
          bank_upi_id: profileForm.bank_upi_id,
          onboarding_completed: onboardingCompleted,
        },
      };

      const profileRes = await apiFetch("/api/taaskr/profile/", {
        method: "PATCH",
        body: JSON.stringify(profilePayload),
      });

      if (profileRes?.error) {
        throw new Error(profileRes?.detail || "Failed to save profile");
      }

      const addrPayload = [addresses.Permanent, addresses.Current];
      const addrRes = await apiFetch("/api/taaskr/addresses/bulk-upsert/", {
        method: "POST",
        body: JSON.stringify(addrPayload),
      });

      if (addrRes?.error) {
        throw new Error(addrRes?.detail || "Failed to save addresses");
      }

      const areaRes = await apiFetch("/api/taaskr/service-areas/selected/", {
        method: "POST",
        body: JSON.stringify({ area_ids: selectedAreas }),
      });

      if (areaRes?.error) {
        throw new Error(areaRes?.detail || "Failed to save service areas");
      }

      const hasDocs =
        documents.government_id_image ||
        documents.address_proof_image ||
        documents.profile_photo_image;

      if (hasDocs) {
        const fd = new FormData();
        if (documents.government_id_image)
          fd.append("government_id_image", documents.government_id_image);
        if (documents.address_proof_image)
          fd.append("address_proof_image", documents.address_proof_image);
        if (documents.profile_photo_image)
          fd.append("profile_photo_image", documents.profile_photo_image);

        const docRes = await apiFetch("/api/taaskr/documents/", {
          method: "PATCH",
          body: fd,
        });

        if (docRes?.error) {
          addToast("Documents upload failed", { type: "error" });
        } else {
          addToast("Documents uploaded", { type: "success" });
        }
      }

      router.replace("/pending");
    } catch (err) {
      setError(err.message || "Failed to submit onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleService = (id) => {
    const value = String(id);
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  };

  const toggleArea = (id) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleAddressChange = (label, field, value) => {
    setAddresses((prev) => ({
      ...prev,
      [label]: {
        ...prev[label],
        [field]: value,
        label,
      },
    }));
  };

  const setDocFile = (key, file) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDocPreviews((prev) => ({ ...prev, [key]: url }));
  };

  const selectedServiceNames = useMemo(() => {
    return services
      .filter((s) => selectedServices.includes(String(s.id)))
      .map((s) => s.name);
  }, [services, selectedServices]);

  useEffect(() => {
    if (!services.length || !selectedServices.length) return;
    const allNumeric = selectedServices.every((v) => /^\d+$/.test(String(v)));
    if (allNumeric) return;

    const nextIds = services
      .filter(
        (s) =>
          selectedServices.includes(String(s.id)) ||
          selectedServices.includes(s.slug) ||
          selectedServices.includes(s.name),
      )
      .map((s) => String(s.id));

    if (nextIds.length) {
      setSelectedServices(nextIds);
    }
  }, [services, selectedServices]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="container flex items-center justify-between h-14 px-4 md:px-6">
          <Logo size="sm" />
          <span className="text-sm text-[var(--color-text-light)]">
            Step {currentStep} of {steps.length}
          </span>
          <button
            onClick={logout}
            className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-4 overflow-x-auto">
        <div className="container">
          <div className="flex items-center justify-between min-w-[520px] px-2">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-[var(--color-success)] text-white"
                          : isActive
                            ? "bg-[var(--color-primary)] text-white scale-110"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>

                    <span
                      className={`mt-2 text-xs font-medium text-center transition-colors ${
                        isCompleted || isActive
                          ? "text-[var(--color-text)]"
                          : "text-[var(--color-text-light)]"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-3">
                      <div className="h-0.5 w-full bg-gray-200 rounded overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isCompleted
                              ? "w-10 bg-[var(--color-success)]"
                              : "w-0 bg-[var(--color-primary)]"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 container py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Personal Information
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Tell us about yourself
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-6 shadow-[var(--shadow-md)]">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 border border-[var(--color-border)] overflow-hidden">
                    {docPreviews.profile_photo_image ? (
                      <img
                        src={docPreviews.profile_photo_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-[var(--color-text-light)]" />
                    )}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setDocFile(
                          "profile_photo_image",
                          e.target.files?.[0] || null,
                        )
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="full_name"
                        className="block text-sm font-medium"
                      >
                        Full Name
                      </label>
                      <input
                        id="full_name"
                        value={profileForm.full_name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            full_name: e.target.value,
                          })
                        }
                        placeholder="Enter full name"
                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium"
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Phone number"
                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="dob" className="block text-sm font-medium">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      value={profileForm.dob || ""}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, dob: e.target.value })
                      }
                      className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      placeholder="Tell customers about yourself"
                      className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {["Permanent", "Current"].map((label) => (
                      <div key={label} className="space-y-3">
                        <p className="text-sm font-medium">{label} Address</p>
                        <input
                          placeholder="Street"
                          value={addresses[label].street}
                          onChange={(e) =>
                            handleAddressChange(label, "street", e.target.value)
                          }
                          className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                        />
                        <input
                          placeholder="City"
                          value={addresses[label].city}
                          onChange={(e) =>
                            handleAddressChange(label, "city", e.target.value)
                          }
                          className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                        />
                        <input
                          placeholder="State"
                          value={addresses[label].state}
                          onChange={(e) =>
                            handleAddressChange(label, "state", e.target.value)
                          }
                          className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                        />
                        <input
                          placeholder="Pincode"
                          value={addresses[label].pincode}
                          onChange={(e) =>
                            handleAddressChange(
                              label,
                              "pincode",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Select Services
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Choose the services you can provide
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((service) => {
                    const id = String(service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(id)}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                          selectedServices.includes(id)
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedServices.includes(id)
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedServices.includes(id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-xs text-[var(--color-text-light)]">
                            {service.short_description || ""}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div className="bg-[var(--color-primary)]/5 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-[var(--color-primary)]">
                    {selectedServices.length} service
                    {selectedServices.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Service Areas
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Choose the areas you want to serve
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
                <div className="grid sm:grid-cols-2 gap-3">
                  {serviceAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => toggleArea(area.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        selectedAreas.includes(area.id)
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAreas.includes(area.id)
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAreas.includes(area.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{area.name}</p>
                        <p className="text-xs text-[var(--color-text-light)]">
                          {area.city} • {area.radius_km}km radius
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedAreas.length > 0 && (
                <div className="bg-[var(--color-primary)]/5 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-[var(--color-primary)]">
                    {selectedAreas.length} area
                    {selectedAreas.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Upload Documents
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Verify your identity with required documents
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-4 shadow-[var(--shadow-md)]">
                {[
                  {
                    key: "government_id_image",
                    title: "Government ID (Aadhaar/PAN)",
                  },
                  {
                    key: "address_proof_image",
                    title: "Address Proof",
                  },
                ].map((doc) => (
                  <div
                    key={doc.key}
                    className="flex items-center justify-between p-4 rounded-lg border border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-[var(--color-text-light)]">
                        Required
                      </p>
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setDocFile(doc.key, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </div>
                ))}

                <div className="grid sm:grid-cols-2 gap-4">
                  {docPreviews.government_id_image && (
                    <img
                      src={docPreviews.government_id_image}
                      alt="ID Proof"
                      className="rounded-lg border"
                    />
                  )}
                  {docPreviews.address_proof_image && (
                    <img
                      src={docPreviews.address_proof_image}
                      alt="Address Proof"
                      className="rounded-lg border"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Bank Details
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Add your bank account for payouts
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-5 shadow-[var(--shadow-md)]">
                {[
                  {
                    key: "bank_account_holder_name",
                    label: "Account Holder Name",
                  },
                  { key: "bank_account_number", label: "Account Number" },
                  { key: "bank_ifsc_code", label: "IFSC Code" },
                  { key: "bank_name", label: "Bank Name" },
                  { key: "bank_upi_id", label: "UPI ID (Optional)" },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium">
                      {field.label}
                    </label>
                    <input
                      value={profileForm[field.key]}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={field.label}
                      className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="sticky bottom-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] py-4 shadow-[var(--shadow-md)]">
        <div className="container">
          <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] transition-colors ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all ${
                isLoading
                  ? "bg-[var(--color-primary)]/70 cursor-wait"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-d)] shadow-md"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : currentStep === steps.length ? (
                <>
                  Submit Application
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
