"use client";
// components/AdminShell.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  HelpCircle,
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  Layers,
  Package,
  PlusCircle,
  Calendar,
  CreditCard,
  Wallet,
  RotateCcw,
  MessageSquare,
  MessageSquareDotIcon,
  Image as ImageIcon,
  Star,
  Headphones,
  Ticket,
  BarChart3,
  Settings,
  Activity,
  Server,
  FileText,
} from "lucide-react";

const COLORS = {
  orange: "#FF6B35",
  sidebarBg: "#0F172A",
  sidebarBorder: "#1E293B",
  pageBg: "#F8FAFC",
};

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiredPermissions: ["dashboard.view"],
  },
  {
    name: "Users",
    icon: Users,
    requiredAny: ["user.view", "taaskr.view", "role.view"],
    items: [
      {
        name: "Customers",
        href: "/users/customers",
        icon: Users,
        requiredPermissions: ["user.view"],
      },
      {
        name: "Taaskrs",
        href: "/users/taaskrs",
        icon: UserCheck,
        requiredPermissions: ["taaskr.view"],
      },
      {
        name: "Roles & Permissions",
        href: "/users/roles",
        icon: Shield,
        requiredPermissions: ["role.view", "permission.view"],
      },
    ],
  },
  {
    name: "Services",
    icon: Package,
    requiredAny: ["category.view", "service.view", "addon.view"],
    items: [
      {
        name: "Categories",
        href: "/services/categories",
        icon: Layers,
        requiredPermissions: ["category.view"],
      },
      {
        name: "Services",
        href: "/services/list",
        icon: Package,
        requiredPermissions: ["service.view"],
      },
      {
        name: "Add-ons",
        href: "/services/addons",
        icon: PlusCircle,
        requiredPermissions: ["addon.view"],
      },
    ],
  },
  {
    name: "Bookings",
    icon: Calendar,
    requiredPermissions: ["booking.view"],
    items: [
      {
        name: "All Bookings",
        href: "/bookings/allBookings",
        icon: Calendar,
        requiredPermissions: ["booking.view"],
      },
      {
        name: "Assignments",
        href: "/bookings/assignments",
        icon: UserCheck,
        requiredPermissions: ["booking.assign"],
      },
      {
        name: "Calendar View",
        href: "/bookings/calendar",
        icon: Calendar,
        requiredPermissions: ["booking.view"],
      },
    ],
  },
  {
    name: "Payments",
    icon: CreditCard,
    requiredAny: ["payment.view", "booking.refund"],
    items: [
      {
        name: "Transactions",
        href: "/payments/transactions",
        icon: CreditCard,
        requiredPermissions: ["payment.view"],
      },
      {
        name: "Payouts",
        href: "/payments/payouts",
        icon: Wallet,
        requiredPermissions: ["payment.view"],
      },
      {
        name: "Refunds",
        href: "/payments/refunds",
        icon: RotateCcw,
        requiredPermissions: ["booking.refund"],
      },
    ],
  },
  {
    name: "Quotes & Requests",
    icon: MessageSquare,
    requiredPermissions: ["booking.view"],
    items: [
      {
        name: "Quote Requests",
        href: "/quotes/quoteRequests",
        icon: MessageSquareDotIcon,
        requiredPermissions: ["booking.view"],
      },
      {
        name: "Custom Services",
        href: "/quotes/customServices",
        icon: Package,
        requiredPermissions: ["booking.view"],
      },
    ],
  },
  {
    name: "Media & Evidence",
    href: "/media",
    icon: ImageIcon,
    requiredPermissions: ["booking.recording.view"],
  },
  {
    name: "Reviews & Disputes",
    icon: Star,
    requiredPermissions: ["complaint.view"],
    items: [
      {
        name: "Reviews",
        href: "/reviews/allReviews",
        icon: Star,
        requiredPermissions: ["complaint.view"],
      },
      {
        name: "Disputes",
        href: "/reviews/disputes",
        icon: HelpCircle,
        requiredPermissions: ["complaint.view"],
      },
    ],
  },
  {
    name: "Support & Tickets",
    icon: Headphones,
    requiredPermissions: ["complaint.view"],
    items: [
      {
        name: "Tickets",
        href: "/support/tickets",
        icon: Headphones,
        requiredPermissions: ["complaint.view"],
      },
      {
        name: "Quick Replies",
        href: "/support/quickReplies",
        icon: MessageSquare,
        requiredPermissions: ["complaint.view"],
      },
    ],
  },
  {
    name: "Promotions",
    icon: Ticket,
    requiredPermissions: ["dashboard.view"],
    items: [
      {
        name: "Coupons",
        href: "/promotions/coupons",
        icon: Ticket,
        requiredPermissions: ["dashboard.view"],
      },
      {
        name: "Banner Ads",
        href: "/promotions/banner",
        icon: Ticket,
        requiredPermissions: ["dashboard.view"],
      },
    ],
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    requiredPermissions: ["notification.view"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    requiredPermissions: ["dashboard.stats"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    requiredPermissions: ["dashboard.view"],
  },
  {
    name: "Audit Logs",
    href: "/audit-logs",
    icon: Activity,
    requiredPermissions: ["logs.view"],
  },
  {
    name: "System Health",
    href: "/system",
    icon: Server,
    requiredPermissions: ["dashboard.analytics"],
  },
  {
    name: "CMS",
    href: "/cms",
    icon: FileText,
    requiredPermissions: ["dashboard.view"],
  },
];

function cls(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminShell({ children }) {
  const { user, loading: authLoading, hasPermission, hasRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchInputRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter navigation based on permissions
  const filteredNav = useMemo(() => {
    if (authLoading || !user) return [];
    return navItems
      .map((item) => {
        if (
          item.requiredPermissions &&
          !item.requiredPermissions.every(hasPermission)
        ) {
          return null;
        }
        if (item.requiredAny && !item.requiredAny.some(hasPermission)) {
          return null;
        }
        if (item.items) {
          const visibleSubItems = item.items.filter((sub) => {
            if (
              sub.requiredPermissions &&
              !sub.requiredPermissions.every(hasPermission)
            ) {
              return false;
            }
            if (sub.requiredAny && !sub.requiredAny.some(hasPermission)) {
              return false;
            }
            return true;
          });
          if (visibleSubItems.length === 0) return null;
          return { ...item, items: visibleSubItems };
        }
        return item;
      })
      .filter(Boolean);
  }, [user, authLoading, hasPermission, pathname]);

  // Auto-open groups containing the current active route
  useEffect(() => {
    const initial = {};
    filteredNav.forEach((item) => {
      if (item.items) {
        const shouldOpen = item.items.some((sub) => {
          return (
            pathname === sub.href ||
            pathname.startsWith(sub.href + "/") ||
            pathname.startsWith(sub.href + "?")
          );
        });
        initial[item.name] = shouldOpen;
      }
    });
    setOpenGroups(initial);
  }, [filteredNav, pathname]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }
  if (filteredNav.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-600">No menu items available for your role.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 w-screen">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cls(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 transition-all duration-300",
          mobileOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full md:translate-x-0",
          collapsed && !mobileOpen && "md:w-20",
        )}
        style={{ borderRight: `1px solid ${COLORS.sidebarBorder}` }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3"
          >
            <Image
              src="/dt-images/dt_logo.jpg"
              alt="DayTaask"
              width={150}
              height={60}
              className="rounded-lg"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </button>
          <button
            onClick={() =>
              mobileOpen ? setMobileOpen(false) : setCollapsed(!collapsed)
            }
            className="block md:hidden p-2 rounded-lg hover:bg-white/10 transition"
          >
            {mobileOpen || !collapsed ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar py-4 px-3 space-y-1">
          {filteredNav.map((item) => {
            if (item.items) {
              const isOpen = openGroups[item.name] || false;
              const hasActive = item.items.some(
                (sub) =>
                  pathname === sub.href || pathname.startsWith(sub.href + "/"),
              );

              return (
                <div key={item.name}>
                  <button
                    onClick={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [item.name]: !isOpen,
                      }))
                    }
                    className={cls(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      collapsed && !mobileOpen ? "justify-center" : "",
                      hasActive
                        ? "bg-orange-500/20 text-orange-400"
                        : "text-gray-300 hover:bg-white/10",
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {(!collapsed || mobileOpen) && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                  {isOpen && (!collapsed || mobileOpen) && (
                    <div className="mt-1 space-y-1 pl-10">
                      {item.items.map((sub) => {
                        const active =
                          pathname === sub.href ||
                          pathname.startsWith(sub.href + "/");
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cls(
                              "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                              active
                                ? "bg-orange-500 text-white"
                                : "text-gray-400 hover:bg-white/10 hover:text-white",
                            )}
                          >
                            <sub.icon className="w-4 h-4" />
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cls(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  collapsed && !mobileOpen ? "justify-center" : "",
                  active
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div
        className={cls(
          "flex-1 flex flex-col transition-all duration-300 w-full overflow-x-scroll",
          collapsed ? "md:ml-20" : "md:ml-64",
        )}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            {/* Left */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 transition md:hidden"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:block p-2 rounded-lg hover:bg-slate-100 transition"
              >
                {collapsed ? (
                  <Menu className="w-5 h-5 text-slate-700" />
                ) : (
                  <X className="w-5 h-5 text-slate-700" />
                )}
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search anything... (Press /)"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-lg hover:bg-slate-100 transition">
                <HelpCircle className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-slate-100 transition relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 h-11 px-3 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.full_name?.[0] || user?.email?.[0] || "AD"}
                  </div>
                  <span className="hidden lg:block font-medium text-slate-800">
                    {user?.full_name || user?.email || "Admin User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden lg:block" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <button className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                      Profile
                    </button>
                    <button className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                      Settings
                    </button>
                    <hr className="border-slate-200" />
                    <button
                      className="w-full text-left px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/logout");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT — CENTERED & FIXED WIDTH */}
        <main className="flex-1 overflow-y-auto scrollbar overflow-x-auto min-w-0">
          <div className="min-h-full py-8">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 min-w-0">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
