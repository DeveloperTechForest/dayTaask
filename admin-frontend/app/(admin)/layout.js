"use client";
import AdminGuard from "@/components/AdminGuard";
import AdminShell from "@/components/AdminShell";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
