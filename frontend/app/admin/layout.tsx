"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
} from "lucide-react";

import {
  getAdminCredentials,
  clearAdminCredentials,
} from "@/lib/adminAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const isLoginPage =
    pathname === "/admin/login";

  // =========================================================
  // ADMIN AUTHENTICATION CHECK
  // =========================================================

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    const credentials =
      getAdminCredentials();

    if (!credentials) {
      router.replace("/admin/login");
      return;
    }

    setCheckingAuth(false);
  }, [isLoginPage, router]);

  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {
    clearAdminCredentials();
    router.push("/admin/login");
  }

  // =========================================================
  // LOGIN PAGE
  // =========================================================

  if (isLoginPage) {
    return <>{children}</>;
  }

  // =========================================================
  // AUTH CHECK LOADING
  // =========================================================

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-sm text-white/40">
          Checking authentication...
        </p>
      </div>
    );
  }

  // =========================================================
  // ADMIN LAYOUT
  // =========================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* HEADER */}

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

            {/* DASHBOARD */}

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

            {/* ORDERS */}

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

            {/* LOGOUT */}

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