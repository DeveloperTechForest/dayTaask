// context/AuthContext,js
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { apiFetch } from "@/utils/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial load
  const [authLoading, setAuthLoading] = useState(false); // login/logout
  const [error, setError] = useState(null);

  // ----------------------------------------------------
  // RELOAD USER FROM BACKEND
  // ----------------------------------------------------
  const reloadUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/users/me/");

      if (!data || data.error === "NOT_AUTHENTICATED") {
        setUser(null);
        setLoading(false);
        return null;
      }

      // Normalize roles properly
      data.roles = data.roles || data.role || [];

      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error("reloadUser error", err);
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  // First load
  useEffect(() => {
    reloadUser();
  }, [reloadUser]);

  // ----------------------------------------------------
  // CHECK IF USER IS CUSTOMER
  // ----------------------------------------------------
  const isCustomerUser = (u) => {
    const roles = u?.roles || u?.role || [];
    return roles.some((r) => r.role__name === "customer");
  };

  const isCustomerGoogleUser = (u) => {
    const roles = u?.roles || [];
    return roles.includes("customer");
  };

  // ----------------------------------------------------
  // LOGIN (EMAIL + PASSWORD)
  // ----------------------------------------------------
  const login = async ({ email, password }) => {
    setAuthLoading(true);
    setError(null);

    try {
      const data = await apiFetch("/api/users/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // console.log("Login response data:", data);

      if (data?.error) {
        setAuthLoading(false);
        setError(data.detail || data.message || "Login failed");
        setUser(null);
        return { ok: false, error: data };
      }

      // Validate customer role
      if (!isCustomerUser(data.user)) {
        await apiFetch("/api/users/logout/", { method: "POST" });
        setUser(null);
        setAuthLoading(false);
        setError("Only customers can log in");
        return { ok: false, error: "NOT_CUSTOMER" };
      }

      await reloadUser();
      setAuthLoading(false);

      return { ok: true, data };
    } catch (err) {
      setError("Login failed");
      setAuthLoading(false);
      return { ok: false, error: err };
    }
  };

  // ----------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------
  const logout = async () => {
    setAuthLoading(true);
    try {
      await apiFetch("/api/users/logout/", { method: "POST" });
    } catch (err) {
      console.warn("logout failed", err);
    }
    setUser(null);
    setAuthLoading(false);
    router.push("/");
  };

  // ----------------------------------------------------
  // GOOGLE LOGIN
  // ----------------------------------------------------
  const loginWithGoogle = async (code) => {
    setAuthLoading(true);

    try {
      const data = await apiFetch("/google/callback/", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      // console.log("Google login response data:", data);
      if (!data || data.error) {
        setAuthLoading(false);
        return { ok: false, error: data };
      }

      const me = await reloadUser();

      if (!isCustomerGoogleUser(data.user)) {
        await logout();
        setAuthLoading(false);
        return { ok: false, error: "Only customers can log in." };
      }

      setAuthLoading(false);
      return { ok: true };
    } catch (err) {
      setAuthLoading(false);
      return { ok: false, error: "Google login failed" };
    }
  };

  // ----------------------------------------------------
  // ROLE + PERMISSION HELPERS
  // ----------------------------------------------------
  const hasRole = (roleName) => user?.roles?.includes(roleName);

  const hasAnyRole = (...roleNames) =>
    user?.roles?.some((r) => roleNames.includes(r));

  const hasPermission = (perm) => user?.permissions?.includes(perm);

  // ----------------------------------------------------
  // CONTEXT VALUE
  // ----------------------------------------------------
  const value = {
    user,
    setUser,
    loading,
    authLoading,
    error,
    login,
    logout,
    loginWithGoogle,
    reloadUser,
    hasRole,
    hasAnyRole,
    hasPermission,
    isCustomerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
