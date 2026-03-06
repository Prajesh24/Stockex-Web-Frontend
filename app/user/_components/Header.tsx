"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  User,
  ChevronDown,
  LineChart,
  Briefcase,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UserHeader() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.fullName || user?.name || "User";
  const displayEmail = user?.email;
  const isAdmin = user?.role === "admin" || user?.role === "ADMIN";
  const avatar = user?.imageUrl
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}`
    : "/images/avatar.png";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setOpen(false);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="StockEx Logo"
            width={60}
            height={60}
            className="h-10 w-10 rounded-full object-cover border border-white/20 shadow-md"
            priority
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">StockEx</h1>
            <span className="text-xs text-green-500 font-medium -mt-1">
              {isAdmin ? "Admin Panel" : "User Dashboard"}
            </span>
          </div>
        </div>

        {/* CENTER: Navigation (hidden on mobile) */}
        <div className="hidden md:flex items-center rounded-full bg-white/5 border border-white/10 px-6 py-2">
          <nav className="flex items-center gap-8">
            <Link
              href="/user/market"
              className="relative flex items-center gap-1.5 px-4 py-1 text-gray-300 hover:text-white transition after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-green-500 hover:after:w-full after:transition-all"
            >
              <LineChart className="h-4 w-4" /> Market
            </Link>

            <Link
              href="/user/portfolio"
              className="relative flex items-center gap-1.5 px-4 py-1 text-gray-300 hover:text-white transition after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-green-500 hover:after:w-full after:transition-all"
            >
              <Briefcase className="h-4 w-4" /> Portfolio
            </Link>

            <Link
              href="/user/watchlist"
              className="relative flex items-center gap-1.5 px-4 py-1 text-gray-300 hover:text-white transition after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-green-500 hover:after:w-full after:transition-all"
            >
              <Star className="h-4 w-4" /> Watchlist
            </Link>
          </nav>
        </div>

        {/* RIGHT: Avatar + Dropdown */}
        <div className="relative inline-block text-left z-50" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={`
              flex items-center gap-2 rounded-full p-1 
              transition-all duration-200
              ${open 
                ? 'ring-2 ring-green-500/40 ring-offset-2 ring-offset-black' 
                : 'hover:ring-2 hover:ring-white/20 hover:bg-white/5'}
              focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:ring-offset-2 focus:ring-offset-black
            `}
          >
            <div className="relative">
              <Image
                src={avatar}
                alt="User Avatar"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover border-2 border-white/10 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-black"></span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              className={`
                absolute right-0 mt-2 w-60 origin-top-left 
                rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl 
                shadow-2xl shadow-black/50 
                ring-1 ring-black/5 focus:outline-none
                animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150
              `}
            >
              {/* Profile Header */}
              <div className="px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{displayEmail}</p>
                    {isAdmin && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  href="/user/profile"
                  onClick={() => setOpen(false)}
                  className="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                  Edit Profile
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-white/10 py-2">
                <button
                  onClick={handleLogoutClick}
                  className="group flex w-full items-center px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5 text-red-400/80 group-hover:text-red-300 transition-colors" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-black rounded-xl p-6 w-80 border border-white/10 shadow-2xl">
            <h2 className="text-white text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
