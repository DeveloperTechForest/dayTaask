// /utils/api.js
export async function apiFetch(path, options = {}, { retry = true } = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const finalHeaders = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  // ---- network safe fetch ----
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

  // ---- try parsing JSON ----
  let json = null;
  try {
    json = await res.json();
  } catch {}

  // ---- 401 -> try refresh ----
  if (res.status === 401 && retry) {
    const refreshRes = await fetch(`${BASE_URL}/api/users/token/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    // refresh failed → token expired
    if (!refreshRes.ok) return { error: "TOKEN_EXPIRED" };

    // retry original request
    return apiFetch(path, options, { retry: false });
  }

  // ---- non OK ----
  if (!res.ok) {
    return json ?? { error: "REQUEST_FAILED", status: res.status };
  }

  // ---- success ----
  return json;
}
