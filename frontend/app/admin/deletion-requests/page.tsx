"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  Check,
  Clock,
  RefreshCw,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import API_BASE_URL from "@/lib/api";

import {
  getAdminAuthHeader,
  getAdminProfile,
  type AdminProfile,
} from "@/lib/adminAuth";

// =========================================================
// TYPES
// =========================================================

type DeletionRequest = {
  id: number;
  username: string;
  email: string;
  role: string;

  enabled: boolean;
  approved: boolean;

  createdAt: string;
  updatedAt: string;

  deletionPending: boolean;
  deletionPreviousEnabled: boolean;

  deletionRequestedAt: string | null;
  deletionRequestedBy: string | null;

  deletionApprovedAt: string | null;
  deletionApprovedBy: string | null;

  deletionRejectedAt: string | null;
  deletionRejectedBy: string | null;
  deletionRejectionReason: string | null;
};

// =========================================================
// PAGE
// =========================================================

export default function DeletionRequestsPage() {

  const router = useRouter();

  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const [requests, setRequests] =
    useState<DeletionRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [selectedRequest, setSelectedRequest] =
    useState<DeletionRequest | null>(null);

  const [modal, setModal] =
    useState<
      "approve" |
      "reject" |
      null
    >(null);

  const [reason, setReason] =
    useState("");

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
        adminProfile.role !==
        "SUPER_ADMIN"
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
  // LOAD DELETION REQUESTS
  // =======================================================

  async function loadRequests() {

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
          `${API_BASE_URL}/api/super-admin/deletion-requests`,
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

      if (response.status === 403) {
        router.replace("/admin");
        return;
      }

      if (!response.ok) {

        const text =
          await response.text();

        throw new Error(
          text ||
          "Unable to load deletion requests."
        );
      }

      const data =
        await response.json();

      setRequests(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Unable to load deletion requests:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load deletion requests."
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    if (!profile) {
      return;
    }

    loadRequests();

  }, [profile]);

  // =======================================================
  // CLOSE MODAL
  // =======================================================

  function closeModal() {

    if (saving) {
      return;
    }

    setModal(null);
    setSelectedRequest(null);
    setReason("");
  }

  // =======================================================
  // OPEN APPROVE
  // =======================================================

  function openApprove(
    request: DeletionRequest
  ) {

    setSelectedRequest(request);
    setModal("approve");
  }

  // =======================================================
  // OPEN REJECT
  // =======================================================

  function openReject(
    request: DeletionRequest
  ) {

    setSelectedRequest(request);
    setReason("");
    setModal("reject");
  }

  // =======================================================
  // APPROVE
  // =======================================================

  async function approveDeletion() {

    if (!selectedRequest) {
      return;
    }

    const authHeader =
      getAdminAuthHeader();

    if (!authHeader) {
      router.replace("/admin/login");
      return;
    }

    setSaving(true);
    setError("");

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/api/super-admin/deletion-requests/${selectedRequest.id}/approve`,
          {
            method: "POST",

            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "Only Super Admin can approve deletion requests."
        );
      }

      if (!response.ok) {

        const text =
          await response.text();

        throw new Error(
          text ||
          "Unable to approve deletion request."
        );
      }

      setMessage(
        `Deletion approved for ${selectedRequest.username}.`
      );

      closeModal();

      await loadRequests();

    } catch (err) {

      console.error(
        "Unable to approve deletion:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to approve deletion request."
      );

    } finally {

      setSaving(false);
    }
  }

  // =======================================================
  // REJECT
  // =======================================================

  async function rejectDeletion() {

    if (!selectedRequest) {
      return;
    }

    const trimmedReason =
      reason.trim();

    if (!trimmedReason) {

      setError(
        "A rejection reason is required."
      );

      return;
    }

    const authHeader =
      getAdminAuthHeader();

    if (!authHeader) {
      router.replace("/admin/login");
      return;
    }

    setSaving(true);
    setError("");

    try {

      const url =
        `${API_BASE_URL}/api/super-admin/deletion-requests/${selectedRequest.id}/reject?reason=${encodeURIComponent(
          trimmedReason
        )}`;

      const response =
        await fetch(
          url,
          {
            method: "POST",

            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "Only Super Admin can reject deletion requests."
        );
      }

      if (!response.ok) {

        const text =
          await response.text();

        throw new Error(
          text ||
          "Unable to reject deletion request."
        );
      }

      setMessage(
        `Deletion request rejected for ${selectedRequest.username}.`
      );

      closeModal();

      await loadRequests();

    } catch (err) {

      console.error(
        "Unable to reject deletion:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to reject deletion request."
      );

    } finally {

      setSaving(false);
    }
  }

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

            Loading Deletion Requests...

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

              Super Admin

            </div>

            <h1 className="text-3xl font-medium tracking-tight">

              Deletion Requests

            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">

              Review account deletion requests submitted
              by Account Managers.

            </p>

          </div>

          <button
            type="button"
            onClick={loadRequests}
            disabled={loading}
            className="flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-40 md:self-auto"
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>

        {/* =================================================
            MESSAGES
            ================================================= */}

        {error && (

          <div className="mt-6 flex items-start justify-between rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="ml-4 text-red-300/60 hover:text-red-300"
            >
              <X size={16} />
            </button>

          </div>

        )}

        {message && (

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-green-400/20 bg-green-400/5 px-5 py-4 text-sm text-green-300">

            <span>
              {message}
            </span>

            <button
              type="button"
              onClick={() =>
                setMessage("")
              }
              className="text-green-300/60 hover:text-green-300"
            >
              <X size={16} />
            </button>

          </div>

        )}

        {/* =================================================
            SUMMARY
            ================================================= */}

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <SummaryCard
            label="Pending Requests"
            value={requests.length}
          />

          <SummaryCard
            label="Accounts Frozen"
            value={
              requests.filter(
                (request) =>
                  !request.enabled
              ).length
            }
          />

          <SummaryCard
            label="Requires Review"
            value={requests.length}
          />

        </div>

        {/* =================================================
            REQUESTS
            ================================================= */}

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">

          {requests.length > 0 ? (

            <div className="divide-y divide-white/5">

              {requests.map(
                (request) => (

                  <div
                    key={request.id}
                    className="p-6 transition hover:bg-white/[0.02]"
                  >

                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                      {/* USER */}

                      <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/5 text-red-300">

                          <Trash2
                            size={19}
                          />

                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <h2 className="font-medium">

                              {request.username}

                            </h2>

                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">

                              {request.role}

                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/5 px-3 py-1 text-xs text-yellow-300">

                              <Clock
                                size={12}
                              />

                              Pending Review

                            </span>

                          </div>

                          <div className="mt-2 text-sm text-white/30">

                            {request.email}

                          </div>

                          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/30">

                            <span className="inline-flex items-center gap-2">

                              <User
                                size={13}
                              />

                              Requested by:
                              <span className="text-white/50">
                                {request.deletionRequestedBy ||
                                  "Unknown"}
                              </span>

                            </span>

                            <span>

                              Requested:{" "}

                              <span className="text-white/50">

                                {formatDate(
                                  request.deletionRequestedAt
                                )}

                              </span>

                            </span>

                          </div>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex shrink-0 gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            openReject(request)
                          }
                          className="flex items-center justify-center gap-2 rounded-full border border-red-400/20 px-5 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10"
                        >

                          <X size={15} />

                          Reject

                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openApprove(request)
                          }
                          className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
                        >

                          <Check size={15} />

                          Approve Deletion

                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/10 bg-green-400/5 text-green-300">

                <Check size={22} />

              </div>

              <div className="mt-5 text-sm text-white/50">

                No pending deletion requests.

              </div>

              <div className="mt-2 text-xs text-white/20">

                All account deletion requests have
                been reviewed.

              </div>

            </div>

          )}

        </div>

      </div>

      {/* ===================================================
          APPROVE MODAL
          =================================================== */}

      {modal === "approve" &&
        selectedRequest && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-[#0c0c0c] p-7 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">

              <AlertTriangle
                size={21}
              />

            </div>

            <h2 className="mt-6 text-xl font-medium">

              Approve Account Deletion?

            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">

              You are approving the deletion request
              for{" "}

              <span className="text-white/70">

                {selectedRequest.username}

              </span>
              .

            </p>

            <div className="mt-4 rounded-2xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-xs leading-5 text-red-300/80">

              The account will remain preserved in the
              database as a soft-deleted account and will
              no longer be available to active account
              management.

            </div>

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/50 hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={approveDeletion}
                disabled={saving}
                className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >

                {saving
                  ? "Approving..."
                  : "Approve Deletion"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================
          REJECT MODAL
          =================================================== */}

      {modal === "reject" &&
        selectedRequest && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-300">

                  <AlertTriangle
                    size={20}
                  />

                </div>

                <h2 className="mt-6 text-xl font-medium">

                  Reject Deletion Request

                </h2>

                <p className="mt-2 text-sm leading-6 text-white/30">

                  The account will be restored to its
                  previous enabled state.

                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-full p-2 text-white/30 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mt-7">

              <label className="mb-2 block text-xs text-white/40">

                Rejection Reason
                <span className="ml-1 text-red-300">
                  *
                </span>

              </label>

              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Enter the reason for rejecting this deletion request..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-white/20"
              />

              <div className="mt-2 text-right text-xs text-white/20">

                {reason.length} characters

              </div>

            </div>

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/50 hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={rejectDeletion}
                disabled={
                  saving ||
                  !reason.trim()
                }
                className="rounded-full bg-yellow-500 px-6 py-2.5 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
              >

                {saving
                  ? "Rejecting..."
                  : "Reject Request"}

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
// DATE FORMATTER
// =========================================================

function formatDate(
  value: string | null
): string {

  if (!value) {
    return "Unknown";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}