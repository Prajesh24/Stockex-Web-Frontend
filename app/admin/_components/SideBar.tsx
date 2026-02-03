"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const pathName = usePathname();

  const linkClass = (href: string) =>
    clsx(
      "block py-2 px-4 rounded transition",
      pathName === href
        ? "bg-blue-700 text-white"
        : "hover:bg-blue-700 text-white",
    );
  return (
    <aside className="w-64 bg-blue-800 text-white flex flex-col">
      {
        <div className="p-6 flex items-center space-x-2">
          {/* <img src="images/logoName.png" alt="Admin Logo" className="h-8 w-8" /> */}
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
      }

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/admin" className={linkClass("/admin")}>
          Dashboard
        </Link>
        <Link href="/admin/users" className={linkClass("/admin/users")}>
          Users
        </Link>

      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center justify-between">
          <span>Admin Name</span>
          <button className="bg-white text-blue-800 px-3 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}