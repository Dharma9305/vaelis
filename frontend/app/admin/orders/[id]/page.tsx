"use client";

import API_BASE_URL from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Check,
} from "lucide-react";
import { useParams } from "next/navigation";
import {
  getAdminCredentials,
  clearAdminCredentials,
  getAdminProfile,
  hasAdminPermission,
  type AdminProfile,
} from "@/lib/adminAuth";

type OrderItem = {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  color: string;
  price: number;
  total: number;
};

type Order = {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  subtotal: number;
  deliveryCharge: number;
  total: number;

  paymentStatus: string;
  orderStatus: string;

  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;

  refundStatus: string | null;
  razorpayRefundId: string | null;
  refundedAmount: number | null;
  refundInitiatedAt: string | null;

  createdAt: string;

  shippingPartner: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  expectedDeliveryDate: string | null;

  items: OrderItem[];
};

type OrderStatusAuditLog = {
  id: number;
  orderId: number;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedByRole: string;
  changedAt: string;
};

type OrderShipmentAuditLog = {
  id: number;
  orderId: number;
  shippingPartner: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  expectedDeliveryDate: string | null;
  changedBy: string;
  changedByRole: string;
  changedAt: string;
};

const orderStatuses = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

function getAvailableOrderStatuses(
  currentStatus: string
): string[] {

  switch (currentStatus) {

    case "PLACED":
      return [
        "PLACED",
        "CONFIRMED",
        "CANCELLED",
      ];

    case "CONFIRMED":
      return [
        "CONFIRMED",
        "PROCESSING",
        "CANCELLED",
      ];

    case "PROCESSING":
      return [
        "PROCESSING",
        "SHIPPED",
        "CANCELLED",
      ];

    case "SHIPPED":
      return [
        "SHIPPED",
        "DELIVERED",
      ];

    case "DELIVERED":
      return [
        "DELIVERED",
      ];

    case "CANCELLED":
      return [
        "CANCELLED",
      ];

    default:
      return [currentStatus];
  }
}

export default function AdminOrderDetailsPage() {

  const params = useParams();

  const id = params.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);
    // =========================================================
  // ADMIN PERMISSIONS
  // =========================================================

  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const canViewOrders =
    hasAdminPermission(
      profile,
      "ORDERS_VIEW"
    );

  const canManageOrders =
    hasAdminPermission(
      profile,
      "ORDERS_MANAGE"
    );
  // =========================================================
  // STATUS HISTORY
  // =========================================================

  const [statusHistory, setStatusHistory] =
    useState<OrderStatusAuditLog[]>([]);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [historyError, setHistoryError] =
    useState("");

  // =========================================================
  // SHIPMENT HISTORY
  // =========================================================

  const [shipmentHistory, setShipmentHistory] =
    useState<OrderShipmentAuditLog[]>([]);

  const [shipmentHistoryLoading, setShipmentHistoryLoading] =
    useState(false);

  const [shipmentHistoryError, setShipmentHistoryError] =
    useState("");

  // =========================================================
  // GENERAL STATES
  // =========================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [shipmentSaving, setShipmentSaving] =
    useState(false);

  const [refundSaving, setRefundSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================================================
  // SHIPMENT FORM
  // =========================================================

  const [shippingPartner, setShippingPartner] =
    useState("");

  const [trackingNumber, setTrackingNumber] =
    useState("");

  const [trackingUrl, setTrackingUrl] =
    useState("");

  const [expectedDeliveryDate, setExpectedDeliveryDate] =
    useState("");

  // =========================================================
  // FETCH ORDER
  // =========================================================

  async function fetchOrder() {

    try {

      setLoading(true);
      setError("");
      
      const credentials =
  getAdminCredentials();

if (!credentials) {
  window.location.href =
    "/admin/login";

  return;
}

const response =
  await fetch(
    `${API_BASE_URL}/api/admin/orders/${id}`,
    {
      method: "GET",
      cache: "no-store",

      headers: {
        Authorization:
          `Basic ${credentials}`,
        Accept:
          "application/json",
      },
    }
  );

if (response.status === 401) {

  clearAdminCredentials();

  window.location.href =
    "/admin/login";

  return;
}
      if (!response.ok) {

        throw new Error(
          "Unable to fetch order."
        );
      }

      const data =
        await response.json();

      setOrder(data);

      setShippingPartner(
        data.shippingPartner || ""
      );

      setTrackingNumber(
        data.trackingNumber || ""
      );

      setTrackingUrl(
        data.trackingUrl || ""
      );

      setExpectedDeliveryDate(
        data.expectedDeliveryDate || ""
      );

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch order."
      );

    } finally {

      setLoading(false);

    }
  }

  // =========================================================
  // FETCH ORDER STATUS HISTORY
  // =========================================================

  async function fetchStatusHistory() {

    if (!id) {
      return;
    }

    try {

      setHistoryLoading(true);
      setHistoryError("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {

        window.location.href =
          "/admin/login";

        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/orders/${id}/status-history`,
          {
            method: "GET",
            cache: "no-store",

            headers: {
              Authorization:
                `Basic ${credentials}`,
            },
          }
        );

      if (response.status === 401) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Unable to load order status history."
        );
      }

      const data =
        await response.json();

      setStatusHistory(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

      setHistoryError(
        error instanceof Error
          ? error.message
          : "Unable to load order status history."
      );

    } finally {

      setHistoryLoading(false);

    }
  }

  // =========================================================
  // FETCH ORDER SHIPMENT HISTORY
  // =========================================================

  async function fetchShipmentHistory() {

    if (!id) {
      return;
    }

    try {

      setShipmentHistoryLoading(true);
      setShipmentHistoryError("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {

        window.location.href =
          "/admin/login";

        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/orders/${id}/shipment-history`,
          {
            method: "GET",
            cache: "no-store",

            headers: {
              Authorization:
                `Basic ${credentials}`,
            },
          }
        );

      if (response.status === 401) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Unable to load shipment history."
        );
      }

      const data =
        await response.json();

      setShipmentHistory(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

      setShipmentHistoryError(
        error instanceof Error
          ? error.message
          : "Unable to load shipment history."
      );

    } finally {

      setShipmentHistoryLoading(false);

    }
  }

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {

  async function loadPermissionsAndOrder() {

    const adminProfile =
      await getAdminProfile();

    if (!adminProfile) {
      clearAdminCredentials();

      window.location.href =
        "/admin/login";

      return;
    }

    setProfile(adminProfile);

    const canView =
      adminProfile.role === "SUPER_ADMIN" ||
      adminProfile.permissions?.includes(
        "ORDERS_VIEW"
      );

    if (!canView) {
      setError(
        "You do not have permission to view orders."
      );

      setLoading(false);

      return;
    }

    if (id) {
      await fetchOrder();
      await fetchStatusHistory();
      await fetchShipmentHistory();
    }
  }

  loadPermissionsAndOrder();

}, [id]);

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================
  
  async function updateOrderStatus() {
        if (!canManageOrders) {
      setError(
        "You do not have permission to manage orders."
      );
      return;
    }
    if (!order) {
      return;
    }

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {

        window.location.href =
          "/admin/login";

        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/orders/${order.id}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Basic ${credentials}`,
            },

            body: JSON.stringify({
              status:
                order.orderStatus,
            }),
          }
        );

      if (response.status === 401) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Unable to update order status."
        );
      }

      const updatedOrder =
        await response.json();

      setOrder(
        updatedOrder
      );

      await fetchStatusHistory();

      setSuccess(
        "Order status updated successfully."
      );

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update order status."
      );

    } finally {

      setSaving(false);

    }
  }

  // =========================================================
  // UPDATE SHIPMENT
  // =========================================================

  async function updateShipment() {
        if (!canManageOrders) {
      setError(
        "You do not have permission to manage shipment details."
      );
      return;
    }
    if (!order) {
      return;
    }

    try {

      setShipmentSaving(true);
      setError("");
      setSuccess("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {

        window.location.href =
          "/admin/login";

        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/orders/${order.id}/shipment`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Basic ${credentials}`,
            },

            body: JSON.stringify({
              shippingPartner,
              trackingNumber,
              trackingUrl,
              expectedDeliveryDate,
            }),
          }
        );

      if (response.status === 401) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Unable to update shipment."
        );
      }

      const updatedOrder =
        await response.json();

      setOrder(
        updatedOrder
      );

      await fetchShipmentHistory();

      setSuccess(
        "Shipment details saved successfully."
      );

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update shipment."
      );

    } finally {

      setShipmentSaving(false);

    }
  }

  // =========================================================
  // PROCESS REFUND
  // =========================================================

  async function processRefund() {
        if (!canManageOrders) {
      setError(
        "You do not have permission to process refunds."
      );
      return;
    }
    if (!order) {
      return;
    }

    if (
      order.orderStatus !== "CANCELLED"
    ) {
      return;
    }

    if (
      order.refundStatus !==
      "REFUND_REQUIRED"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Process refund of ${formatAmount(
          order.total
        )} for Order #${order.id}?\n\n` +
        "This will create a real Razorpay refund."
      );

    if (!confirmed) {
      return;
    }

    try {

      setRefundSaving(true);
      setError("");
      setSuccess("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {

        window.location.href =
          "/admin/login";

        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/orders/${order.id}/refund`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Basic ${credentials}`,
            },
          }
        );

      if (response.status === 401) {

        clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Unable to process refund."
        );
      }

      const refundedOrder =
        await response.json();

      setOrder(
        refundedOrder
      );

      setSuccess(
        "Refund request processed successfully."
      );

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to process refund."
      );

    } finally {

      setRefundSaving(false);

    }
  }

  // =========================================================
  // FORMAT AMOUNT
  // =========================================================

  function formatAmount(
    amount: number
  ) {

    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;

  }

  // =========================================================
  // FORMAT DATE
  // =========================================================

  function formatDate(
    date: string | null
  ) {

    if (!date) {
      return "Not available";
    }

    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  }

  // =========================================================
  // FORMAT DELIVERY DATE
  // =========================================================

  function formatDeliveryDate(
    date: string | null
  ) {

    if (!date) {
      return "Not available";
    }

    const normalizedDate =
      /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? `${date}T00:00:00`
        : date;

    return new Date(
      normalizedDate
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  }

  // =========================================================
  // REFUND STATUS LABEL
  // =========================================================

  function getRefundStatusClass(
    status: string | null
  ) {

    switch (status) {

      case "REFUNDED":
        return "bg-green-500/10 text-green-400";

      case "REFUND_INITIATED":
        return "bg-blue-500/10 text-blue-400";

      case "REFUND_FAILED":
        return "bg-red-500/10 text-red-400";

      case "REFUND_REQUIRED":
        return "bg-yellow-500/10 text-yellow-400";

      default:
        return "bg-white/5 text-white/40";
    }
  }

  // =========================================================
  // STATUS INDEX
  // =========================================================

  const currentStatusIndex =
    order
      ? orderStatuses.indexOf(
          order.orderStatus
        )
      : -1;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <main className="min-h-screen bg-[#050505] text-white">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center text-white/40">

          <RefreshCw
            size={20}
            className="mx-auto mb-4 animate-spin"
          />

          Loading order...

        </div>

      </main>

    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !order) {

    return (

      <main className="min-h-screen bg-[#050505] text-white">

        <div className="mx-auto max-w-3xl px-6 py-20">

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-300">

            {error}

          </div>

          <Link
            href="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
          >

            <ArrowLeft
              size={16}
            />

            Back to Orders

          </Link>

        </div>

      </main>

    );
  }

  if (!order) {
    return null;
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (

    <main className="min-h-screen bg-[#050505] text-white">

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          href="/admin/orders"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >

          <ArrowLeft
            size={16}
          />

          Back to Orders

        </Link>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="mb-8">

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-medium">
              Order #{order.id}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs ${
                order.paymentStatus ===
                "PAID"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {order.paymentStatus}
            </span>

            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
              {order.orderStatus}
            </span>

          </div>

          <p className="mt-2 text-sm text-white/30">
            Placed on{" "}
            {formatDate(
              order.createdAt
            )}
          </p>

        </div>

        {/* =================================================
            MESSAGES
        ================================================= */}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>

        )}

        {success && (

          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-300">
            {success}
          </div>

        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-8">

            {/* =================================================
                ORDER STATUS TIMELINE
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-medium">
                    Order Progress
                  </h2>

                  <p className="mt-1 text-sm text-white/30">
                    Track fulfillment status
                  </p>

                </div>

                <span className="text-sm text-white/40">
                  {order.orderStatus}
                </span>

              </div>

              <div className="mt-8">

                <div className="flex items-center">

                  {orderStatuses.map(
                    (status, index) => {

                      const completed =
                        currentStatusIndex >=
                        index;

                      const active =
                        currentStatusIndex ===
                        index;

                      return (

                        <div
                          key={status}
                          className="flex flex-1 items-center"
                        >

                          <div className="flex flex-col items-center">

                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                                completed
                                  ? "border-white bg-white text-black"
                                  : "border-white/20 bg-black text-white/30"
                              }`}
                            >

                              {completed ? (

                                <Check
                                  size={16}
                                />

                              ) : (

                                <span className="text-xs">
                                  {index + 1}
                                </span>

                              )}

                            </div>

                            <span
                              className={`mt-2 text-center text-[10px] sm:text-xs ${
                                active
                                  ? "text-white"
                                  : completed
                                  ? "text-white/60"
                                  : "text-white/25"
                              }`}
                            >
                              {status}
                            </span>

                          </div>

                          {index <
                            orderStatuses.length -
                              1 && (

                            <div
                              className={`mx-2 h-px flex-1 ${
                                currentStatusIndex >
                                index
                                  ? "bg-white"
                                  : "bg-white/10"
                              }`}
                            />

                          )}

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                STATUS HISTORY
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-medium">
                    Status History
                  </h2>

                  <p className="mt-1 text-sm text-white/30">
                    Complete record of order status changes.
                  </p>

                </div>

                {statusHistory.length > 0 && (

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/40">
                    {statusHistory.length}{" "}
                    {statusHistory.length === 1
                      ? "change"
                      : "changes"}
                  </span>

                )}

              </div>

              {/* LOADING */}

              {historyLoading && (

                <div className="mt-8 flex items-center justify-center py-8 text-sm text-white/30">

                  <RefreshCw
                    size={16}
                    className="mr-2 animate-spin"
                  />

                  Loading history...

                </div>

              )}

              {/* ERROR */}

              {!historyLoading &&
                historyError && (

                  <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">

                    {historyError}

                  </div>

              )}

              {/* EMPTY */}

              {!historyLoading &&
                !historyError &&
                statusHistory.length === 0 && (

                  <div className="mt-8 rounded-2xl border border-white/5 bg-black/20 px-5 py-8 text-center">

                    <p className="text-sm text-white/40">
                      No status changes have been recorded yet.
                    </p>

                    <p className="mt-2 text-xs text-white/20">
                      Status history will appear here when the order status changes.
                    </p>

                  </div>

              )}

              {/* HISTORY */}

              {!historyLoading &&
                !historyError &&
                statusHistory.length > 0 && (

                  <div className="mt-8">

                    <div className="relative">

                      <div className="absolute bottom-4 left-[7px] top-4 w-px bg-white/10" />

                      <div className="space-y-7">

                        {statusHistory.map(
                          (entry) => (

                            <div
                              key={entry.id}
                              className="relative flex gap-4"
                            >

                              <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-white/30 bg-[#050505]" />

                              <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-2">

                                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                                    {entry.toStatus}
                                  </span>

                                  <span className="text-xs text-white/30">
                                    from
                                  </span>

                                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                                    {entry.fromStatus}
                                  </span>

                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">

                                  <span>
                                    By{" "}
                                    <span className="text-white/70">
                                      {entry.changedBy}
                                    </span>
                                  </span>

                                  <span className="text-white/15">
                                    •
                                  </span>

                                  <span>
                                    {entry.changedByRole}
                                  </span>

                                  <span className="text-white/15">
                                    •
                                  </span>

                                  <span>
                                    {formatDate(
                                      entry.changedAt
                                    )}
                                  </span>

                                </div>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  </div>

              )}

            </section>

            {/* =================================================
                CUSTOMER
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <h2 className="text-lg font-medium">
                Customer Details
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>

                  <p className="text-xs text-white/30">
                    Name
                  </p>

                  <p className="mt-1">
                    {order.customerName}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-white/30">
                    Phone
                  </p>

                  <p className="mt-1">
                    {order.phone}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-white/30">
                    Email
                  </p>

                  <p className="mt-1 break-all">
                    {order.email}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-white/30">
                    Order Date
                  </p>

                  <p className="mt-1">
                    {formatDate(
                      order.createdAt
                    )}
                  </p>

                </div>

                <div className="sm:col-span-2">

                  <p className="text-xs text-white/30">
                    Delivery Address
                  </p>

                  <p className="mt-1">
                    {order.address}
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    {order.city},{" "}
                    {order.state} -{" "}
                    {order.pincode}
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                ITEMS
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <h2 className="text-lg font-medium">
                Order Items
              </h2>

              <div className="mt-6 space-y-5">

                {order.items?.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="flex justify-between gap-5 border-b border-white/10 pb-5 last:border-0 last:pb-0"
                    >

                      <div>

                        <p className="font-medium">
                          {item.productName}
                        </p>

                        <p className="mt-1 text-sm text-white/40">
                          {item.color} ×{" "}
                          {item.quantity}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}{" "}
                          each
                        </p>

                      </div>

                      <p className="font-medium">
                        {formatAmount(
                          item.total
                        )}
                      </p>

                    </div>

                  )
                )}

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <aside className="space-y-8">

            {/* =================================================
    STATUS CONTROL
================================================= */}

{canManageOrders && (
  <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

    <h2 className="text-lg font-medium">
      Update Status
    </h2>

    <p className="mt-1 text-sm text-white/30">
      Change the fulfillment status of this order.
    </p>

    <select
      value={order.orderStatus}
      onChange={(e) => {

        setSuccess("");
        setError("");

        setOrder({
          ...order,
          orderStatus:
            e.target.value,
        });

      }}
      className="mt-5 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
    >

      {getAvailableOrderStatuses(
        order.orderStatus
      ).map(
        (status) => (
          <option
            key={status}
            value={status}
          >
            {status}
          </option>
        )
      )}

    </select>

    <button
      onClick={updateOrderStatus}
      disabled={saving}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
    >

      {saving && (
        <RefreshCw
          size={16}
          className="animate-spin"
        />
      )}

      {saving
        ? "Saving..."
        : "Save Status"}

    </button>

  </section>
)}
            {/* =================================================
                SHIPMENT
            ================================================= */}
            {canManageOrders && (
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <h2 className="text-lg font-medium">
                Shipment & Tracking
              </h2>

              <p className="mt-1 text-sm text-white/30">
                Add courier and tracking information.
              </p>

              {/* SHIPPING PARTNER */}

              <div className="mt-6">

                <label className="text-xs text-white/40">
                  Shipping Partner
                </label>

                <input
                  type="text"
                  value={shippingPartner}
                  onChange={(e) =>
                    setShippingPartner(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Blue Dart"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
                />

              </div>

              {/* TRACKING NUMBER */}

              <div className="mt-5">

                <label className="text-xs text-white/40">
                  Tracking / AWB Number
                </label>

                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) =>
                    setTrackingNumber(
                      e.target.value
                    )
                  }
                  placeholder="Enter tracking number"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
                />

              </div>

              {/* TRACKING URL */}

              <div className="mt-5">

                <label className="text-xs text-white/40">
                  Tracking URL
                </label>

                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) =>
                    setTrackingUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
                />

              </div>

              {/* EXPECTED DELIVERY */}

              <div className="mt-5">

                <label className="text-xs text-white/40">
                  Expected Delivery
                </label>

                <div className="relative">

                  <input
                    type="text"
                    value={
                      expectedDeliveryDate
                        ? expectedDeliveryDate
                            .split("-")
                            .reverse()
                            .join("")
                        : ""
                    }
                    onChange={(e) => {

                      const digits =
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            8
                          );

                      if (
                        digits.length ===
                        8
                      ) {

                        const day =
                          digits.slice(
                            0,
                            2
                          );

                        const month =
                          digits.slice(
                            2,
                            4
                          );

                        const year =
                          digits.slice(
                            4,
                            8
                          );

                        setExpectedDeliveryDate(
                          `${year}-${month}-${day}`
                        );

                      } else {

                        setExpectedDeliveryDate(
                          digits
                        );

                      }

                    }}
                    placeholder="DDMMYYYY"
                    inputMode="numeric"
                    maxLength={8}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
                  />

                  <input
                    type="date"
                    value={
                      expectedDeliveryDate &&
                      /^\d{4}-\d{2}-\d{2}$/.test(
                        expectedDeliveryDate
                      )
                        ? expectedDeliveryDate
                        : ""
                    }
                    onChange={(e) =>
                      setExpectedDeliveryDate(
                        e.target.value
                      )
                    }
                    className="absolute right-3 top-1/2 mt-1 h-6 w-6 -translate-y-1/2 cursor-pointer opacity-0"
                    aria-label="Choose expected delivery date"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-white/40">
                    📅
                  </span>

                </div>

                <p className="mt-2 text-xs text-white/25">
                  Enter DDMMYYYY manually or use the calendar.
                </p>

              </div>

              {/* SAVE SHIPMENT */}

              <button
                onClick={
                  updateShipment
                }
                disabled={
                  shipmentSaving
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#d7b33a] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {shipmentSaving && (

                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />

                )}

                {shipmentSaving
                  ? "Saving..."
                  : "Save Shipment"}

              </button>

            </section>
            )}
            {/* =================================================
                SHIPMENT HISTORY
            ================================================= */}
          
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <h2 className="text-lg font-medium">
                    Shipment History
                  </h2>

                  <p className="mt-1 text-sm text-white/30">
                    Track who updated shipment details and when.
                  </p>

                </div>

                {shipmentHistory.length > 0 && (

                  <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-white/40">
                    {shipmentHistory.length}{" "}
                    {shipmentHistory.length === 1
                      ? "update"
                      : "updates"}
                  </span>

                )}

              </div>

              {/* LOADING */}

              {shipmentHistoryLoading && (

                <div className="mt-8 flex items-center justify-center py-8 text-sm text-white/30">

                  <RefreshCw
                    size={16}
                    className="mr-2 animate-spin"
                  />

                  Loading shipment history...

                </div>

              )}

              {/* ERROR */}

              {!shipmentHistoryLoading &&
                shipmentHistoryError && (

                  <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">

                    {shipmentHistoryError}

                  </div>

              )}

              {/* EMPTY */}

              {!shipmentHistoryLoading &&
                !shipmentHistoryError &&
                shipmentHistory.length === 0 && (

                  <div className="mt-8 rounded-2xl border border-white/5 bg-black/20 px-5 py-8 text-center">

                    <p className="text-sm text-white/40">
                      No shipment updates have been recorded yet.
                    </p>

                    <p className="mt-2 text-xs text-white/20">
                      Shipment history will appear here after shipment details are updated.
                    </p>

                  </div>

              )}

              {/* HISTORY */}

              {!shipmentHistoryLoading &&
                !shipmentHistoryError &&
                shipmentHistory.length > 0 && (

                  <div className="mt-8 space-y-5">

                    {shipmentHistory.map(
                      (entry) => (

                        <div
                          key={entry.id}
                          className="rounded-2xl border border-white/10 bg-black/20 p-5"
                        >

                          {/* HEADER */}

                          <div className="flex flex-wrap items-center justify-between gap-3">

                            <span className="rounded-full bg-[#c9a227]/10 px-3 py-1 text-xs font-medium text-[#d7b33a]">
                              Shipment Updated
                            </span>

                            <span className="text-xs text-white/30">
                              {formatDate(
                                entry.changedAt
                              )}
                            </span>

                          </div>

                          {/* DETAILS */}

                          <div className="mt-5 space-y-4">

                            {/* SHIPPING PARTNER */}

                            <div>

                              <p className="text-[11px] uppercase tracking-wide text-white/25">
                                Shipping Partner
                              </p>

                              <p className="mt-1 text-sm text-white/80">
                                {entry.shippingPartner ||
                                  "Not available"}
                              </p>

                            </div>

                            {/* TRACKING NUMBER */}

                            <div>

                              <p className="text-[11px] uppercase tracking-wide text-white/25">
                                Tracking / AWB
                              </p>

                              <p className="mt-1 break-all text-sm text-white/80">
                                {entry.trackingNumber ||
                                  "Not available"}
                              </p>

                            </div>

                            {/* TRACKING URL */}

                            {entry.trackingUrl && (

                              <div>

                                <p className="text-[11px] uppercase tracking-wide text-white/25">
                                  Tracking URL
                                </p>

                                <a
                                  href={entry.trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 block break-all text-sm text-blue-400 hover:text-blue-300"
                                >
                                  {entry.trackingUrl}
                                </a>

                              </div>

                            )}

                            {/* EXPECTED DELIVERY */}

                            <div>

                              <p className="text-[11px] uppercase tracking-wide text-white/25">
                                Expected Delivery
                              </p>

                              <p className="mt-1 text-sm text-white/80">
                                {formatDeliveryDate(
                                  entry.expectedDeliveryDate
                                )}
                              </p>

                            </div>

                          </div>

                          {/* USER */}

                          <div className="mt-5 border-t border-white/10 pt-4">

                            <p className="text-xs text-white/30">
                              Updated by
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">

                              <span className="text-sm text-white/80">
                                {entry.changedBy}
                              </span>

                              <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/40">
                                {entry.changedByRole}
                              </span>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

              )}

            </section>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-medium">
                  Payment
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    order.paymentStatus ===
                    "PAID"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {order.paymentStatus}
                </span>

              </div>

              <div className="mt-6 space-y-5">

                <div>

                  <p className="text-xs text-white/30">
                    Amount
                  </p>

                  <p className="mt-1 text-lg font-medium">
                    {formatAmount(
                      order.total
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-white/30">
                    Razorpay Order ID
                  </p>

                  <p className="mt-2 break-all text-sm">
                    {order.razorpayOrderId ||
                      "Not available"}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-white/30">
                    Razorpay Payment ID
                  </p>

                  <p className="mt-2 break-all text-sm">
                    {order.razorpayPaymentId ||
                      "Not available"}
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                REFUND
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <h2 className="text-lg font-medium">
                    Refund
                  </h2>

                  <p className="mt-1 text-sm text-white/30">
                    Manage the Razorpay refund for this order.
                  </p>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${getRefundStatusClass(
                    order.refundStatus
                  )}`}
                >
                  {order.refundStatus ||
                    "NONE"}
                </span>

              </div>

              <div className="mt-6 space-y-5">

                {/* REFUND AMOUNT */}

                <div className="flex justify-between">

                  <span className="text-sm text-white/40">
                    Refund Amount
                  </span>

                  <span className="text-sm font-medium">
                    {order.refundedAmount != null
                      ? formatAmount(
                          order.refundedAmount
                        )
                      : formatAmount(
                          order.total
                        )}
                  </span>

                </div>

                {/* REFUND ID */}

                <div>

                  <p className="text-xs text-white/30">
                    Razorpay Refund ID
                  </p>

                  <p className="mt-2 break-all text-sm">
                    {order.razorpayRefundId ||
                      "Not available"}
                  </p>

                </div>

                {/* REFUND INITIATED */}

                <div>

                  <p className="text-xs text-white/30">
                    Refund Initiated
                  </p>

                  <p className="mt-2 text-sm">
                    {formatDate(
                      order.refundInitiatedAt
                    )}
                  </p>

                </div>

                {/* REFUND REQUIRED */}

                {order.refundStatus ===
                  "REFUND_REQUIRED" && (

                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.05] p-4">

                    <p className="text-sm text-yellow-300">
                      This cancelled paid order is ready for refund.
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Refund amount:{" "}
                      {formatAmount(
                        order.total
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={
                        processRefund
                      }
                      disabled={
                        refundSaving
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#d7b33a] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {refundSaving && (

                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />

                      )}

                      {refundSaving
                        ? "Processing Refund..."
                        : `Process Refund ${formatAmount(
                            order.total
                          )}`}

                    </button>

                  </div>

                )}

                {/* REFUNDED */}

                {order.refundStatus ===
                  "REFUNDED" && (

                  <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.05] p-4">

                    <p className="text-sm text-green-300">
                      Refund completed successfully.
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Refund ID:{" "}
                      {order.razorpayRefundId ||
                        "Not available"}
                    </p>

                  </div>

                )}

                {/* REFUND INITIATED */}

                {order.refundStatus ===
                  "REFUND_INITIATED" && (

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-4">

                    <p className="text-sm text-blue-300">
                      Refund has been initiated.
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Razorpay is processing the refund.
                    </p>

                  </div>

                )}

                {/* REFUND FAILED */}

                {order.refundStatus ===
                  "REFUND_FAILED" && (

                  <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4">

                    <p className="text-sm text-red-300">
                      The previous refund attempt failed.
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Check the Razorpay payment details before retrying.
                    </p>

                  </div>

                )}

              </div>

            </section>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <h2 className="text-lg font-medium">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">

                <div className="flex justify-between text-white/50">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    {formatAmount(
                      order.subtotal
                    )}
                  </span>

                </div>

                <div className="flex justify-between text-white/50">

                  <span>
                    Delivery
                  </span>

                  <span>

                    {order.deliveryCharge ===
                    0
                      ? "FREE"
                      : formatAmount(
                          order.deliveryCharge
                        )}

                  </span>

                </div>

                <div className="flex justify-between border-t border-white/10 pt-5 text-lg">

                  <span>
                    Total
                  </span>

                  <span>
                    {formatAmount(
                      order.total
                    )}
                  </span>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </section>

    </main>

  );
}