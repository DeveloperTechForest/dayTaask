// /context/AuthContext.js
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
  const [loading, setLoading] = useState(true); // initial app load
  const [authLoading, setAuthLoading] = useState(false); // login / logout
  const [error, setError] = useState(null);

  /**
   * Load current user from backend
   * ❗ NO redirect logic here
   */
  const reloadUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch("/api/users/me/?context=admin");

      if (!data || data.error) {
        setUser(null);
        setLoading(false);
        return null;
      }

      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error("reloadUser failed:", err);
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Initial load (page refresh)
   */
  useEffect(() => {
    reloadUser();
  }, [reloadUser]);

  /**
   * When token is refreshed silently
   */
  useEffect(() => {
    const handleTokenRefresh = () => {
      reloadUser();
    };

    window.addEventListener("token-refreshed", handleTokenRefresh);
    return () =>
      window.removeEventListener("token-refreshed", handleTokenRefresh);
  }, [reloadUser]);

  /**
   * Admin check helper
   */
  const isAdminUser = (u) => {
    console.log("Checking admin for user:", u);
    if (!u || !Array.isArray(u.role)) return false;
    return u.role.some((r) => r.is_admin_role === true);
  };

  /**
   * Login (email/password)
   */
  const login = async ({ email, password }) => {
    setAuthLoading(true);
    setError(null);

    try {
      const data = await apiFetch("/api/users/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!data) {
        setAuthLoading(false);
        setError("Login failed");
        return { ok: false };
      }

      if (data.error) {
        setAuthLoading(false);
        setError(
          data.error === "INVALID_CREDENTIALS"
            ? "Invalid credentials"
            : data.error
        );
        return { ok: false };
      }

      const me = await reloadUser();

      if (!me || !isAdminUser(me)) {
        await logout({ redirect: false });
        setError("Only admin users can access this panel");
        setAuthLoading(false);
        return { ok: false };
      }

      setAuthLoading(false);
      return { ok: true };
    } catch (err) {
      setAuthLoading(false);
      setError("Login failed");
      return { ok: false };
    }
  };

  /**
   * Google login
   */
  const loginWithGoogle = async (code) => {
    setAuthLoading(true);
    setError(null);

    try {
      const data = await apiFetch("/google/callback/", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      if (!data || data.error) {
        setAuthLoading(false);
        return { ok: false };
      }

      const me = await reloadUser();

      if (!me || !isAdminUser(me)) {
        await logout({ redirect: false });
        setAuthLoading(false);
        return { ok: false };
      }

      setAuthLoading(false);
      return { ok: true };
    } catch (err) {
      setAuthLoading(false);
      return { ok: false };
    }
  };

  /**
   * Logout
   */
  const logout = async (opts = { redirect: true }) => {
    setUser(null);
    setLoading(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout/`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    if (opts.redirect) {
      router.replace("/login");
    }
  };

  /**
   * Permission helpers
   */
  const hasRole = (roleName) =>
    !!user?.role?.some((r) => r.role__name === roleName);

  const hasAnyRole = (...roles) =>
    !!user?.role?.some((r) => roles.includes(r.role__name));

  const hasPermission = (perm) =>
    !!(Array.isArray(user?.permissions) && user.permissions.includes(perm));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        error,
        reloadUser,
        login,
        loginWithGoogle,
        logout,
        isAdminUser,
        hasRole,
        hasAnyRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
