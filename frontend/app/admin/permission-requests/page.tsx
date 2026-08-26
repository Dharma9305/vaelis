"use client";

import API_BASE_URL from "@/lib/api";

import {
  getAdminProfile,
  getAdminCredentials,
  clearAdminCredentials,
  type AdminProfile,
} from "@/lib/adminAuth";

import {
  CheckCircle2,
  Clock3,
  Eye,
  RefreshCw,
  ShieldCheck,
  User,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";


// =========================================================
// TYPES
// =========================================================

type UserSummary = {
  id: number;
  username: string;
  email: string;
  role: string;
};

type PermissionSummary = {
  id: number;
  code: string;
  name: string;
  description: string;
  enabled: boolean;
};

type PermissionRequest = {
  id: number;

  targetUser: UserSummary | null;

  permission: PermissionSummary | null;

  requestedBy: UserSummary | null;

  requestedByRole: string;

  reason: string | null;

  status:
    | "PENDING_ACCOUNT_MANAGER"
    | "PENDING_SUPER_ADMIN"
    | "APPROVED"
    | "REJECTED"
    | string;

  accountManagerReviewer:
    | UserSummary
    | null;

  accountManagerReviewedAt:
    | string
    | null;

  accountManagerReviewComment:
    | string
    | null;

  superAdminReviewer:
    | UserSummary
    | null;

  superAdminReviewedAt:
    | string
    | null;

  superAdminReviewComment:
    | string
    | null;

  createdAt: string;

  updatedAt: string;
};


// =========================================================
// PAGE
// =========================================================

export default function PermissionRequestsPage() {

  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const [requests, setRequests] =
    useState<PermissionRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const [selectedRequest, setSelectedRequest] =
    useState<PermissionRequest | null>(null);

  const [comment, setComment] =
    useState("");

  const [showRejectModal, setShowRejectModal] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<
      | "PENDING"
      | "HISTORY"
    >("PENDING");


  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {

    let mounted = true;

    async function loadProfile() {

      const adminProfile =
        await getAdminProfile();

      if (!mounted) {
        return;
      }

      if (!adminProfile) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }

      if (
        adminProfile.role !==
          "ACCOUNT_MANAGER" &&
        adminProfile.role !==
          "SUPER_ADMIN"
      ) {

        window.location.href =
          "/admin";

        return;
      }

      setProfile(
        adminProfile
      );
    }

    loadProfile();

    return () => {
      mounted = false;
    };

  }, []);


  // =========================================================
  // FETCH REQUESTS
  // =========================================================

  async function fetchRequests() {

    try {

      setLoading(true);

      setError("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/permission-requests`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              Accept:
                "application/json",
            },

            cache:
              "no-store",
          }
        );


      // =====================================================
      // UNAUTHORIZED
      // =====================================================

      if (
        response.status ===
        401
      ) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }


      // =====================================================
      // FORBIDDEN
      // =====================================================

      if (
        response.status ===
        403
      ) {

        setError(
          "You are not authorized to review permission requests."
        );

        return;
      }


      if (!response.ok) {

        throw new Error(
          "Unable to load permission requests."
        );
      }


      const data =
        await response.json();

      setRequests(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Permission requests error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load permission requests."
      );

    } finally {

      setLoading(false);
    }
  }


  // =========================================================
  // LOAD REQUESTS
  // =========================================================

  useEffect(() => {

    if (!profile) {
      return;
    }

    fetchRequests();

  }, [profile]);


  // =========================================================
  // ROLE
  // =========================================================

  const isAccountManager =
    profile?.role ===
    "ACCOUNT_MANAGER";

  const isSuperAdmin =
    profile?.role ===
    "SUPER_ADMIN";


  // =========================================================
  // PENDING STATUS FOR CURRENT ROLE
  // =========================================================

  const pendingStatus =
    isAccountManager
      ? "PENDING_ACCOUNT_MANAGER"
      : "PENDING_SUPER_ADMIN";


  // =========================================================
  // PENDING REQUESTS
  // =========================================================

  const pendingRequests =
    useMemo(
      () =>
        requests.filter(
          (request) =>
            request.status ===
            pendingStatus
        ),
      [
        requests,
        pendingStatus,
      ]
    );


  // =========================================================
  // HISTORY
  // =========================================================

  const historyRequests =
    useMemo(
      () =>
        requests.filter(
          (request) =>
            request.status !==
            pendingStatus
        ),
      [
        requests,
        pendingStatus,
      ]
    );


  // =========================================================
  // DISPLAYED REQUESTS
  // =========================================================

  const displayedRequests =
    activeTab === "PENDING"
      ? pendingRequests
      : historyRequests;


  // =========================================================
  // FORMAT DATE
  // =========================================================

  function formatDate(
    value: string | null
  ) {

    if (!value) {
      return "—";
    }

    return new Date(
      value
    ).toLocaleString(
      "en-IN",
      {
        dateStyle:
          "medium",

        timeStyle:
          "short",
      }
    );
  }


  // =========================================================
  // STATUS LABEL
  // =========================================================

  function statusLabel(
    status: string
  ) {

    switch (status) {

      case "PENDING_ACCOUNT_MANAGER":
        return "Pending Account Manager";

      case "PENDING_SUPER_ADMIN":
        return "Pending Super Admin";

      case "APPROVED":
        return "Approved";

      case "REJECTED":
        return "Rejected";

      default:
        return status;
    }
  }


  // =========================================================
  // APPROVE
  // =========================================================

  async function handleApprove(
    request: PermissionRequest
  ) {

    if (!profile) {
      return;
    }

    const credentials =
      getAdminCredentials();

    if (!credentials) {

      clearAdminCredentials();

      window.location.href =
        "/admin/login";

      return;
    }

    const endpoint =
      isAccountManager
        ? `${API_BASE_URL}/api/admin/permission-requests/${request.id}/account-manager/approve`
        : `${API_BASE_URL}/api/admin/permission-requests/${request.id}/super-admin/approve`;

    try {

      setActionLoading(
        request.id
      );

      setError("");

      const response =
        await fetch(
          endpoint,
          {
            method: "POST",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              comment:
                comment.trim() ||
                null,
            }),

            cache:
              "no-store",
          }
        );


      if (
        response.status ===
        401
      ) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }


      if (
        response.status ===
        403
      ) {

        setError(
          "You are not authorized to approve this request."
        );

        return;
      }


      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Unable to approve request."
        );
      }


      const updated =
        await response.json();


      setRequests(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updated.id
                ? updated
                : item
          )
      );

      setComment("");

    } catch (error) {

      console.error(
        "Approve permission request error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to approve request."
      );

    } finally {

      setActionLoading(
        null
      );
    }
  }


  // =========================================================
  // OPEN REJECT
  // =========================================================

  function openRejectModal(
    request: PermissionRequest
  ) {

    setSelectedRequest(
      request
    );

    setComment("");

    setShowRejectModal(
      true
    );
  }


  // =========================================================
  // REJECT
  // =========================================================

  async function handleReject() {

    if (
      !profile ||
      !selectedRequest
    ) {
      return;
    }

    const credentials =
      getAdminCredentials();

    if (!credentials) {

      clearAdminCredentials();

      window.location.href =
        "/admin/login";

      return;
    }

    const endpoint =
      isAccountManager
        ? `${API_BASE_URL}/api/admin/permission-requests/${selectedRequest.id}/account-manager/reject`
        : `${API_BASE_URL}/api/admin/permission-requests/${selectedRequest.id}/super-admin/reject`;

    try {

      setActionLoading(
        selectedRequest.id
      );

      setError("");

      const response =
        await fetch(
          endpoint,
          {
            method: "POST",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              comment:
                comment.trim() ||
                null,
            }),

            cache:
              "no-store",
          }
        );


      if (
        response.status ===
        401
      ) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }


      if (
        response.status ===
        403
      ) {

        setError(
          "You are not authorized to reject this request."
        );

        return;
      }


      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Unable to reject request."
        );
      }


      const updated =
        await response.json();


      setRequests(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updated.id
                ? updated
                : item
          )
      );

      setShowRejectModal(
        false
      );

      setSelectedRequest(
        null
      );

      setComment("");

    } catch (error) {

      console.error(
        "Reject permission request error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to reject request."
      );

    } finally {

      setActionLoading(
        null
      );
    }
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (!profile) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">

        <div className="flex items-center gap-3 text-sm text-white/40">

          <RefreshCw
            size={16}
            className="animate-spin"
          />

          Loading permission requests...

        </div>

      </main>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-10">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c9a227]/10">

                <ShieldCheck
                  size={22}
                  className="text-[#c9a227]"
                />

              </div>

              <div>

                <h1 className="text-2xl font-medium">
                  Permission Requests
                </h1>

                <p className="mt-1 text-sm text-white/40">
                  {isAccountManager
                    ? "Review employee permission requests."
                    : "Final approval of administrator permission requests."}
                </p>

              </div>

            </div>

          </div>


          {/* REFRESH */}

          <button
            type="button"
            onClick={
              fetchRequests
            }
            disabled={
              loading ||
              actionLoading !==
                null
            }
            className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 disabled:opacity-40"
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

      </section>


      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-8">


        {/* ERROR */}

        {error && (

          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">

            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ===================================================
            SUMMARY
            =================================================== */}

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm text-white/40">
                Pending
              </span>

              <Clock3
                size={18}
                className="text-yellow-400/60"
              />

            </div>

            <p className="mt-4 text-3xl font-medium">
              {pendingRequests.length}
            </p>

          </div>


          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm text-white/40">
                History
              </span>

              <Eye
                size={18}
                className="text-white/40"
              />

            </div>

            <p className="mt-4 text-3xl font-medium">
              {historyRequests.length}
            </p>

          </div>


          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm text-white/40">
                Role
              </span>

              <User
                size={18}
                className="text-[#c9a227]/70"
              />

            </div>

            <p className="mt-4 text-lg font-medium">
              {profile.role}
            </p>

          </div>

        </div>


        {/* ===================================================
            TABS
            =================================================== */}

        <div className="mt-8 flex gap-2 border-b border-white/10">

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "PENDING"
              )
            }
            className={`rounded-t-xl px-5 py-3 text-sm transition ${
              activeTab ===
              "PENDING"
                ? "bg-white text-black"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >

            Pending

            {pendingRequests.length >
              0 && (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                  activeTab ===
                  "PENDING"
                    ? "bg-black/10"
                    : "bg-yellow-400/10 text-yellow-300"
                }`}
              >
                {
                  pendingRequests.length
                }
              </span>
            )}

          </button>


          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "HISTORY"
              )
            }
            className={`rounded-t-xl px-5 py-3 text-sm transition ${
              activeTab ===
              "HISTORY"
                ? "bg-white text-black"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            History
          </button>

        </div>


        {/* ===================================================
            REQUEST LIST
            =================================================== */}

        <div className="mt-6">

          {loading ? (

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">

              <RefreshCw
                size={22}
                className="mx-auto animate-spin text-white/30"
              />

              <p className="mt-4 text-sm text-white/40">
                Loading requests...
              </p>

            </div>

          ) : displayedRequests.length ===
            0 ? (

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">

              <CheckCircle2
                size={28}
                className="mx-auto text-green-400/50"
              />

              <p className="mt-4 text-lg font-medium">
                {activeTab ===
                "PENDING"
                  ? "No pending requests"
                  : "No request history"}
              </p>

              <p className="mt-2 text-sm text-white/30">
                {activeTab ===
                "PENDING"
                  ? "There are no permission requests waiting for your review."
                  : "No reviewed permission requests are available."}
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {displayedRequests.map(
                (request) => (

                  <PermissionRequestCard
                    key={
                      request.id
                    }
                    request={
                      request
                    }
                    isPending={
                      request.status ===
                      pendingStatus
                    }
                    isAccountManager={
                      isAccountManager
                    }
                    actionLoading={
                      actionLoading ===
                      request.id
                    }
                    onApprove={() =>
                      handleApprove(
                        request
                      )
                    }
                    onReject={() =>
                      openRejectModal(
                        request
                      )
                    }
                    formatDate={
                      formatDate
                    }
                  />

                )
              )}

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          REJECT MODAL
          ===================================================== */}

      {showRejectModal &&
        selectedRequest && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#101010] p-6 shadow-2xl">

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-lg font-medium">
                    Reject Permission Request
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    Request #
                    {
                      selectedRequest.id
                    }
                  </p>

                </div>

                <XCircle
                  size={22}
                  className="text-red-400/60"
                />

              </div>


              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                <p className="text-sm font-medium">
                  {
                    selectedRequest
                      .permission
                      ?.name
                  }
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Requested for{" "}
                  {
                    selectedRequest
                      .targetUser
                      ?.username
                  }
                </p>

              </div>


              <label className="mt-6 block">

                <span className="text-sm text-white/60">
                  Rejection comment
                </span>

                <textarea
                  value={
                    comment
                  }
                  onChange={(event) =>
                    setComment(
                      event.target
                        .value
                    )
                  }
                  rows={4}
                  placeholder="Enter the reason for rejection..."
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
                />

              </label>


              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(
                      false
                    );

                    setSelectedRequest(
                      null
                    );

                    setComment("");
                  }}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={
                    handleReject
                  }
                  disabled={
                    actionLoading !==
                    null
                  }
                  className="flex items-center gap-2 rounded-full bg-red-500/90 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-40"
                >

                  {actionLoading !==
                    null && (
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                  )}

                  Reject

                </button>

              </div>

            </div>

          </div>
        )}

    </main>
  );
}


// =========================================================
// REQUEST CARD
// =========================================================

function PermissionRequestCard({
  request,
  isPending,
  isAccountManager,
  actionLoading,
  onApprove,
  onReject,
  formatDate,
}: {
  request: PermissionRequest;
  isPending: boolean;
  isAccountManager: boolean;
  actionLoading: boolean;
  onApprove: () => void;
  onReject: () => void;
  formatDate: (
    value: string | null
  ) => string;
}) {

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

      {/* =====================================================
          TOP
          ===================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-2">

            <span className="text-xs text-white/30">
              REQUEST #
              {
                request.id
              }
            </span>

            <StatusBadge
              status={
                request.status
              }
            />

          </div>

          <h2 className="mt-3 text-xl font-medium">
            {
              request.permission
                ?.name ||
              "Permission"
            }
          </h2>

          <p className="mt-1 text-sm text-white/40">
            {
              request.permission
                ?.code
            }
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">

          <p className="text-xs text-white/30">
            Requested
          </p>

          <p className="mt-1 text-sm">
            {
              formatDate(
                request.createdAt
              )
            }
          </p>

        </div>

      </div>


      {/* =====================================================
          EMPLOYEE + REQUESTER
          ===================================================== */}

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        <InfoBlock
          title="Target User"
          icon={
            <User
              size={16}
            />
          }
        >

          <p className="font-medium">
            {
              request
                .targetUser
                ?.username ||
              "Unknown"
            }
          </p>

          <p className="mt-1 text-xs text-white/40">
            {
              request
                .targetUser
                ?.email
            }
          </p>

          <p className="mt-1 text-xs text-white/30">
            Role:{" "}
            {
              request
                .targetUser
                ?.role
            }
          </p>

        </InfoBlock>


        <InfoBlock
          title="Requested By"
          icon={
            <ShieldCheck
              size={16}
            />
          }
        >

          <p className="font-medium">
            {
              request
                .requestedBy
                ?.username ||
              "Unknown"
            }
          </p>

          <p className="mt-1 text-xs text-white/40">
            {
              request
                .requestedBy
                ?.email
            }
          </p>

          <p className="mt-1 text-xs text-white/30">
            Requested role:{" "}
            {
              request
                .requestedByRole
            }
          </p>

        </InfoBlock>

      </div>


      {/* =====================================================
          REASON
          ===================================================== */}

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

        <p className="text-xs uppercase tracking-[0.15em] text-white/30">
          Reason
        </p>

        <p className="mt-2 text-sm leading-6 text-white/70">
          {
            request.reason ||
            "No reason provided."
          }
        </p>

      </div>


      {/* =====================================================
          ACCOUNT MANAGER REVIEW
          ===================================================== */}

      <ReviewBlock
        title="Account Manager Review"
        reviewer={
          request
            .accountManagerReviewer
        }
        reviewedAt={
          request
            .accountManagerReviewedAt
        }
        comment={
          request
            .accountManagerReviewComment
        }
        formatDate={
          formatDate
        }
      />


      {/* =====================================================
          SUPER ADMIN REVIEW
          ===================================================== */}

      <ReviewBlock
        title="Super Admin Review"
        reviewer={
          request
            .superAdminReviewer
        }
        reviewedAt={
          request
            .superAdminReviewedAt
        }
        comment={
          request
            .superAdminReviewComment
        }
        formatDate={
          formatDate
        }
      />


      {/* =====================================================
          APPROVAL ACTIONS
          ===================================================== */}

      {isPending && (

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={
              onReject
            }
            disabled={
              actionLoading
            }
            className="flex items-center justify-center gap-2 rounded-full border border-red-500/20 px-5 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-40"
          >

            <XCircle
              size={16}
            />

            Reject

          </button>


          <button
            type="button"
            onClick={
              onApprove
            }
            disabled={
              actionLoading
            }
            className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-40"
          >

            {actionLoading ? (

              <RefreshCw
                size={16}
                className="animate-spin"
              />

            ) : (

              <CheckCircle2
                size={16}
              />

            )}

            {isAccountManager
              ? "Approve & Forward"
              : "Final Approval"}

          </button>

        </div>
      )}

    </article>
  );
}


// =========================================================
// INFO BLOCK
// =========================================================

function InfoBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/30">

        {icon}

        {title}

      </div>

      <div className="mt-3 text-sm">
        {children}
      </div>

    </div>
  );
}


// =========================================================
// REVIEW BLOCK
// =========================================================

function ReviewBlock({
  title,
  reviewer,
  reviewedAt,
  comment,
  formatDate,
}: {
  title: string;
  reviewer:
    | UserSummary
    | null;
  reviewedAt:
    | string
    | null;
  comment:
    | string
    | null;
  formatDate: (
    value: string | null
  ) => string;
}) {

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

      <div className="flex items-center justify-between gap-4">

        <p className="text-xs uppercase tracking-[0.12em] text-white/30">
          {title}
        </p>

        {reviewedAt && (
          <span className="text-xs text-white/30">
            {
              formatDate(
                reviewedAt
              )
            }
          </span>
        )}

      </div>


      {reviewer ? (

        <div className="mt-3">

          <p className="text-sm font-medium">
            {
              reviewer.username
            }
          </p>

          <p className="mt-1 text-xs text-white/40">
            {
              reviewer.email
            }
          </p>

          {comment && (
            <p className="mt-3 rounded-xl bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/60">
              {comment}
            </p>
          )}

        </div>

      ) : (

        <p className="mt-3 text-sm text-white/20">
          Awaiting review.
        </p>

      )}

    </div>
  );
}


// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  status,
}: {
  status: string;
}) {

  const config =
    status ===
    "APPROVED"
      ? {
          label: "Approved",
          className:
            "bg-green-500/10 text-green-400",
        }
      : status ===
          "REJECTED"
        ? {
            label: "Rejected",
            className:
              "bg-red-500/10 text-red-400",
          }
        : status ===
            "PENDING_SUPER_ADMIN"
          ? {
              label:
                "Pending Super Admin",
              className:
                "bg-[#c9a227]/10 text-[#c9a227]",
            }
          : {
              label:
                "Pending Account Manager",
              className:
                "bg-yellow-500/10 text-yellow-400",
            };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] ${config.className}`}
    >
      {config.label}
    </span>
  );
}