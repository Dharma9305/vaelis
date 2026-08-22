"use client";

import API_BASE_URL from "@/lib/api";
import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import {
  getAdminCredentials,
  clearAdminCredentials,
  getAdminProfile,
  hasAdminPermission,
  type AdminProfile,
} from "@/lib/adminAuth";

import * as XLSX from "xlsx";

type OrderItem = {
  id: number;
  productId: string;
  productName: string;
  color: string;
  quantity: number;
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
  paymentMethod: string | null;

  orderStatus: string;

  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;

  createdAt: string;

  shippingPartner: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  expectedDeliveryDate: string | null;

  items: OrderItem[];
};

type ManualPaymentMethod =
  | "COD"
  | "UPI"
  | "ONLINE";

export default function AdminOrdersPage() {

  const searchParams =
    useSearchParams();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [paymentFilter, setPaymentFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [dateFilter, setDateFilter] =
    useState("ALL");

  const [shipmentFilter, setShipmentFilter] =
    useState("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [processingPayment, setProcessingPayment] =
    useState<number | null>(null);

  
    const ordersPerPage = 10;

    // =========================================================
// ADMIN RBAC
// =========================================================

const [adminProfile, setAdminProfile] =
  useState<AdminProfile | null>(null);

const [permissionsLoading, setPermissionsLoading] =
  useState(true);

const canViewOrders =
  hasAdminPermission(
    adminProfile,
    "ORDERS_VIEW"
  );

const canManageOrders =
  hasAdminPermission(
    adminProfile,
    "ORDERS_MANAGE"
  );
// =========================================================
// LOAD ADMIN PERMISSIONS
// =========================================================

async function loadAdminPermissions() {

  try {

    setPermissionsLoading(true);

    const profile =
      await getAdminProfile();

    if (!profile) {

      clearAdminCredentials();

      window.location.href =
        "/admin/login";

      return;
    }

    setAdminProfile(profile);

  } catch (error) {

    console.error(
      "Unable to load admin permissions:",
      error
    );

    setError(
      "Unable to verify admin permissions."
    );

  } finally {

    setPermissionsLoading(false);

  }
}
  // =========================================================
  // URL FILTER INITIALIZATION
  // =========================================================

  useEffect(() => {

    const payment =
      searchParams.get("payment");

    const status =
      searchParams.get("status");

    const shipment =
      searchParams.get("shipment");

    if (payment) {
      setPaymentFilter(
        payment.toUpperCase()
      );
    }

    if (status) {
      setStatusFilter(
        status.toUpperCase()
      );
    }

    if (shipment) {
      setShipmentFilter(
        shipment.toUpperCase()
      );
    }

  }, [searchParams]);


  // =========================================================
  // FETCH ORDERS
  // =========================================================

  async function fetchOrders() {

    try {
            if (!canViewOrders) {

        setOrders([]);
        setError(
          "You do not have permission to view orders."
        );

        return;
      }

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
          `${API_BASE_URL}/api/admin/orders`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Basic ${credentials}`,
            },

            cache: "no-store",
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
          "Unable to fetch orders."
        );
      }

      const data =
        await response.json();

      setOrders(data);

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch orders."
      );

    } finally {

      setLoading(false);

    }
  }


  // =========================================================
  // RECORD PAYMENT RECEIVED
  // =========================================================

  async function recordPaymentReceived(
    orderId: number,
    paymentMethod: ManualPaymentMethod
  ) {
          if (!canManageOrders) {
      setError(
        "You do not have permission to manage orders."
      );
      return;
    }
    const order =
      orders.find(
        (item) =>
          item.id === orderId
      );

    if (!order) {
      return;
    }

    if (
      order.paymentStatus ===
      "PAID"
    ) {

      alert(
        "This order is already marked as PAID."
      );

      return;
    }

    const methodLabel =
      paymentMethod === "COD"
        ? "Cash / COD"
        : paymentMethod === "UPI"
          ? "UPI"
          : "Online Transfer";

    const confirmed =
      window.confirm(
        `Confirm payment received?\n\n` +
        `Order: #${order.id}\n` +
        `Amount: ${formatAmount(order.total)}\n` +
        `Method: ${methodLabel}`
      );

    if (!confirmed) {
      return;
    }

    try {

      setProcessingPayment(
        orderId
      );

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
          `${API_BASE_URL}/api/admin/orders/${orderId}/payment`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Basic ${credentials}`,
            },

            body: JSON.stringify({
              paymentMethod,
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
            "Unable to record payment."
        );
      }

      const updatedOrder =
        await response.json();

      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (currentOrder) =>
              currentOrder.id ===
              updatedOrder.id
                ? updatedOrder
                : currentOrder
          )
      );

      alert(
        `Payment received successfully.\n\n` +
        `Order #${order.id}\n` +
        `Method: ${methodLabel}\n` +
        `Amount: ${formatAmount(order.total)}`
      );

    } catch (error) {

      console.error(
        "Payment recording failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to record payment."
      );

    } finally {

      setProcessingPayment(
        null
      );

    }
  }


  // =========================================================
  // PAYMENT METHOD LABEL
  // =========================================================

  function getPaymentMethodLabel(
    paymentMethod:
      | string
      | null
      | undefined
  ) {

    if (!paymentMethod) {
      return "";
    }

    const method =
      paymentMethod
        .toUpperCase();

    if (method === "COD") {
      return "Cash / COD";
    }

    if (method === "UPI") {
      return "UPI";
    }

    if (method === "ONLINE") {
      return "Online Transfer";
    }

    if (method === "RAZORPAY") {
      return "Razorpay";
    }

    return paymentMethod;
  }


  // =========================================================
  // PAYMENT CONTROLS
  // =========================================================

  // =========================================================
// PAYMENT CONTROLS
// =========================================================

function PaymentControls({
  order,
}: {
  order: Order;
}) {

  const isProcessing =
    processingPayment === order.id;

  // ---------------------------------------------------------
  // ALREADY PAID
  // ---------------------------------------------------------

  if (order.paymentStatus === "PAID") {

    return (
      <div className="flex flex-col gap-1">

        <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
          PAID
        </span>

        {order.paymentMethod && (
          <span className="text-[11px] uppercase tracking-wide text-white/30">
            {getPaymentMethodLabel(
              order.paymentMethod
            )}
          </span>
        )}

      </div>
    );
  }

  // ---------------------------------------------------------
  // PAYMENT PENDING
  // ---------------------------------------------------------

  // Manual payment can ONLY be received after delivery.
  const canReceivePayment =
  canManageOrders &&
  order.orderStatus === "DELIVERED";

  // ---------------------------------------------------------
  // NOT DELIVERED YET
  // ---------------------------------------------------------

  if (!canReceivePayment) {

    return (
      <div className="flex flex-col gap-1">

        <span className="w-fit rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
          PENDING
        </span>

        <span className="text-[11px] text-white/30">
          Payment after delivery
        </span>

      </div>
    );
  }

  // ---------------------------------------------------------
  // DELIVERED + PAYMENT PENDING
  // ---------------------------------------------------------

  return (
    <div className="flex flex-col gap-2">

      <span className="w-fit rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
        PENDING
      </span>

      <span className="text-[11px] text-white/30">
        Payment received?
      </span>

      <div className="flex flex-wrap gap-1">

        {/* CASH / COD */}

        <button
          type="button"
          disabled={isProcessing}
          onClick={() =>
            recordPaymentReceived(
              order.id,
              "COD"
            )
          }
          className="rounded-lg border border-white/10 px-2 py-1 text-[11px] text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isProcessing
            ? "..."
            : "Cash"}
        </button>

        {/* UPI */}

        <button
          type="button"
          disabled={isProcessing}
          onClick={() =>
            recordPaymentReceived(
              order.id,
              "UPI"
            )
          }
          className="rounded-lg border border-white/10 px-2 py-1 text-[11px] text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isProcessing
            ? "..."
            : "UPI"}
        </button>

        {/* ONLINE */}

        <button
          type="button"
          disabled={isProcessing}
          onClick={() =>
            recordPaymentReceived(
              order.id,
              "ONLINE"
            )
          }
          className="rounded-lg border border-white/10 px-2 py-1 text-[11px] text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isProcessing
            ? "..."
            : "Online"}
        </button>

      </div>

    </div>
  );
}

  // =========================================================
  // EXPORT CSV
  // =========================================================

  function exportOrdersToCSV() {

    if (
      filteredOrders.length ===
      0
    ) {

      alert(
        "No orders to export."
      );

      return;
    }

    const headers = [

      "Order ID",
      "Customer Name",
      "Email",
      "Phone",
      "Address",
      "City",
      "State",
      "Pincode",
      "Subtotal",
      "Delivery Charge",
      "Total",
      "Payment Status",
      "Payment Method",
      "Order Status",
      "Razorpay Order ID",
      "Razorpay Payment ID",
      "Created At",

    ];

    const rows =
      filteredOrders.map(
        (order) => [

          order.id,
          order.customerName,
          order.email,
          order.phone,
          order.address,
          order.city,
          order.state,
          order.pincode,
          order.subtotal,
          order.deliveryCharge,
          order.total,
          order.paymentStatus,
          order.paymentMethod,
          order.orderStatus,
          order.razorpayOrderId,
          order.razorpayPaymentId,
          order.createdAt,

        ]
      );

    const csvContent = [

      headers,
      ...rows,

    ]
      .map((row) =>
        row
          .map((value) => {

            const text =
              String(value ?? "");

            return `"${text.replace(
              /"/g,
              '""'
            )}"`;

          })
          .join(",")
      )
      .join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `vaelis-orders-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  }


  // =========================================================
  // EXPORT EXCEL
  // =========================================================

  function exportOrdersToExcel() {

    if (
      filteredOrders.length ===
      0
    ) {

      alert(
        "No orders to export."
      );

      return;
    }

    const excelData =
      filteredOrders.map(
        (order) => ({

          "Order ID":
            order.id,

          "Customer Name":
            order.customerName,

          "Email":
            order.email,

          "Phone":
            order.phone,

          "Address":
            order.address,

          "City":
            order.city,

          "State":
            order.state,

          "Pincode":
            order.pincode,

          "Subtotal":
            order.subtotal,

          "Delivery Charge":
            order.deliveryCharge,

          "Total":
            order.total,

          "Payment Status":
            order.paymentStatus,

          "Payment Method":
            order.paymentMethod,

          "Order Status":
            order.orderStatus,

          "Razorpay Order ID":
            order.razorpayOrderId,

          "Razorpay Payment ID":
            order.razorpayPaymentId,

          "Created At":
            order.createdAt,

        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Orders"
    );

    worksheet["!cols"] = [

      { wch: 10 },
      { wch: 22 },
      { wch: 28 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 14 },
      { wch: 18 },
      { wch: 14 },
      { wch: 16 },
      { wch: 18 },
      { wch: 16 },
      { wch: 25 },
      { wch: 25 },
      { wch: 24 },

    ];

    XLSX.writeFile(
      workbook,
      `vaelis-orders-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    );
  }

  useEffect(() => {

  loadAdminPermissions();

}, []);

  // =========================================================
  // LOAD ORDERS
  // =========================================================

 useEffect(() => {

  if (permissionsLoading) {
    return;
  }

  if (!canViewOrders) {
    return;
  }

  fetchOrders();

}, [
  permissionsLoading,
  canViewOrders,
]);


  // =========================================================
  // FILTER ORDERS
  // =========================================================

  const filteredOrders =
    orders.filter((order) => {

      const searchText =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        searchText === "" ||

        String(order.id)
          .includes(searchText) ||

        order.customerName
          .toLowerCase()
          .includes(searchText) ||

        order.email
          .toLowerCase()
          .includes(searchText) ||

        order.phone
          .includes(searchText) ||

        (
          order.trackingNumber ||
          ""
        )
          .toLowerCase()
          .includes(searchText);

      const matchesPayment =
        paymentFilter === "ALL" ||
        order.paymentStatus ===
          paymentFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        order.orderStatus ===
          statusFilter;

      const hasShipment =
        Boolean(
          order.shippingPartner ||
          order.trackingNumber
        );

      const matchesShipment =
        shipmentFilter === "ALL" ||

        (
          shipmentFilter ===
          "SHIPPED" &&
          hasShipment
        ) ||

        (
          shipmentFilter ===
          "NOT_SHIPPED" &&
          !hasShipment
        );

      let matchesDate =
        true;

      if (
        dateFilter !== "ALL"
      ) {

        const orderDate =
          new Date(
            order.createdAt
          );

        const now =
          new Date();

        const startDate =
          new Date(now);

        if (
          dateFilter ===
          "TODAY"
        ) {

          startDate.setHours(
            0,
            0,
            0,
            0
          );
        }

        if (
          dateFilter ===
          "7_DAYS"
        ) {

          startDate.setDate(
            now.getDate() - 7
          );
        }

        if (
          dateFilter ===
          "30_DAYS"
        ) {

          startDate.setDate(
            now.getDate() - 30
          );
        }

        matchesDate =
          orderDate >=
          startDate;
      }

      return (
        matchesSearch &&
        matchesPayment &&
        matchesStatus &&
        matchesDate &&
        matchesShipment
      );
    });


  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredOrders.length /
          ordersPerPage
      )
    );

  const startIndex =
    (currentPage - 1) *
    ordersPerPage;

  const paginatedOrders =
    filteredOrders.slice(
      startIndex,
      startIndex +
        ordersPerPage
    );


  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      );

    }

  }, [
    currentPage,
    totalPages,
  ]);


  // =========================================================
  // FORMAT DATE
  // =========================================================

  function formatDate(
    date: string
  ) {

    return new Date(
      date
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
  // RESET FILTERS
  // =========================================================

  function resetFilters() {

    setSearch("");

    setPaymentFilter(
      "ALL"
    );

    setStatusFilter(
      "ALL"
    );

    setDateFilter(
      "ALL"
    );

    setShipmentFilter(
      "ALL"
    );

    setCurrentPage(1);
  }


  // =========================================================
  // PAGE
  // =========================================================

  // =========================================================
// PAGE ACCESS PROTECTION
// =========================================================

if (permissionsLoading) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <RefreshCw
            size={24}
            className="mx-auto mb-4 animate-spin text-white/40"
          />

          <p className="text-sm text-white/40">
            Checking order permissions...
          </p>
        </div>
      </section>
    </main>
  );
}

if (!canViewOrders) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">

          <div className="mb-4 text-4xl">
            🔒
          </div>

          <h1 className="text-xl font-medium text-white">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-white/40">
            You do not have permission to view orders.
          </p>

        </div>
      </section>
    </main>
  );
}

return (

  <main className="min-h-screen bg-[#050505] text-white">
    
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-10">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-medium">
              Orders
            </h1>

            <p className="mt-1 text-sm text-white/40">
              Manage VAELIS customer orders
            </p>

          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* EXPORT CSV */}

            <button
              onClick={
                exportOrdersToCSV
              }
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Export CSV
            </button>

            {/* EXPORT EXCEL */}

            <button
              onClick={
                exportOrdersToExcel
              }
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Export Excel
            </button>

            {/* REFRESH */}

            <button
              onClick={
                fetchOrders
              }
              disabled={
                loading
              }
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 disabled:opacity-40"
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

        </div>

      </section>


      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">

            {error}

          </div>

        )}


        {/* ===================================================
            SEARCH & FILTERS
            =================================================== */}

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">

            {/* SEARCH */}

            <input
              type="text"
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setCurrentPage(1);

              }}
              placeholder="Search order, customer or email..."
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
            />


            {/* PAYMENT */}

            <select
              value={
                paymentFilter
              }
              onChange={(e) => {

                setPaymentFilter(
                  e.target.value
                );

                setCurrentPage(1);

              }}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            >

              <option value="ALL">
                All Payments
              </option>

              <option value="PAID">
                Paid
              </option>

              <option value="PENDING">
                Pending
              </option>

            </select>


            {/* STATUS */}

            <select
              value={
                statusFilter
              }
              onChange={(e) => {

                setStatusFilter(
                  e.target.value
                );

                setCurrentPage(1);

              }}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            >

              <option value="ALL">
                All Statuses
              </option>

              <option value="PLACED">
                Placed
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="PROCESSING">
                Processing
              </option>

              <option value="SHIPPED">
                Shipped
              </option>

              <option value="DELIVERED">
                Delivered
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>

            </select>


            {/* DATE */}

            <select
              value={
                dateFilter
              }
              onChange={(e) => {

                setDateFilter(
                  e.target.value
                );

                setCurrentPage(1);

              }}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            >

              <option value="ALL">
                All Dates
              </option>

              <option value="TODAY">
                Today
              </option>

              <option value="7_DAYS">
                Last 7 Days
              </option>

              <option value="30_DAYS">
                Last 30 Days
              </option>

            </select>


            {/* SHIPMENT */}

            <select
              value={
                shipmentFilter
              }
              onChange={(e) => {

                setShipmentFilter(
                  e.target.value
                );

                setCurrentPage(1);

              }}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            >

              <option value="ALL">
                All Shipments
              </option>

              <option value="SHIPPED">
                Shipment Added
              </option>

              <option value="NOT_SHIPPED">
                Shipment Pending
              </option>

            </select>


            {/* RESET */}

            <button
              onClick={
                resetFilters
              }
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Reset
            </button>

          </div>


          {/* COUNT */}

          <p className="mt-4 text-xs text-white/30">

            Showing{" "}
            {filteredOrders.length}{" "}
            of{" "}
            {orders.length}{" "}
            orders

          </p>

        </div>


        {/* ===================================================
            ORDERS
            =================================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          {loading ? (

            <div className="p-10 text-center text-white/40">
              Loading orders...
            </div>

          ) : filteredOrders.length === 0 ? (

            <div className="p-10 text-center text-white/40">
              No orders found.
            </div>

          ) : (

            <>

              {/* =================================================
                  DESKTOP TABLE
                  ================================================= */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full text-left">

                  <thead className="border-b border-white/10">

                    <tr className="text-xs uppercase tracking-wider text-white/30">

                      <th className="px-5 py-4">
                        Order
                      </th>

                      <th className="px-5 py-4">
                        Customer
                      </th>

                      <th className="px-5 py-4">
                        Total
                      </th>

                      <th className="px-5 py-4">
                        Payment
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Shipment
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                      <th className="px-5 py-4">
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-white/10">

                    {paginatedOrders.map(
                      (order) => (

                        <tr
                          key={order.id}
                          className="transition hover:bg-white/[0.03]"
                        >

                          {/* ORDER */}

                          <td className="px-5 py-5">

                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="font-medium hover:underline"
                            >
                              #{order.id}
                            </Link>

                          </td>


                          {/* CUSTOMER */}

                          <td className="px-5 py-5">

                            <p className="font-medium">
                              {order.customerName}
                            </p>

                            <p className="mt-1 text-xs text-white/30">
                              {order.email}
                            </p>

                          </td>


                          {/* TOTAL */}

                          <td className="px-5 py-5 font-medium">

                            {formatAmount(
                              order.total
                            )}

                          </td>


                          {/* PAYMENT */}

                          <td className="px-5 py-5">

                            <PaymentControls
                              order={order}
                            />

                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-5">

                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                              {order.orderStatus}
                            </span>

                          </td>


                          {/* SHIPMENT */}

                          <td className="px-5 py-5">

                            {order.shippingPartner ||
                            order.trackingNumber ? (

                              <div>

                                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
                                  🚚 Shipment Added
                                </span>

                                <p className="mt-2 text-xs text-white/30">
                                  {order.shippingPartner ||
                                    "Tracking available"}
                                </p>

                              </div>

                            ) : (

                              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/30">
                                Shipment Pending
                              </span>

                            )}

                          </td>


                          {/* DATE */}

                          <td className="px-5 py-5 text-sm text-white/40">

                            {formatDate(
                              order.createdAt
                            )}

                          </td>


                          {/* VIEW */}

                          <td className="px-5 py-5">

                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-white/40 transition hover:text-white"
                            >

                              <ArrowRight
                                size={18}
                              />

                            </Link>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* =================================================
                  MOBILE
                  ================================================= */}

              <div className="divide-y divide-white/10 md:hidden">

                {paginatedOrders.map(
                  (order) => (

                    <div
                      key={order.id}
                      className="p-5 transition hover:bg-white/[0.03]"
                    >

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="block"
                      >

                        <div className="flex items-start justify-between">

                          <div>

                            <p className="font-medium">
                              Order #{order.id}
                            </p>

                            <p className="mt-1 text-sm text-white/50">
                              {order.customerName}
                            </p>

                          </div>

                          <ArrowRight
                            size={18}
                            className="text-white/30"
                          />

                        </div>

                      </Link>


                      <div className="mt-4 flex flex-wrap items-center gap-2">

                        {order.shippingPartner ||
                        order.trackingNumber ? (

                          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
                            🚚 Shipment Added
                          </span>

                        ) : (

                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/30">
                            Shipment Pending
                          </span>

                        )}

                        {order.paymentStatus ===
                        "PAID" ? (

                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                            PAID
                          </span>

                        ) : (

                          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                            PENDING
                          </span>

                        )}

                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                          {order.orderStatus}
                        </span>

                      </div>


                      {/* MOBILE PAYMENT METHOD */}

                      {order.paymentStatus ===
                        "PAID" &&
                        order.paymentMethod && (

                          <div className="mt-2 text-xs text-white/30">
                            Payment:{" "}
                            {getPaymentMethodLabel(
                              order.paymentMethod
                            )}
                          </div>

                        )}
                        {/* MOBILE PAYMENT BUTTONS */}

{canManageOrders &&
  order.paymentStatus !== "PAID" &&
  order.orderStatus === "DELIVERED" && (

    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">

      <p className="mb-2 text-xs text-white/40">
        Record Payment Received
      </p>

      <p className="mb-3 text-[11px] text-white/30">
        Order delivered. Confirm the payment method received.
      </p>

      <div className="flex flex-wrap gap-2">

        {/* CASH / COD */}

        <button
          type="button"
          disabled={
            processingPayment ===
            order.id
          }
          onClick={() =>
            recordPaymentReceived(
              order.id,
              "COD"
            )
          }
          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-40"
        >
          Cash / COD
        </button>

        {/* UPI */}

        <button
          type="button"
          disabled={
            processingPayment ===
            order.id
          }
          onClick={() =>
            recordPaymentReceived(
              order.id,
              "UPI"
            )
          }
          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-40"
        >
          UPI
        </button>

        {/* ONLINE */}

        <button
          type="button"
          disabled={
            processingPayment ===
            order.id
          }
          onClick={() =>
            recordPaymentReceived(
              order.id,
              "ONLINE"
            )
          }
          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-40"
        >
          Online
        </button>

      </div>

    </div>

)}




                      <div className="mt-4 flex items-center justify-between">

                        <span className="text-sm text-white/30">
                          {formatDate(
                            order.createdAt
                          )}
                        </span>

                        <span className="font-medium">
                          {formatAmount(
                            order.total
                          )}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* =================================================
                  PAGINATION
                  ================================================= */}

              {filteredOrders.length > 0 && (

                <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-white/40">

                    Showing{" "}
                    {startIndex + 1}
                    {" - "}
                    {Math.min(
                      startIndex +
                        ordersPerPage,
                      filteredOrders.length
                    )}
                    {" of "}
                    {filteredOrders.length}

                  </p>


                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                      disabled={
                        currentPage ===
                        1
                      }
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Previous
                    </button>


                    <span className="px-3 text-sm text-white/50">

                      Page{" "}
                      {currentPage}{" "}
                      of{" "}
                      {totalPages}

                    </span>


                    <button
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                        )
                      }
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Next
                    </button>

                  </div>

                </div>

              )}

            </>

          )}

        </div>

      </section>

    </main>

  );
}
