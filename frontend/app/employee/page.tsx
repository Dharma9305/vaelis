"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  CalendarDays,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  clearEmployeeCredentials,
  getEmployeeAuthHeader,
  type EmployeeProfile,
} from "@/lib/employeeAuth";

import API_BASE_URL from "@/lib/api";

export default function EmployeeDashboardPage() {

  const router =
    useRouter();

  const [employee, setEmployee] =
    useState<EmployeeProfile | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    let mounted = true;

    async function loadEmployee() {

      const authHeader =
        getEmployeeAuthHeader();

      if (!authHeader) {

        router.replace(
          "/employee/login"
        );

        return;
      }

      try {

        const response =
          await fetch(
            `${API_BASE_URL}/api/employee/me`,
            {
              method: "GET",

              headers: {
                Authorization:
                  authHeader,

                Accept:
                  "application/json",
              },

              cache:
                "no-store",
            }
          );

        // ===================================================
        // AUTHENTICATION FAILURE
        // ===================================================

        if (
          response.status === 401 ||
          response.status === 403
        ) {

          clearEmployeeCredentials();

          router.replace(
            "/employee/login"
          );

          return;
        }

        if (
          !response.ok
        ) {

          const message =
            await response.text();

          throw new Error(
            message ||
            "Unable to load employee profile."
          );
        }

        const profile =
          (
            await response.json()
          ) as EmployeeProfile;

        if (mounted) {

          setEmployee(
            profile
          );
        }

      } catch (error) {

        console.error(
          "Unable to load employee dashboard:",
          error
        );

        if (mounted) {

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load employee profile."
          );
        }

      } finally {

        if (mounted) {

          setLoading(false);
        }
      }
    }

    loadEmployee();

    return () => {

      mounted = false;
    };

  }, [router]);

  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {

    clearEmployeeCredentials();

    router.replace(
      "/employee/login"
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">

        <div className="flex items-center gap-3 text-white/60">

          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading employee portal...

        </div>

      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">

        <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

          <h1 className="text-xl font-medium">
            Unable to load employee profile
          </h1>

          <p className="mt-3 text-sm text-red-300">
            {error}
          </p>

          <button
            onClick={() =>
              handleLogout()
            }
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black"
          >
            Return to Login
          </button>

        </div>

      </main>
    );
  }

  if (!employee) {

    return null;
  }

  const fullName =
    [
      employee.firstName,
      employee.middleName,
      employee.lastName,
    ]
      .filter(Boolean)
      .join(" ");

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-white/10 bg-white/[0.02]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>

            <p className="text-xl font-semibold tracking-[0.25em]">
              VAELIS
            </p>

            <p className="mt-1 text-xs text-white/40">
              EMPLOYEE PORTAL
            </p>

          </div>

          <button
            onClick={
              handleLogout
            }
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >

            <LogOut
              size={16}
            />

            Sign Out

          </button>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* ===================================================
            WELCOME
        =================================================== */}

        <div className="mb-8">

          <p className="text-sm text-white/40">
            Employee Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-medium">
            Welcome,{" "}
            {employee.preferredName ||
              employee.firstName}
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Your VAELIS employee profile
          </p>

        </div>

        {/* ===================================================
            PROFILE SUMMARY
        =================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =================================================
              IDENTITY
          ================================================= */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

                <UserRound
                  size={26}
                  className="text-white/70"
                />

              </div>

              <div>

                <h2 className="text-xl font-medium">
                  {fullName}
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  {employee.employeeCode}
                </p>

              </div>

            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">

              <InfoItem
                icon={
                  <Building2
                    size={18}
                  />
                }
                label="Designation"
                value={
                  employee.designation ||
                  employee.jobTitle ||
                  "—"
                }
              />

              <InfoItem
                icon={
                  <Building2
                    size={18}
                  />
                }
                label="Department"
                value={
                  employee.department ||
                  "—"
                }
              />

              <InfoItem
                icon={
                  <MapPin
                    size={18}
                  />
                }
                label="Work Location"
                value={
                  employee.workLocation ||
                  employee.branch ||
                  "—"
                }
              />

              <InfoItem
                icon={
                  <CalendarDays
                    size={18}
                  />
                }
                label="Date of Joining"
                value={
                  employee.dateOfJoining ||
                  "—"
                }
              />

            </div>

          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center gap-3">

              <ShieldCheck
                size={22}
                className="text-white/60"
              />

              <h2 className="font-medium">
                Employment Status
              </h2>

            </div>

            <div className="mt-8">

              <p className="text-3xl font-medium">
                {employee.employmentStatus ||
                  "—"}
              </p>

              <p className="mt-2 text-sm text-white/40">
                Current employment status
              </p>

            </div>

            {employee.employmentType && (
              <div className="mt-8 border-t border-white/10 pt-5">

                <p className="text-xs uppercase tracking-wider text-white/30">
                  Employment Type
                </p>

                <p className="mt-2 text-sm text-white/70">
                  {employee.employmentType}
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ===================================================
            CONTACT INFORMATION
        =================================================== */}

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <h2 className="text-lg font-medium">
            Contact Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <InfoItem
              icon={
                <Mail
                  size={18}
                />
              }
              label="Official Email"
              value={
                employee.officialEmail ||
                "—"
              }
            />

            <InfoItem
              icon={
                <Mail
                  size={18}
                />
              }
              label="Personal Email"
              value={
                employee.personalEmail ||
                "—"
              }
            />

            <InfoItem
              icon={
                <Phone
                  size={18}
                />
              }
              label="Primary Mobile"
              value={
                employee.primaryMobile ||
                "—"
              }
            />

            <InfoItem
              icon={
                <Phone
                  size={18}
                />
              }
              label="Alternate Mobile"
              value={
                employee.alternateMobile ||
                "—"
              }
            />

          </div>

        </div>

        {/* ===================================================
            PORTAL SECTIONS
        =================================================== */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <PortalCard
            title="My Profile"
            description="View and manage your employee information."
          />

          <PortalCard
            title="Documents"
            description="View your employment and verification documents."
          />

          <PortalCard
            title="Employment History"
            description="View your previous employment records."
          />

        </div>

      </div>

    </main>
  );
}

// =========================================================
// INFO ITEM
// =========================================================

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {

  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 text-white/40">
        {icon}
      </div>

      <div>

        <p className="text-xs uppercase tracking-wider text-white/30">
          {label}
        </p>

        <p className="mt-1 text-sm text-white/70">
          {value}
        </p>

      </div>

    </div>
  );
}

// =========================================================
// PORTAL CARD
// =========================================================

function PortalCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <h3 className="font-medium">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/40">
        {description}
      </p>

    </div>
  );
}