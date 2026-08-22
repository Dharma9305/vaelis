"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Check,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";

import API_BASE_URL from "@/lib/api";
import {
  getAdminAuthHeader,
} from "@/lib/adminAuth";

type PendingAdmin = {
  id: number;
  username: string;
  email: string;
  role: string;
  approved: boolean;
  enabled: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminApprovalsPage() {
  const [admins, setAdmins] =
    useState<PendingAdmin[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================================================
  // LOAD PENDING ADMINS
  // =========================================================

  const loadPendingAdmins =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const authHeader =
          getAdminAuthHeader();

        if (!authHeader) {
          throw new Error(
            "Admin authentication is required."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/super-admin/admins/pending`,
            {
              method: "GET",
              headers: {
                Authorization: authHeader,
                Accept: "application/json",
              },
              cache: "no-store",
            }
          );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(
              "Only SUPER_ADMIN can access Admin approvals."
            );
          }

          const message =
            await response.text();

          throw new Error(
            message ||
              "Unable to load pending Admin accounts."
          );
        }

        const data =
          await response.json();

        setAdmins(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {
        console.error(
          "Load pending Admins error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load pending Admin accounts."
        );

      } finally {
        setLoading(false);
      }
    }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadPendingAdmins();
  }, [loadPendingAdmins]);

  // =========================================================
  // APPROVE ADMIN
  // =========================================================

  async function approveAdmin(
    adminUserId: number
  ) {
    try {
      setActionId(adminUserId);
      setError("");
      setSuccess("");

      const authHeader =
        getAdminAuthHeader();

      if (!authHeader) {
        throw new Error(
          "Admin authentication is required."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/super-admin/admins/${adminUserId}/approve`,
          {
            method: "POST",
            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Only SUPER_ADMIN can approve Admin accounts."
          );
        }

        const message =
          await response.text();

        throw new Error(
          message ||
            "Unable to approve Admin account."
        );
      }

      await response.json();

      setSuccess(
        "Admin account approved successfully."
      );

      await loadPendingAdmins();

    } catch (err) {
      console.error(
        "Approve Admin error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to approve Admin account."
      );

    } finally {
      setActionId(null);
    }
  }

  // =========================================================
  // REJECT ADMIN
  // =========================================================

  async function rejectAdmin(
    adminUserId: number
  ) {
    try {
      setActionId(adminUserId);
      setError("");
      setSuccess("");

      const authHeader =
        getAdminAuthHeader();

      if (!authHeader) {
        throw new Error(
          "Admin authentication is required."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/super-admin/admins/${adminUserId}/reject`,
          {
            method: "POST",
            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Only SUPER_ADMIN can reject Admin accounts."
          );
        }

        const message =
          await response.text();

        throw new Error(
          message ||
            "Unable to reject Admin account."
        );
      }

      await response.json();

      setSuccess(
        "Admin account rejected successfully."
      );

      await loadPendingAdmins();

    } catch (err) {
      console.error(
        "Reject Admin error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to reject Admin account."
      );

    } finally {
      setActionId(null);
    }
  }

  // =========================================================
  // FORMAT DATE
  // =========================================================

  function formatDate(
    value: string
  ) {
    if (!value) {
      return "-";
    }

    try {
      return new Date(
        value
      ).toLocaleString();
    } catch {
      return value;
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <ShieldCheck
              size={20}
              className="text-[#c9a227]"
            />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#c9a227]">
              Super Admin
            </span>

          </div>

          <h1 className="text-3xl font-semibold">
            Admin Approvals
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Review and approve Admin account requests.
          </p>

        </div>

        <button
          type="button"
          onClick={loadPendingAdmins}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
          SUCCESS MESSAGE
          ===================================================== */}

      {success && (
        <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/5 px-5 py-4 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
          ===================================================== */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING
          ===================================================== */}

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">

          <RefreshCw
            size={24}
            className="mx-auto mb-4 animate-spin text-white/40"
          />

          <p className="text-sm text-white/40">
            Loading pending Admin accounts...
          </p>

        </div>
      )}

      {/* =====================================================
          EMPTY STATE
          ===================================================== */}

      {!loading &&
        admins.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">

            <UserCheck
              size={32}
              className="mx-auto mb-4 text-green-400/70"
            />

            <h2 className="text-lg font-medium">
              No pending Admin accounts
            </h2>

            <p className="mt-2 text-sm text-white/40">
              All Admin registration requests have
              been processed.
            </p>

          </div>
        )}

      {/* =====================================================
          ADMIN LIST
          ===================================================== */}

      {!loading &&
        admins.length > 0 && (
          <div className="space-y-4">

            {admins.map((admin) => {

              const processing =
                actionId === admin.id;

              return (
                <div
                  key={admin.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* =====================================
                        ADMIN INFORMATION
                        ===================================== */}

                    <div className="min-w-0">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5">
                          <UserCheck
                            size={20}
                            className="text-white/50"
                          />
                        </div>

                        <div className="min-w-0">

                          <h2 className="truncate text-lg font-medium">
                            {admin.username}
                          </h2>

                          <p className="truncate text-sm text-white/40">
                            {admin.email}
                          </p>

                        </div>

                      </div>

                      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">

                        <div>
                          <p className="text-xs uppercase tracking-wider text-white/30">
                            Role
                          </p>

                          <p className="mt-1 text-white/70">
                            {admin.role}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-white/30">
                            Status
                          </p>

                          <p className="mt-1 text-yellow-300">
                            Pending Approval
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-white/30">
                            Registered
                          </p>

                          <p className="mt-1 text-white/50">
                            {formatDate(
                              admin.createdAt
                            )}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* =====================================
                        ACTIONS
                        ===================================== */}

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">

                      <button
                        type="button"
                        onClick={() =>
                          approveAdmin(
                            admin.id
                          )
                        }
                        disabled={processing}
                        className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check size={16} />

                        {processing
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          rejectAdmin(
                            admin.id
                          )
                        }
                        disabled={processing}
                        className="flex items-center justify-center gap-2 rounded-full border border-red-500/20 px-6 py-3 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <UserX size={16} />

                        Reject
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </main>
  );
}