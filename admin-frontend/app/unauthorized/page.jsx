// app/unauthorized/page.js
export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold text-slate-800 mb-4">Access Denied</h1>
      <p className="text-lg text-slate-600 mb-8">
        You don't have permission to access this admin area.
      </p>
      <a
        href="/login"
        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
      >
        Back to Login
      </a>
    </div>
  );
}
