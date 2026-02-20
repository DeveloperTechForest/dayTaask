// app/(taaskr)/layout.jsx
import { Header } from "@/components/taaskr/Header";
import { BottomNav } from "@/components/taaskr/BottomNav";

export default function TaaskrLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 pb-20 ">{children}</main>

      {/* Bottom Navigation (mobile only – visible on small screens) */}
      <BottomNav />
    </div>
  );
}
