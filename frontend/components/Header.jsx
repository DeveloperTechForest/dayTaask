// components/Header.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Home,
  Info,
  List,
  Mail,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  // Close mobile menu after navigation
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  console.log("Auth state in Header:", { user, loading });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm transition-shadow duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/dt-images/dt_logo-nobg.png"
              alt="DayTaask"
              width={200}
              height={60}
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 hover:scale-105"
              priority
            />
          </Link>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5"
            >
              <List className="w-4 h-4" />
              Categories
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              Contact
            </Link>
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Become a Taaskr Button */}
            {!loading && (!user || user?.error) ? (
              <Link href="/register">
                <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-[var(--color-primary)] rounded-lg transition-all shadow-md whitespace-nowrap">
                  Become a Taaskr
                </button>
              </Link>
            ) : (
              <p className="hidden sm:block text-sm text-gray-500 capitalize">
                Welcome, {user?.full_name || "Guest User"}
              </p>
            )}

            {/* Auth Area */}
            {!loading && (!user || user?.error) ? (
              <Link href="/auth/login">
                <button className="px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-all">
                  Login
                </button>
              </Link>
            ) : user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <Image
                    src={user.profile_image || "/icons/user.png"}
                    alt="Profile"
                    width={44}
                    height={44}
                    className=" object-cover w-11 h-11 sm:w-12 sm:h-12"
                  />
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-xl border border-gray-200 py-2 z-50 animate-fade-in">
                    <Link
                      href="/user/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>

                    <Link
                      href="/user/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile Hamburger */}
            <button
              className="p-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3">
              <Image
                src="/dt-images/dt_logo-nobg.png"
                alt="DayTaask"
                width={140}
                height={50}
                className="h-10 w-auto object-contain"
              />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-7 h-7 text-gray-700" />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-lg font-medium bg-white p-6">
              <Link
                href="/"
                className="flex items-center gap-3 text-gray-800 hover:text-[var(--color-primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 text-gray-800 hover:text-[var(--color-primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Info className="w-5 h-5" />
                About
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-3 text-gray-800 hover:text-[var(--color-primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <List className="w-5 h-5" />
                Categories
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 text-gray-800 hover:text-[var(--color-primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="w-5 h-5" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
