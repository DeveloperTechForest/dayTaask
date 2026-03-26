// /utils/api.js
const DEFAULT_FALLBACK = "http://localhost:8000";

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return DEFAULT_FALLBACK;
    }
    const parts = hostname.split(".");
    if (parts.length >= 2) {
      const root = parts.slice(-2).join(".");
      return `${protocol}//api.${root}`;
    }
    return window.location.origin;
  }
  return DEFAULT_FALLBACK;
}

export async function apiFetch(path, options = {}, { retry = true } = {}) {
  const BASE_URL = getBaseUrl();
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const isFormData = options.body instanceof FormData;

  const finalHeaders = {
    ...(isFormData
      ? {}
      : options.body
        ? { "Content-Type": "application/json" }
        : {}),
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: finalHeaders,
    });
  } catch (err) {
    return { error: "NETWORK_ERROR", detail: err.message };
  }

  let json = null;
  try {
    json = await res.json();
  } catch {}

  if (res.status === 401 && retry) {
    const refreshRes = await fetch(`${BASE_URL}/api/users/token/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!refreshRes.ok) return { error: "TOKEN_EXPIRED" };

    return apiFetch(path, options, { retry: false });
  }

  if (!res.ok) {
    return json ?? { error: "REQUEST_FAILED", status: res.status };
  }

  return json;
}
