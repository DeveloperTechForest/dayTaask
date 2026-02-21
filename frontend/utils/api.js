// /utils/api.js
export async function apiFetch(path, options = {}, { retry = true } = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
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

  // ---- 401 refresh logic ----
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
