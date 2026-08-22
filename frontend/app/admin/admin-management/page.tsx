"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserX,
  Save,
  Lock,
} from "lucide-react";

import API_BASE_URL from "@/lib/api";
import { getAdminAuthHeader } from "@/lib/adminAuth";

type AdminUser = {
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

type Permission = {
  id: number;
  code: string;
  name: string;
  description: string;
  enabled: boolean;
};

export default function AdminManagementPage() {
  // =========================================================
  // ADMIN STATE
  // =========================================================

  const [admins, setAdmins] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState<number | null>(null);

  // =========================================================
  // PERMISSION STATE
  // =========================================================

  const [permissions, setPermissions] =
    useState<Permission[]>([]);

  const [permissionsLoading, setPermissionsLoading] =
    useState(false);

  const [selectedAdminId, setSelectedAdminId] =
    useState<number | null>(null);

  const [assignedPermissionIds, setAssignedPermissionIds] =
    useState<number[]>([]);

  const [permissionsSaving, setPermissionsSaving] =
    useState(false);

  const [permissionsLoaded, setPermissionsLoaded] =
    useState(false);

  // =========================================================
  // MESSAGES
  // =========================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================================================
  // LOAD APPROVED ADMINS
  // =========================================================

  const loadAdmins = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const authHeader =
          getAdminAuthHeader();

        if (!authHeader) {
          throw new Error(
            "Admin authentication is required."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/super-admin/admins`,
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
              "Only SUPER_ADMIN can manage Admin accounts."
            );
          }

          const message =
            await response.text();

          throw new Error(
            message ||
              "Unable to load Admin accounts."
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
          "Load Admin accounts error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Admin accounts."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // LOAD PERMISSION CATALOGUE
  // =========================================================

  const loadPermissions =
    useCallback(
      async () => {
        try {
          setPermissionsLoading(true);
          setError("");

          const authHeader =
            getAdminAuthHeader();

          if (!authHeader) {
            throw new Error(
              "Admin authentication is required."
            );
          }

          const response =
            await fetch(
              `${API_BASE_URL}/api/super-admin/permissions`,
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
                "Only SUPER_ADMIN can manage permissions."
              );
            }

            const message =
              await response.text();

            throw new Error(
              message ||
                "Unable to load permissions."
            );
          }

          const data =
            await response.json();

          setPermissions(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (err) {
          console.error(
            "Load permissions error:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load permissions."
          );
        } finally {
          setPermissionsLoading(false);
        }
      },
      []
    );

  // =========================================================
  // LOAD ASSIGNED PERMISSIONS
  // =========================================================

  const loadAssignedPermissions =
    useCallback(
      async (adminUserId: number) => {
        try {
          setPermissionsLoading(true);
          setError("");
          setPermissionsLoaded(false);

          const authHeader =
            getAdminAuthHeader();

          if (!authHeader) {
            throw new Error(
              "Admin authentication is required."
            );
          }

          const response =
            await fetch(
              `${API_BASE_URL}/api/super-admin/permissions/admins/${adminUserId}`,
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
                "Only SUPER_ADMIN can view Admin permissions."
              );
            }

            const message =
              await response.text();

            throw new Error(
              message ||
                "Unable to load Admin permissions."
            );
          }

          const data =
            await response.json();

          const assignedIds =
            Array.isArray(data)
              ? data
                  .map(
                    (
                      permission: Permission
                    ) => permission.id
                  )
                  .filter(
                    (
                      id: unknown
                    ): id is number =>
                      typeof id === "number"
                  )
              : [];

          setAssignedPermissionIds(
            assignedIds
          );

          setPermissionsLoaded(true);
        } catch (err) {
          console.error(
            "Load assigned permissions error:",
            err
          );

          setAssignedPermissionIds([]);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Admin permissions."
          );
        } finally {
          setPermissionsLoading(false);
        }
      },
      []
    );

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadAdmins();
    loadPermissions();
  }, [
    loadAdmins,
    loadPermissions,
  ]);

  // =========================================================
  // SELECT ADMIN
  // =========================================================

  async function selectAdmin(
    admin: AdminUser
  ) {
    setSuccess("");
    setError("");

    setSelectedAdminId(
      admin.id
    );

    // =======================================================
    // SUPER ADMIN DOES NOT USE NORMAL PERMISSIONS
    // =======================================================

    if (
      admin.role.toUpperCase() ===
      "SUPER_ADMIN"
    ) {
      setAssignedPermissionIds([]);
      setPermissionsLoaded(true);
      return;
    }

    await loadAssignedPermissions(
      admin.id
    );
  }

  // =========================================================
  // TOGGLE PERMISSION
  // =========================================================

  function togglePermission(
    permissionId: number
  ) {
    setAssignedPermissionIds(
      (current) => {
        if (
          current.includes(
            permissionId
          )
        ) {
          return current.filter(
            (id) =>
              id !== permissionId
          );
        }

        return [
          ...current,
          permissionId,
        ];
      }
    );
  }

  // =========================================================
  // SAVE PERMISSIONS
  // =========================================================

  async function savePermissions() {
    if (
      selectedAdminId === null
    ) {
      return;
    }

    const selectedAdmin =
      admins.find(
        (admin) =>
          admin.id ===
          selectedAdminId
      );

    if (!selectedAdmin) {
      return;
    }

    // =======================================================
    // SUPER ADMIN PROTECTION
    // =======================================================

    if (
      selectedAdmin.role.toUpperCase() ===
      "SUPER_ADMIN"
    ) {
      setError(
        "SUPER_ADMIN accounts always have full access and cannot be managed through Admin permissions."
      );

      return;
    }

    try {
      setPermissionsSaving(true);
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
          `${API_BASE_URL}/api/super-admin/permissions/admins/${selectedAdminId}`,
          {
            method: "PUT",
            headers: {
              Authorization: authHeader,
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify(
              assignedPermissionIds
            ),
          }
        );

      if (!response.ok) {
        if (
          response.status === 403
        ) {
          throw new Error(
            "Only SUPER_ADMIN can modify Admin permissions."
          );
        }

        const message =
          await response.text();

        throw new Error(
          message ||
            "Unable to save permissions."
        );
      }

      const data =
        await response.json();

      const savedIds =
        Array.isArray(data)
          ? data
              .map(
                (
                  permission: Permission
                ) => permission.id
              )
              .filter(
                (
                  id: unknown
                ): id is number =>
                  typeof id === "number"
              )
          : assignedPermissionIds;

      setAssignedPermissionIds(
        savedIds
      );

      setSuccess(
        `Permissions updated successfully for ${selectedAdmin.username}.`
      );

      setPermissionsLoaded(true);
    } catch (err) {
      console.error(
        "Save permissions error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save permissions."
      );
    } finally {
      setPermissionsSaving(false);
    }
  }

  // =========================================================
  // DISABLE ADMIN
  // =========================================================

  async function disableAdmin(
    adminUserId: number
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to disable this Admin account?"
      );

    if (!confirmed) {
      return;
    }

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
          `${API_BASE_URL}/api/super-admin/admins/${adminUserId}/disable`,
          {
            method: "POST",
            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

      if (!response.ok) {
        if (
          response.status === 403
        ) {
          throw new Error(
            "Only SUPER_ADMIN can disable Admin accounts."
          );
        }

        const message =
          await response.text();

        throw new Error(
          message ||
            "Unable to disable Admin account."
        );
      }

      await response.json();

      setSuccess(
        "Admin account disabled successfully."
      );

      await loadAdmins();
    } catch (err) {
      console.error(
        "Disable Admin error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to disable Admin account."
      );
    } finally {
      setActionId(null);
    }
  }

  // =========================================================
  // ENABLE ADMIN
  // =========================================================

  async function enableAdmin(
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
          `${API_BASE_URL}/api/super-admin/admins/${adminUserId}/enable`,
          {
            method: "POST",
            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

      if (!response.ok) {
        if (
          response.status === 403
        ) {
          throw new Error(
            "Only SUPER_ADMIN can enable Admin accounts."
          );
        }

        const message =
          await response.text();

        throw new Error(
          message ||
            "Unable to enable Admin account."
        );
      }

      await response.json();

      setSuccess(
        "Admin account enabled successfully."
      );

      await loadAdmins();
    } catch (err) {
      console.error(
        "Enable Admin error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to enable Admin account."
      );
    } finally {
      setActionId(null);
    }
  }

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  function formatDate(
    value: string | null
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
  // SELECTED ADMIN
  // =========================================================

  const selectedAdmin =
    admins.find(
      (admin) =>
        admin.id ===
        selectedAdminId
    ) || null;

  const isSelectedSuperAdmin =
    selectedAdmin?.role.toUpperCase() ===
    "SUPER_ADMIN";

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
            Admin Management
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Manage approved Admin accounts,
            access and permissions.
          </p>

        </div>

        <button
          type="button"
          onClick={() => {
            loadAdmins();
            loadPermissions();
          }}
          disabled={
            loading ||
            permissionsLoading
          }
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading ||
              permissionsLoading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
          SUCCESS
          ===================================================== */}

      {success && (
        <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/5 px-5 py-4 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING ADMINS
          ===================================================== */}

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">

          <RefreshCw
            size={24}
            className="mx-auto mb-4 animate-spin text-white/40"
          />

          <p className="text-sm text-white/40">
            Loading Admin accounts...
          </p>

        </div>
      )}

      {/* =====================================================
          EMPTY
          ===================================================== */}

      {!loading &&
        admins.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">

            <UserCheck
              size={32}
              className="mx-auto mb-4 text-white/30"
            />

            <h2 className="text-lg font-medium">
              No approved Admin accounts
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Approved Admin accounts will
              appear here.
            </p>

          </div>
        )}

      {/* =====================================================
          ADMIN LIST
          ===================================================== */}

      {!loading &&
        admins.length > 0 && (
          <div className="space-y-4">

            {admins.map(
              (admin) => {

                const processing =
                  actionId ===
                  admin.id;

                const selected =
                  selectedAdminId ===
                  admin.id;

                return (
                  <div
                    key={admin.id}
                    className={`rounded-3xl border bg-white/[0.02] p-6 transition ${
                      selected
                        ? "border-[#c9a227]/40"
                        : "border-white/10"
                    }`}
                  >

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                      {/* =================================
                          ADMIN INFORMATION
                          ================================= */}

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

                        {/* ===============================
                            DETAILS
                            =============================== */}

                        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">

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

                            <div className="mt-1 flex items-center gap-2">

                              <span
                                className={`h-2 w-2 rounded-full ${
                                  admin.enabled
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              />

                              <span
                                className={
                                  admin.enabled
                                    ? "text-green-300"
                                    : "text-red-300"
                                }
                              >
                                {admin.enabled
                                  ? "ACTIVE"
                                  : "DISABLED"}
                              </span>

                            </div>

                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-wider text-white/30">
                              Approved By
                            </p>

                            <p className="mt-1 text-white/50">
                              {admin.approvedBy ||
                                "-"}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-wider text-white/30">
                              Approved At
                            </p>

                            <p className="mt-1 text-white/50">
                              {formatDate(
                                admin.approvedAt
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* =================================
                          ACTIONS
                          ================================= */}

                      <div className="flex shrink-0 flex-wrap gap-3">

                        {/* PERMISSIONS */}

                        {admin.role.toUpperCase() ===
                          "ADMIN" && (
                          <button
                            type="button"
                            onClick={() =>
                              selectAdmin(
                                admin
                              )
                            }
                            className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm transition ${
                              selected
                                ? "border-[#c9a227]/40 bg-[#c9a227]/10 text-[#c9a227]"
                                : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <ShieldCheck
                              size={16}
                            />

                            Permissions
                          </button>
                        )}

                        {/* ENABLE / DISABLE */}

                        {admin.enabled ? (
                          <button
                            type="button"
                            onClick={() =>
                              disableAdmin(
                                admin.id
                              )
                            }
                            disabled={
                              processing
                            }
                            className="flex items-center justify-center gap-2 rounded-full border border-red-500/20 px-5 py-3 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <UserX
                              size={16}
                            />

                            {processing
                              ? "Processing..."
                              : "Disable"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              enableAdmin(
                                admin.id
                              )
                            }
                            disabled={
                              processing
                            }
                            className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CheckCircle2
                              size={16}
                            />

                            {processing
                              ? "Processing..."
                              : "Enable"}
                          </button>
                        )}

                      </div>

                    </div>

                    {/* =====================================
                        PERMISSION PANEL
                        ===================================== */}

                    {selected && (
                      <div className="mt-6 border-t border-white/10 pt-6">

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <div className="flex items-center gap-2">

                              <ShieldCheck
                                size={18}
                                className="text-[#c9a227]"
                              />

                              <h3 className="text-lg font-medium">
                                Permissions
                              </h3>

                            </div>

                            <p className="mt-1 text-sm text-white/40">
                              Control what{" "}
                              <span className="text-white/70">
                                {admin.username}
                              </span>{" "}
                              can access.
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={
                              savePermissions
                            }
                            disabled={
                              permissionsSaving ||
                              permissionsLoading ||
                              !permissionsLoaded
                            }
                            className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {permissionsSaving ? (
                              <RefreshCw
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Save
                                size={16}
                              />
                            )}

                            {permissionsSaving
                              ? "Saving..."
                              : "Save Permissions"}
                          </button>

                        </div>

                        {/* ===============================
                            LOADING
                            =============================== */}

                        {permissionsLoading && (
                          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-8 text-center">

                            <RefreshCw
                              size={22}
                              className="mx-auto mb-3 animate-spin text-white/40"
                            />

                            <p className="text-sm text-white/40">
                              Loading permissions...
                            </p>

                          </div>
                        )}

                        {/* ===============================
                            SUPER ADMIN
                            =============================== */}

                        {isSelectedSuperAdmin && (
                          <div className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/5 p-5">

                            <div className="flex items-start gap-3">

                              <Lock
                                size={18}
                                className="mt-0.5 shrink-0 text-[#c9a227]"
                              />

                              <div>

                                <p className="font-medium text-[#c9a227]">
                                  Full Access
                                </p>

                                <p className="mt-1 text-sm text-white/50">
                                  SUPER_ADMIN has full system
                                  access and does not require
                                  individual permissions.
                                </p>

                              </div>

                            </div>

                          </div>
                        )}

                        {/* ===============================
                            PERMISSIONS
                            =============================== */}

                        {!permissionsLoading &&
                          !isSelectedSuperAdmin &&
                          permissionsLoaded && (
                            <>
                              {permissions.length ===
                              0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">

                                  <p className="text-sm text-white/40">
                                    No permissions are
                                    available.
                                  </p>

                                </div>
                              ) : (
                                <div className="grid gap-3 md:grid-cols-2">

                                  {permissions
                                    .filter(
                                      (
                                        permission
                                      ) =>
                                        permission.enabled
                                    )
                                    .map(
                                      (
                                        permission
                                      ) => {

                                        const checked =
                                          assignedPermissionIds.includes(
                                            permission.id
                                          );

                                        return (
                                          <label
                                            key={
                                              permission.id
                                            }
                                            className={`cursor-pointer rounded-2xl border p-4 transition ${
                                              checked
                                                ? "border-[#c9a227]/40 bg-[#c9a227]/5"
                                                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                                            }`}
                                          >

                                            <div className="flex items-start gap-4">

                                              <input
                                                type="checkbox"
                                                checked={
                                                  checked
                                                }
                                                onChange={() =>
                                                  togglePermission(
                                                    permission.id
                                                  )
                                                }
                                                className="mt-1 h-4 w-4 accent-[#c9a227]"
                                              />

                                              <div className="min-w-0">

                                                <div className="flex flex-wrap items-center gap-2">

                                                  <span className="font-medium">
                                                    {
                                                      permission.name
                                                    }
                                                  </span>

                                                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/40">
                                                    {
                                                      permission.code
                                                    }
                                                  </span>

                                                </div>

                                                <p className="mt-1 text-xs leading-5 text-white/40">
                                                  {
                                                    permission.description
                                                  }
                                                </p>

                                              </div>

                                            </div>

                                          </label>
                                        );
                                      }
                                    )}

                                </div>
                              )}
                            </>
                          )}

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

    </main>
  );
}