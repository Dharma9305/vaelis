"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import API_BASE_URL from "@/lib/api";

import {
  getAdminAuthHeader,
  getAdminProfile,
  hasAdminPermission,
  type AdminProfile,
} from "@/lib/adminAuth";

// =========================================================
// TYPES
// =========================================================

type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE" | string;
  enabled: boolean;
  approved: boolean;
  approvedAt: string | null;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

type ModalType =
  | "create"
  | "edit"
  | "password"
  | "delete"
  | null;

// =========================================================
// PAGE
// =========================================================

export default function AccountManagementPage() {

  const router = useRouter();

  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [modal, setModal] =
    useState<ModalType>(null);

  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  // =======================================================
  // LOAD PROFILE
  // =======================================================

  useEffect(() => {

    let mounted = true;

    async function loadProfile() {

      const adminProfile =
        await getAdminProfile();

      if (!mounted) {
        return;
      }

      if (!adminProfile) {
        router.replace("/admin/login");
        return;
      }

      if (
        !hasAdminPermission(
          adminProfile,
          "ACCOUNT_USERS_VIEW"
        )
      ) {
        router.replace("/admin");
        return;
      }

      setProfile(adminProfile);
    }

    loadProfile();

    return () => {
      mounted = false;
    };

  }, [router]);

  // =======================================================
  // LOAD USERS
  // =======================================================

  async function loadUsers() {

    const authHeader =
      getAdminAuthHeader();

    if (!authHeader) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/api/account-management/users`,
          {
            method: "GET",

            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },

            cache: "no-store",
          }
        );

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
          "Unable to load user accounts."
        );
      }

      const data =
        await response.json();

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Unable to load account users:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load user accounts."
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    if (!profile) {
      return;
    }

    loadUsers();

  }, [profile]);

  // =======================================================
  // HELPERS
  // =======================================================

  function resetForm() {

    setForm({
      username: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
    });

    setShowPassword(false);
  }

  function closeModal() {

    setModal(null);
    setSelectedUser(null);
    setSaving(false);
    resetForm();
  }

  function openCreate() {

    resetForm();

    setModal("create");
  }

  function openEdit(user: AdminUser) {

    setSelectedUser(user);

    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });

    setModal("edit");
  }

  function openPassword(user: AdminUser) {

    setSelectedUser(user);

    setForm({
      username: "",
      email: "",
      password: "",
      role: user.role,
    });

    setModal("password");
  }

  function openDelete(user: AdminUser) {

    setSelectedUser(user);

    setModal("delete");
  }

  async function apiRequest(
    url: string,
    options: RequestInit = {}
  ) {

    const authHeader =
      getAdminAuthHeader();

    if (!authHeader) {
      router.replace("/admin/login");
      throw new Error(
        "Authentication required."
      );
    }

    const response =
      await fetch(
        `${API_BASE_URL}${url}`,
        {
          ...options,

          headers: {
            Authorization: authHeader,
            Accept: "application/json",

            ...(options.body
              ? {
                  "Content-Type":
                    "application/json",
                }
              : {}),

            ...(options.headers || {}),
          },
        }
      );

    if (response.status === 401) {
      router.replace("/admin/login");

      throw new Error(
        "Authentication expired."
      );
    }

    if (!response.ok) {

      const text =
        await response.text();

      throw new Error(
        text ||
        `Request failed with status ${response.status}.`
      );
    }

    const contentType =
      response.headers.get(
        "content-type"
      );

    if (
      contentType?.includes(
        "application/json"
      )
    ) {
      return response.json();
    }

    return null;
  }

  // =======================================================
  // CREATE
  // =======================================================

  async function createUser() {

    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password
    ) {

      setError(
        "Username, email and password are required."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {

      await apiRequest(
        `/api/account-management/users?role=${encodeURIComponent(
          form.role
        )}`,
        {
          method: "POST",

          body: JSON.stringify({
            username:
              form.username.trim(),

            email:
              form.email.trim(),

            password:
              form.password,
          }),
        }
      );

      setMessage(
        "User account created successfully."
      );

      closeModal();

      await loadUsers();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create user."
      );

    } finally {

      setSaving(false);
    }
  }

  // =======================================================
  // UPDATE
  // =======================================================

  async function updateUser() {

    if (!selectedUser) {
      return;
    }

    if (
      !form.username.trim() ||
      !form.email.trim()
    ) {

      setError(
        "Username and email are required."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {

      await apiRequest(
        `/api/account-management/users/${selectedUser.id}`,
        {
          method: "PUT",

          body: JSON.stringify({
            username:
              form.username.trim(),

            email:
              form.email.trim(),

            password:
              form.password || undefined,
          }),
        }
      );

      setMessage(
        "User account updated successfully."
      );

      closeModal();

      await loadUsers();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update user."
      );

    } finally {

      setSaving(false);
    }
  }

  // =======================================================
  // PASSWORD
  // =======================================================

  async function changePassword() {

    if (!selectedUser) {
      return;
    }

    if (
      form.password.length < 8
    ) {

      setError(
        "Password must contain at least 8 characters."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {

      await apiRequest(
        `/api/account-management/users/${selectedUser.id}/password`,
        {
          method: "POST",

          body: JSON.stringify({
            password:
              form.password,
          }),
        }
      );

      setMessage(
        "Password changed successfully."
      );

      closeModal();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to change password."
      );

    } finally {

      setSaving(false);
    }
  }

  // =======================================================
  // ENABLE / DISABLE
  // =======================================================

  async function toggleUser(
    user: AdminUser
  ) {

    setError("");

    try {

      if (user.enabled) {

        await apiRequest(
          `/api/account-management/users/${user.id}/disable`,
          {
            method: "POST",
          }
        );

        setMessage(
          `${user.username} has been disabled.`
        );

      } else {

        await apiRequest(
          `/api/account-management/users/${user.id}/enable`,
          {
            method: "POST",
          }
        );

        setMessage(
          `${user.username} has been enabled.`
        );
      }

      await loadUsers();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to change account status."
      );
    }
  }

  // =======================================================
  // DELETE
  // =======================================================

  async function deleteUser() {

    if (!selectedUser) {
      return;
    }

    setSaving(true);
    setError("");

    try {

      await apiRequest(
        `/api/account-management/users/${selectedUser.id}`,
        {
          method: "DELETE",
        }
      );

      setMessage(
        "User account deleted successfully."
      );

      closeModal();

      await loadUsers();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete user."
      );

    } finally {

      setSaving(false);
    }
  }

  // =======================================================
  // FILTER
  // =======================================================

  const filteredUsers =
    users.filter(
      (user) => {

        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          user.username
            ?.toLowerCase()
            .includes(query) ||

          user.email
            ?.toLowerCase()
            .includes(query) ||

          user.role
            ?.toLowerCase()
            .includes(query)
        );
      }
    );

  // =======================================================
  // LOADING
  // =======================================================

  if (!profile || loading) {

    return (
      <main className="min-h-[70vh] bg-[#050505] px-6 py-16 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="flex items-center gap-3 text-white/50">

            <RefreshCw
              size={18}
              className="animate-spin"
            />

            Loading Account Management...

          </div>

        </div>

      </main>
    );
  }

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/30">

              <Shield size={14} />

              Account Manager

            </div>

            <h1 className="text-3xl font-medium tracking-tight">

              Account Management

            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">

              Manage employee and administrator accounts,
              account status and credentials.

            </p>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={loadUsers}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
            >

              <RefreshCw size={15} />

              Refresh

            </button>

            {hasAdminPermission(
              profile,
              "ACCOUNT_USERS_CREATE"
            ) && (

              <button
                type="button"
                onClick={openCreate}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
              >

                <Plus size={16} />

                Create User

              </button>

            )}

          </div>

        </div>

        {/* =================================================
            MESSAGES
            ================================================= */}

        {error && (

          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">

            {error}

          </div>

        )}

        {message && (

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-green-400/20 bg-green-400/5 px-5 py-4 text-sm text-green-300">

            <span>
              {message}
            </span>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="text-green-300/60 hover:text-green-300"
            >
              <X size={16} />
            </button>

          </div>

        )}

        {/* =================================================
            SUMMARY
            ================================================= */}

        <div className="mt-8 grid gap-4 md:grid-cols-4">

          <SummaryCard
            label="Total Users"
            value={users.length}
          />

          <SummaryCard
            label="Active"
            value={
              users.filter(
                (user) =>
                  user.enabled
              ).length
            }
          />

          <SummaryCard
            label="Pending Approval"
            value={
              users.filter(
                (user) =>
                  !user.approved
              ).length
            }
          />

          <SummaryCard
            label="Disabled"
            value={
              users.filter(
                (user) =>
                  !user.enabled
              ).length
            }
          />

        </div>

        {/* =================================================
            TOOLBAR
            ================================================= */}

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="relative max-w-md flex-1">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search username, email or role..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
            />

          </div>

          <div className="text-xs text-white/30">

            {filteredUsers.length} account
            {filteredUsers.length === 1
              ? ""
              : "s"}

          </div>

        </div>

        {/* =================================================
            USERS TABLE
            ================================================= */}

        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead>

                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/30">

                  <th className="px-6 py-4">
                    User
                  </th>

                  <th className="px-6 py-4">
                    Role
                  </th>

                  <th className="px-6 py-4">
                    Approval
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.025]"
                    >

                      <td className="px-6 py-5">

                        <div className="font-medium">
                          {user.username}
                        </div>

                        <div className="mt-1 text-xs text-white/30">
                          {user.email}
                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                          {user.role}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        {user.approved ? (

                          <span className="inline-flex items-center gap-2 text-xs text-green-300">

                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                            Approved

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-2 text-xs text-yellow-300">

                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />

                            Pending

                          </span>

                        )}

                      </td>

                      <td className="px-6 py-5">

                        {user.enabled ? (

                          <span className="inline-flex items-center gap-2 text-xs text-green-300">

                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                            Enabled

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-2 text-xs text-white/30">

                            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />

                            Disabled

                          </span>

                        )}

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          {hasAdminPermission(
                            profile,
                            "ACCOUNT_USERS_UPDATE"
                          ) && (

                            <ActionButton
                              title="Edit account"
                              onClick={() =>
                                openEdit(user)
                              }
                            >
                              <UserPlus size={15} />
                            </ActionButton>

                          )}

                          {hasAdminPermission(
                            profile,
                            "ACCOUNT_USERS_PASSWORD"
                          ) && (

                            <ActionButton
                              title="Change password"
                              onClick={() =>
                                openPassword(user)
                              }
                            >
                              <KeyRound size={15} />
                            </ActionButton>

                          )}

                          {hasAdminPermission(
                            profile,
                            user.enabled
                              ? "ACCOUNT_USERS_DISABLE"
                              : "ACCOUNT_USERS_ENABLE"
                          ) && (

                            <ActionButton
                              title={
                                user.enabled
                                  ? "Disable account"
                                  : "Enable account"
                              }
                              onClick={() =>
                                toggleUser(user)
                              }
                            >
                              {user.enabled ? (
                                <UserX size={15} />
                              ) : (
                                <UserCheck size={15} />
                              )}
                            </ActionButton>

                          )}

                          {hasAdminPermission(
                            profile,
                            "ACCOUNT_USERS_DELETE"
                          ) && (

                            <ActionButton
                              title="Delete account"
                              danger
                              onClick={() =>
                                openDelete(user)
                              }
                            >
                              <Trash2 size={15} />
                            </ActionButton>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          {!filteredUsers.length && (

            <div className="px-6 py-16 text-center">

              <div className="text-sm text-white/40">
                No user accounts found.
              </div>

              {search && (
                <div className="mt-2 text-xs text-white/20">
                  Try a different search.
                </div>
              )}

            </div>

          )}

        </div>

      </div>

      {/* ===================================================
          CREATE / EDIT / PASSWORD MODAL
          =================================================== */}

      {(modal === "create" ||
        modal === "edit" ||
        modal === "password") && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-medium">

                  {modal === "create"
                    ? "Create User Account"
                    : modal === "edit"
                    ? "Update User Account"
                    : "Change Password"}

                </h2>

                <p className="mt-2 text-sm text-white/30">

                  {modal === "create"
                    ? "Create a new employee or administrator account."
                    : modal === "edit"
                    ? "Update the account information."
                    : `Change the password for ${selectedUser?.username}.`}

                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-white/30 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            {modal !== "password" && (

              <div className="mt-7 space-y-5">

                <Field
                  label="Username"
                  value={form.username}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      username: value,
                    })
                  }
                  disabled={modal === "edit" &&
                    selectedUser?.role ===
                      "SUPER_ADMIN"}
                />

                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      email: value,
                    })
                  }
                />

                {modal === "create" && (

                  <div>

                    <label className="mb-2 block text-xs text-white/40">
                      Role
                    </label>

                    <select
                      value={form.role}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          role:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                    >

                      <option value="EMPLOYEE">
                        EMPLOYEE
                      </option>

                      <option value="ADMIN">
                        ADMIN
                      </option>

                    </select>

                  </div>

                )}

                {modal === "create" && (

                  <PasswordField
                    value={form.password}
                    show={showPassword}
                    onToggle={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    onChange={(value) =>
                      setForm({
                        ...form,
                        password: value,
                      })
                    }
                  />

                )}

              </div>

            )}

            {modal === "password" && (

              <div className="mt-7">

                <PasswordField
                  value={form.password}
                  show={showPassword}
                  onToggle={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  onChange={(value) =>
                    setForm({
                      ...form,
                      password: value,
                    })
                  }
                />

              </div>

            )}

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/50 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={
                  modal === "create"
                    ? createUser
                    : modal === "edit"
                    ? updateUser
                    : changePassword
                }
                className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
              >

                {saving
                  ? "Saving..."
                  : modal === "create"
                  ? "Create Account"
                  : modal === "edit"
                  ? "Save Changes"
                  : "Change Password"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================
          DELETE MODAL
          =================================================== */}

      {modal === "delete" &&
        selectedUser && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-[#0c0c0c] p-7 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">

              <Trash2 size={20} />

            </div>

            <h2 className="mt-6 text-xl font-medium">
              Delete User Account?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">

              This will soft-delete{" "}
              <span className="text-white/70">
                {selectedUser.username}
              </span>
              . The database record will be preserved.

            </p>

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/50 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={deleteUser}
                className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
              >
                {saving
                  ? "Deleting..."
                  : "Delete Account"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">

      <div className="text-xs uppercase tracking-wider text-white/25">
        {label}
      </div>

      <div className="mt-3 text-2xl font-medium">
        {value}
      </div>

    </div>
  );
}

// =========================================================
// FIELD
// =========================================================

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {

  return (
    <div>

      <label className="mb-2 block text-xs text-white/40">
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
      />

    </div>
  );
}

// =========================================================
// PASSWORD FIELD
// =========================================================

function PasswordField({
  value,
  show,
  onToggle,
  onChange,
}: {
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {

  return (
    <div>

      <label className="mb-2 block text-xs text-white/40">
        Password
      </label>

      <div className="relative">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder="Minimum 8 characters"
          className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/30 hover:text-white"
        >

          {show ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}

        </button>

      </div>

    </div>
  );
}

// =========================================================
// ACTION BUTTON
// =========================================================

function ActionButton({
  children,
  title,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
        danger
          ? "border-red-400/10 text-red-300/60 hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
          : "border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
