"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("vaelis_admin_auth");
    router.push("/admin/login");
  }

  const isLoginPage =
    pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* LOGO */}

          <Link
            href="/admin"
            className="text-lg font-semibold tracking-[0.25em]"
          >
            VAELIS
          </Link>

          {/* NAVIGATION */}

          <nav className="flex items-center gap-2">

            <Link
              href="/admin"
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                pathname === "/admin"
                  ? "bg-white text-black"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              href="/admin/orders"
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                pathname.startsWith(
                  "/admin/orders"
                )
                  ? "bg-white text-black"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ShoppingBag size={16} />
              Orders
            </Link>

            <button
              onClick={handleLogout}
              className="ml-2 flex items-center gap-2 rounded-full border border-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
            >
              <LogOut size={16} />
              Logout
            </button>

          </nav>

        </div>

      </header>

      {/* PAGE */}

      {children}

    </div>
  );
}