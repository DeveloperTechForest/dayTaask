// app/(taaskr)/profile/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/taaskr/StatusBadge";
import { useToast } from "@/components/taaskr/ToastProvider";
import { apiFetch } from "@/utils/api";
import {
  User,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  Upload,
  Check,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "areas", label: "Service Areas", icon: MapPin },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "bank", label: "Bank", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

export default function ProfilePage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [editServices, setEditServices] = useState(false);
  const [editAreas, setEditAreas] = useState(false);
  const [editBank, setEditBank] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [bankForm, setBankForm] = useState({
    bank_account_holder_name: "",
    bank_account_number: "",
    bank_ifsc_code: "",
    bank_name: "",
    bank_upi_id: "",
  });
  const [bio, setBio] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, addrRes, servicesRes, areasRes, selectedAreasRes] =
        await Promise.all([
          apiFetch("/api/taaskr/profile/"),
          apiFetch("/api/taaskr/addresses/"),
          apiFetch("/api/services/all-services/?page_size=100"),
          apiFetch("/api/taaskr/service-areas/"),
          apiFetch("/api/taaskr/service-areas/selected/"),
        ]);

      if (!profileRes?.error) {
        setProfile(profileRes);
        setSelectedServices(
          Array.isArray(profileRes?.skill_tags) ? profileRes.skill_tags : [],
        );
        setBio(profileRes?.bio || "");
        setBankForm({
          bank_account_holder_name: profileRes?.bank_account_holder_name || "",
          bank_account_number: profileRes?.bank_account_number || "",
          bank_ifsc_code: profileRes?.bank_ifsc_code || "",
          bank_name: profileRes?.bank_name || "",
          bank_upi_id: profileRes?.bank_upi_id || "",
        });
      }

      setAddresses(Array.isArray(addrRes) ? addrRes : addrRes?.results || []);

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
      addToast("Failed to load profile", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const serviceNames = useMemo(() => {
    return services
      .filter((s) => selectedServices.includes(String(s.id)))
      .map((s) => s.name);
  }, [services, selectedServices]);

  const areaNames = useMemo(() => {
    return serviceAreas
      .filter((a) => selectedAreas.includes(a.id))
      .map((a) => `${a.name} (${a.city})`);
  }, [serviceAreas, selectedAreas]);

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

  const saveServices = async () => {
    const res = await apiFetch("/api/taaskr/profile/", {
      method: "PATCH",
      body: JSON.stringify({
        profile: {
          skill_tags: selectedServices,
        },
      }),
    });

    if (res?.error) {
      addToast("Failed to update services", { type: "error" });
      return;
    }

    addToast("Services updated", { type: "success" });
    setEditServices(false);
    loadProfile();
  };

  const saveAreas = async () => {
    const res = await apiFetch("/api/taaskr/service-areas/selected/", {
      method: "POST",
      body: JSON.stringify({ area_ids: selectedAreas }),
    });

    if (res?.error) {
      addToast("Failed to update service areas", { type: "error" });
      return;
    }

    addToast("Service areas updated", { type: "success" });
    setEditAreas(false);
    loadProfile();
  };

  const saveBank = async () => {
    const res = await apiFetch("/api/taaskr/profile/", {
      method: "PATCH",
      body: JSON.stringify({
        profile: {
          ...bankForm,
        },
      }),
    });

    if (res?.error) {
      addToast("Failed to update bank", { type: "error" });
      return;
    }

    addToast("Bank details updated", { type: "success" });
    setEditBank(false);
    loadProfile();
  };

  const saveBio = async () => {
    const res = await apiFetch("/api/taaskr/profile/", {
      method: "PATCH",
      body: JSON.stringify({
        profile: { bio },
      }),
    });

    if (res?.error) {
      addToast("Failed to update bio", { type: "error" });
      return;
    }

    addToast("Bio updated", { type: "success" });
    setEditBio(false);
    loadProfile();
  };

  const uploadDocument = async (field, file) => {
    const fd = new FormData();
    fd.append(field, file);

    const res = await apiFetch("/api/taaskr/documents/", {
      method: "PATCH",
      body: fd,
    });

    if (res?.error) {
      addToast("Upload failed", { type: "error" });
      return;
    }

    addToast("Document uploaded", { type: "success" });
    loadProfile();
  };

  const changePassword = async () => {
    setPasswordError("");
    if (!passwordForm.current_password || !passwordForm.new_password) {
      setPasswordError("Current and new password are required.");
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordLoading(true);
    const res = await apiFetch("/api/users/me/change-password/", {
      method: "POST",
      body: JSON.stringify({
        old_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      }),
    });

    if (res?.error) {
      setPasswordError(res?.detail || res?.old_password || "Change failed.");
      setPasswordLoading(false);
      return;
    }

    addToast("Password changed successfully", { type: "success" });
    setPasswordForm({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setPasswordLoading(false);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-[var(--color-text-light)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      <main className="container py-6 px-4 space-y-6">
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center overflow-hidden">
                {profile?.profile_photo_image || profile?.user?.profile_image ? (
                  <img
                    src={profile.profile_photo_image || profile.user.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-[var(--color-primary)]" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold font-display">
                {profile.user?.full_name || "Taaskr"}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-[var(--color-warning)] fill-current" />
                  <span className="font-medium text-lg">
                    {profile.rating_avg || 0}
                  </span>
                </div>
                <span className="text-[var(--color-text-light)] text-sm">
                  ({profile.total_jobs || 0} jobs)
                </span>
                <StatusBadge status={profile.verified ? "approved" : "pending"} />
              </div>
              <div className="flex gap-4 mt-3 text-sm text-[var(--color-text-light)]">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {profile.user?.phone || "-"}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {profile.user?.email || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-md)]">
          <div className="flex overflow-x-auto no-scrollbar border-b border-[var(--color-border)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Bio</h3>
                  <button
                    onClick={() => (editBio ? saveBio() : setEditBio(true))}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-text)]"
                  >
                    {editBio ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {editBio ? "Save" : "Edit"}
                  </button>
                </div>

                {editBio ? (
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                  />
                ) : (
                  <p className="text-[var(--color-text-light)]">
                    {profile.bio || "No bio added"}
                  </p>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-3">Addresses</h3>
                  <div className="grid gap-3">
                    {addresses.length === 0 ? (
                      <p className="text-sm text-[var(--color-text-light)]">No addresses saved</p>
                    ) : (
                      addresses.map((addr) => (
                        <div key={addr.id} className="p-4 rounded-xl bg-gray-50">
                          <p className="text-sm font-medium">{addr.label}</p>
                          <p className="text-sm text-[var(--color-text-light)]">
                            {addr.street}, {addr.city}, {addr.state} {addr.pincode}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Selected Services</h3>
                  <button
                    onClick={() => (editServices ? saveServices() : setEditServices(true))}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-text)]"
                  >
                    {editServices ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {editServices ? "Save" : "Edit"}
                  </button>
                </div>

                {editServices ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                          selectedServices.includes(String(service.id))
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedServices.includes(String(service.id))
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedServices.includes(String(service.id)) && (
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
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {serviceNames.length === 0 ? (
                      <span className="text-sm text-[var(--color-text-light)]">
                        No services selected
                      </span>
                    ) : (
                      serviceNames.map((service) => (
                        <span
                          key={service}
                          className="px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium"
                        >
                          {service}
                        </span>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "areas" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Service Areas</h3>
                  <button
                    onClick={() => (editAreas ? saveAreas() : setEditAreas(true))}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-text)]"
                  >
                    {editAreas ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {editAreas ? "Save" : "Edit"}
                  </button>
                </div>

                {editAreas ? (
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
                            {area.city} • {area.radius_km}km
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {areaNames.length === 0 ? (
                      <span className="text-sm text-[var(--color-text-light)]">
                        No service areas selected
                      </span>
                    ) : (
                      areaNames.map((area) => (
                        <span
                          key={area}
                          className="px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium"
                        >
                          {area}
                        </span>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Uploaded Documents</h3>
                <div className="space-y-3">
                  {[
                    { name: "Government ID", field: "government_id_image" },
                    { name: "Address Proof", field: "address_proof_image" },
                    { name: "Profile Photo", field: "profile_photo_image" },
                  ].map((doc) => (
                    <div
                      key={doc.field}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[var(--color-text-light)]" />
                        <div>
                          <span className="font-medium">{doc.name}</span>
                          {profile?.[doc.field] && (
                            <a
                              href={profile[doc.field]}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-xs text-[var(--color-primary)] hover:underline mt-1"
                            >
                              View document
                            </a>
                          )}
                        </div>
                      </div>
                      <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadDocument(doc.field, file);
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
                
              </div>
            )}

            {activeTab === "bank" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Bank Account</h3>
                  <button
                    onClick={() => (editBank ? saveBank() : setEditBank(true))}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-text)]"
                  >
                    {editBank ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {editBank ? "Save" : "Edit"}
                  </button>
                </div>

                <div className="space-y-3">
                  {Object.entries(bankForm).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-xl bg-gray-50">
                      <p className="text-xs text-[var(--color-text-light)]">
                        {key.replace(/_/g, " ")}
                      </p>
                      {editBank ? (
                        <input
                          value={value}
                          onChange={(e) =>
                            setBankForm({ ...bankForm, [key]: e.target.value })
                          }
                          className="w-full mt-2 rounded-lg border border-[var(--color-border)] px-3 py-2"
                        />
                      ) : (
                        <p className="font-medium mt-1">
                          {value || "-"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4 max-w-md">
                <p className="text-sm text-[var(--color-text-light)]">
                  Update your password using your current credentials.
                </p>
                {passwordError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {passwordError}
                  </p>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        current_password: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        new_password: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirm_password: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                  />
                </div>
                <button
                  onClick={changePassword}
                  disabled={passwordLoading}
                  className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-white font-medium transition-colors ${
                    passwordLoading
                      ? "bg-[var(--color-primary)]/70 cursor-wait"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-d)]"
                  }`}
                >
                  {passwordLoading ? "Updating..." : "Change Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
