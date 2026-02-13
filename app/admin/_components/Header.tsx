"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // ← your auth context

export default function AdminHeader() {
  const { logout, user } = useAuth();

  // Safely access user data (with fallbacks)
  const displayName = user?.fullName || user?.name || "Admin";
  const displayEmail = user?.email;
  const isAdmin = user?.role === "admin" || user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LEFT: Logo + Admin title */}
        <div className="flex items-center gap-10">
          {/* Logo + "Stockex Admin" with small space */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center">
              <Image
                src="/images/logo.jpg"
                alt="Stockex Logo"
                width={60}
                height={60}
                className="h-10 w-10 rounded-full object-cover border border-white/20 shadow-md"
                priority
              />
            </Link>

            <Link href="/admin">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white">Stockex</h1>
                <span className="text-xs text-green-500 font-medium -mt-1">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Admin navigation - only "Users" for now */}
          {/* <nav className="hidden md:flex gap-6">
            <Link
              href="/admin/users"
              className="text-gray-300 hover:text-white transition"
            >
              Users
            </Link>
          </nav> */}
        </div>

        {/* RIGHT: User info + Logout */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* User info - name/email + role */}
          <div className="hidden md:flex flex-col items-end">
            <div className="text-sm font-medium text-white">
              {displayName}
            </div>
            <div className="text-xs text-gray-400">
              {displayEmail}
            </div>
            {isAdmin && (
              <div className="text-xs text-green-500 font-medium mt-0.5">
                Admin
              </div>
            )}
          </div>

    
   
          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}