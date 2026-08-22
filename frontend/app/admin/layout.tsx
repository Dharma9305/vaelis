"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  Users,
  Package,
  LogOut,
} from "lucide-react";

import {
  getAdminCredentials,
  clearAdminCredentials,
  getAdminProfile,
  hasAdminPermission,
  type AdminProfile,
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
    
  const [checkingRoutePermission, setCheckingRoutePermission] =
  useState(true);

  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const isLoginPage =
    pathname === "/admin/login";

  // =========================================================
  // AUTHENTICATION + PERMISSION LOAD
  // =========================================================

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    let mounted = true;

    async function checkAuthentication() {
      const credentials =
        getAdminCredentials();

      if (!credentials) {
        router.replace("/admin/login");
        return;
      }

      const adminProfile =
        await getAdminProfile();

      if (!adminProfile) {
        clearAdminCredentials();
        router.replace("/admin/login");
        return;
      }

      if (mounted) {
        setProfile(adminProfile);
        setCheckingAuth(false);
      }
    }

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, [isLoginPage, router]);
    // =========================================================
  // SUPER ADMIN ROUTE PROTECTION
  // =========================================================

  useEffect(() => {

    if (isLoginPage) {
      setCheckingRoutePermission(false);
      return;
    }

    if (checkingAuth) {
      return;
    }

    if (!profile) {
      return;
    }

    const superAdminOnlyRoute =
      pathname.startsWith(
        "/admin/admin-management"
      ) ||
      pathname.startsWith(
        "/admin/admin-approvals"
      );

    if (
      superAdminOnlyRoute &&
      profile.role !== "SUPER_ADMIN"
    ) {

      setCheckingRoutePermission(false);

      router.replace("/admin");

      return;
    }

    setCheckingRoutePermission(false);

  }, [
    pathname,
    profile,
    checkingAuth,
    isLoginPage,
    router,
  ]);
  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {
    clearAdminCredentials();
    setProfile(null);

    router.push(
      "/admin/login"
    );
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

  if (
  checkingAuth ||
  checkingRoutePermission
) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-sm text-white/40">
          Checking authentication...
        </p>
      </div>
    );
  }

  // =========================================================
  // PERMISSION HELPERS
  // =========================================================

  const isSuperAdmin =
    profile?.role ===
    "SUPER_ADMIN";
  const canViewDashboard =
  hasAdminPermission(
    profile,
    "DASHBOARD_VIEW"
  );
  const canViewProducts =
    hasAdminPermission(
      profile,
      "PRODUCTS_VIEW"
    );

  const canViewOrders =
    hasAdminPermission(
      profile,
      "ORDERS_VIEW"
    );

  // =========================================================
  // ADMIN LAYOUT
  // =========================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* =================================================
              LOGO
              ================================================= */}

          {canViewDashboard && (
          <Link
            href="/admin"
            className="text-lg font-semibold tracking-[0.25em]"
          >
            VAELIS
          </Link>
          )}
          {/* =================================================
              NAVIGATION
              ================================================= */}

          <nav className="flex items-center gap-2">

            {/* ===============================================
                DASHBOARD
                =============================================== */}

            <Link
              href="/admin"
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                pathname === "/admin"
                  ? "bg-white text-black"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard
                size={16}
              />

              Dashboard
            </Link>

            {/* ===============================================
                PRODUCTS
                PRODUCTS_VIEW
                =============================================== */}

            {canViewProducts && (
              <Link
                href="/admin/products"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  pathname.startsWith(
                    "/admin/products"
                  )
                    ? "bg-white text-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Package
                  size={16}
                />

                Products
              </Link>
            )}

            {/* ===============================================
                ORDERS
                ORDERS_VIEW
                =============================================== */}

            {canViewOrders && (
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
                <ShoppingBag
                  size={16}
                />

                Orders
              </Link>
            )}

            {/* ===============================================
                SUPER ADMIN — ADMIN APPROVALS
                =============================================== */}

            {isSuperAdmin && (
              <Link
                href="/admin/admin-approvals"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  pathname.startsWith(
                    "/admin/admin-approvals"
                  )
                    ? "bg-white text-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <ShieldCheck
                  size={16}
                />

                Admin Approvals
              </Link>
            )}

            {/* ===============================================
                SUPER ADMIN — ADMIN MANAGEMENT
                =============================================== */}

            {isSuperAdmin && (
              <Link
                href="/admin/admin-management"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  pathname.startsWith(
                    "/admin/admin-management"
                  )
                    ? "bg-white text-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Users
                  size={16}
                />

                Admin Management
              </Link>
            )}

            {/* ===============================================
                ROLE
                =============================================== */}

            {profile && (
              <div className="ml-2 hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs sm:flex">

                <span className="text-white/40">
                  {profile.username}
                </span>

                <span
                  className={
                    profile.role ===
                    "SUPER_ADMIN"
                      ? "text-[#c9a227]"
                      : "text-white/60"
                  }
                >
                  {profile.role}
                </span>

              </div>
            )}

            {/* ===============================================
                LOGOUT
                =============================================== */}

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="ml-2 flex items-center gap-2 rounded-full border border-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
            >
              <LogOut
                size={16}
              />

              Logout
            </button>

          </nav>

        </div>

      </header>

      {/* =====================================================
          PAGE
          ===================================================== */}

      {children}

    </div>
  );
}