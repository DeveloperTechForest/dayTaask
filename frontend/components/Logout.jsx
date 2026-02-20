"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      await apiFetch("http://localhost:8000/api/users/logout/", {
        method: "POST",
      });

      setUser(null); // clear user from context
      router.push("/auth/login");
    };

    logoutUser();
  }, []);

  return <div className="p-6 text-center text-lg">Logging out...</div>;
}
