// app/context/AuthContext.js
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/utils/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const hasLabel = (addresses, label) => {
  if (!Array.isArray(addresses)) return false;
  return addresses.some(
    (a) => a?.label?.toLowerCase() === label.toLowerCase(),
  );
};

const isOnboardingComplete = (profile, addresses, serviceAreas) => {
  if (!profile) return false;

  const hasServices = Array.isArray(profile.skill_tags) && profile.skill_tags.length > 0;
  const hasBio = Boolean(profile.bio && profile.bio.trim().length > 0);
  const hasDob = Boolean(profile.dob);
  const hasBank = Boolean(
    profile.bank_account_holder_name &&
      profile.bank_account_number &&
      profile.bank_ifsc_code &&
      profile.bank_name,
  );
  const hasDocs = Boolean(
    profile.government_id_image &&
      profile.address_proof_image &&
      profile.profile_photo_image,
  );
  const hasAddresses =
    hasLabel(addresses, "Permanent") && hasLabel(addresses, "Current");
  const hasAreas = Array.isArray(serviceAreas) && serviceAreas.length > 0;

  return (
    hasServices &&
    hasBio &&
    hasDob &&
    hasBank &&
    hasDocs &&
    hasAddresses &&
    hasAreas
  );
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  const reloadUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    const me = await apiFetch("/api/users/me/");
    if (!me || me.error) {
      setUser(null);
      setProfile(null);
      setAddresses([]);
      setServiceAreas([]);
      setLoading(false);
      return null;
    }

    setUser(me);

    const profileRes = await apiFetch("/api/taaskr/profile/");
    if (!profileRes || profileRes.error) {
      setProfile(null);
      setAddresses([]);
      setServiceAreas([]);
      setLoading(false);
      return me;
    }

    setProfile(profileRes);

    const [addrRes, areaRes] = await Promise.all([
      apiFetch("/api/taaskr/addresses/"),
      apiFetch("/api/taaskr/service-areas/selected/"),
    ]);

    setAddresses(Array.isArray(addrRes) ? addrRes : addrRes?.results || []);
    setServiceAreas(Array.isArray(areaRes) ? areaRes : areaRes?.results || []);

    setLoading(false);
    return me;
  }, []);

  useEffect(() => {
    reloadUser();
  }, [reloadUser]);

  const login = async ({ email, phone, password }) => {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/users/login/", {
        method: "POST",
        body: JSON.stringify({ email, phone, password }),
      });

      if (res?.error) {
        setError(res.detail || "Login failed");
        setAuthLoading(false);
        return { ok: false, error: res };
      }

      await reloadUser();
      setAuthLoading(false);
      return { ok: true };
    } catch (err) {
      setAuthLoading(false);
      setError("Login failed");
      return { ok: false, error: err };
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await apiFetch("/api/users/logout/", { method: "POST" });
    } catch (err) {
      // ignore
    }
    setUser(null);
    setProfile(null);
    setAddresses([]);
    setServiceAreas([]);
    setAuthLoading(false);
    router.push("/login");
  };

  const authStage = (() => {
    if (!user) return "unauth";
    if (!profile) return "register";
    if (!isOnboardingComplete(profile, addresses, serviceAreas)) return "onboarding";
    if (!profile.verified) return "pending";
    return "active";
  })();

  const value = {
    user,
    profile,
    addresses,
    serviceAreas,
    loading,
    authLoading,
    error,
    login,
    logout,
    reloadUser,
    authStage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
