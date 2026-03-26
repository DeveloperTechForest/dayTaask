import { apiFetch } from "@/utils/api";

// lib/auth.js
export async function getUserSSR(req) {
  try {
    const data = await apiFetch("/api/users/me/", {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (data?.error) return null;
    return data;
  } catch (error) {
    return null;
  }
}
