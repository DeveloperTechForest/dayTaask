// /utils/api.js

const DEFAULT_FALLBACK = "http://localhost:8000";

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location) {
    return window.location.origin;
  }
  return DEFAULT_FALLBACK;
}

export async function apiFetch(path, options = {}, { retry = true } = {}) {
  const BASE_URL = getBaseUrl();
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const isFormData = options.body instanceof FormData;

  const merged = {
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  };

  let res;
  try {
    res = await fetch(url, merged);
  } catch (err) {
    return { error: "NETWORK_ERROR", detail: String(err) };
  }

  // 🔥 HANDLE 401 BEFORE JSON PARSE
  if (res.status === 401 && retry) {
    const refreshUrl = `${BASE_URL}/api/users/token/refresh/`;

    try {
      const refreshRes = await fetch(refreshUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!refreshRes.ok) {
        return { error: "TOKEN_EXPIRED" };
      }

      // Notify app that token refreshed
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("token-refreshed"));
      }

      // Retry original request ONCE
      return apiFetch(path, options, { retry: false });
    } catch (err) {
      return { error: "REFRESH_FAILED", detail: String(err) };
    }
  }

  // Parse JSON safely
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    if (!res.ok) return { error: "REQUEST_FAILED", status: res.status };
    return null;
  }

  if (!res.ok) {
    return json ?? { error: "REQUEST_FAILED", status: res.status };
  }

  return json;
}
