"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LogOut, LayoutDashboard, Users } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    clsx(
      "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
      pathname === href
        ? "bg-green-600/90 text-white shadow-sm"
        : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
    );

  return (
    <aside className="w-64 bg-gray-950/95 backdrop-blur-lg border-r border-white/5 flex flex-col h-screen sticky top-0 z-40">

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <Link href="/admin" className={linkClass("/admin")}>
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link href="/admin/users" className={linkClass("/admin/users")}>
          <Users className="h-5 w-5" />
          <span>User Details</span>
        </Link>

        {/* Add more links later here */}
        {/* <Link href="/admin/settings" className={linkClass("/admin/settings")}>
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link> */}
      </nav>

      {/* Footer / Logout */}
      {/* <div className="p-4 border-t border-white/5 mt-auto">
        <button
          onClick={() => {
            // Call your logout function here
            console.log("Logging out...");
            // logout();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div> */}
    </aside>
  );
}