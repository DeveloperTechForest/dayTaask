// lib/auth.js
export async function getUserSSR(req) {
  try {
    const res = await fetch("http://localhost:8000/api/users/me/", {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}
