"use client";
import API_BASE_URL from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  Clock,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  Truck,
  XCircle,
} from "lucide-react";

type Order = {
  id: number;
  customerName: string;
  email: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;

  shippingPartner: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  expectedDeliveryDate: string | null;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ORDERS
  // =========================

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      const credentials =
        localStorage.getItem("vaelis_admin_auth");

      if (!credentials) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
      `${API_BASE_URL}/api/admin/orders`,
        {
          method: "GET",

          headers: {
            Authorization: `Basic ${credentials}`,
          },

          cache: "no-store",
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "vaelis_admin_auth"
        );

        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to fetch dashboard data."
        );
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // LOAD
  // =========================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // FORMAT AMOUNT
  // =========================

  function formatAmount(amount: number) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  // =========================
  // DATE HELPERS
  // =========================

  function isToday(date: string) {
    const orderDate = new Date(date);
    const today = new Date();

    return (
      orderDate.getFullYear() ===
        today.getFullYear() &&
      orderDate.getMonth() ===
        today.getMonth() &&
      orderDate.getDate() ===
        today.getDate()
    );
  }

  function isWithinLast7Days(date: string) {
    const orderDate = new Date(date);
    const now = new Date();

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      now.getDate() - 6
    );

    sevenDaysAgo.setHours(
      0,
      0,
      0,
      0
    );

    return orderDate >= sevenDaysAgo;
  }

  // =========================
  // MAIN STATISTICS
  // =========================

  const totalOrders = orders.length;

  const paidOrders =
    orders.filter(
      (order) =>
        order.paymentStatus === "PAID"
    ).length;

  const pendingPayments =
    orders.filter(
      (order) =>
        order.paymentStatus !== "PAID"
    ).length;

  const totalRevenue =
    orders
      .filter(
        (order) =>
          order.paymentStatus === "PAID"
      )
      .reduce(
        (sum, order) =>
          sum + (order.total || 0),
        0
      );

  // =========================
  // ORDER STATUS STATISTICS
  // =========================

  const confirmedOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "CONFIRMED"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "SHIPPED"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "DELIVERED"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "CANCELLED"
    ).length;

  // =========================
  // SHIPMENT PENDING
  // =========================

  const shipmentPending =
    orders.filter(
      (order) =>
        order.orderStatus !== "CANCELLED" &&
        order.orderStatus !== "DELIVERED" &&
        !order.shippingPartner &&
        !order.trackingNumber
    ).length;

  // =========================
  // REVENUE STATISTICS
  // =========================

  const todayRevenue =
    orders
      .filter(
        (order) =>
          order.paymentStatus === "PAID" &&
          isToday(order.createdAt)
      )
      .reduce(
        (sum, order) =>
          sum + (order.total || 0),
        0
      );

  const last7DaysRevenue =
    orders
      .filter(
        (order) =>
          order.paymentStatus === "PAID" &&
          isWithinLast7Days(
            order.createdAt
          )
      )
      .reduce(
        (sum, order) =>
          sum + (order.total || 0),
        0
      );

  // =========================
  // REVENUE CHART DATA
  // =========================

  const revenueChart = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date();

      date.setDate(
        date.getDate() -
          (6 - index)
      );

      date.setHours(
        0,
        0,
        0,
        0
      );

      const nextDate = new Date(date);

      nextDate.setDate(
        date.getDate() + 1
      );

      const revenue =
        orders
          .filter(
            (order) => {
              if (
                order.paymentStatus !==
                "PAID"
              ) {
                return false;
              }

              const orderDate =
                new Date(
                  order.createdAt
                );

              return (
                orderDate >= date &&
                orderDate < nextDate
              );
            }
          )
          .reduce(
            (sum, order) =>
              sum +
              (order.total || 0),
            0
          );

      return {
        date,
        revenue,

        label:
          date.toLocaleDateString(
            "en-IN",
            {
              weekday: "short",
            }
          ),
      };
    }
  );

  const maxRevenue = Math.max(
    ...revenueChart.map(
      (item) =>
        item.revenue
    ),
    1
  );

  // =========================
  // RECENT ORDERS
  // =========================

  const recentOrders =
    orders.slice(0, 5);

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* DASHBOARD HEADER */}

      <section className="mx-auto max-w-7xl px-6 pt-10">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-medium">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-white/40">
              Overview of your VAELIS store
            </p>

          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
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

      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* ERROR */}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* MAIN STATISTICS */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL ORDERS */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Total Orders
              </p>

              <ShoppingBag
                size={20}
                className="text-white/30"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {totalOrders}
            </p>

          </div>

          {/* PAID ORDERS */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Paid Orders
              </p>

              <CreditCard
                size={20}
                className="text-green-400/60"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {paidOrders}
            </p>

          </div>

          {/* PENDING PAYMENTS */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Pending Payments
              </p>

              <Clock
                size={20}
                className="text-yellow-400/60"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {pendingPayments}
            </p>

          </div>

          {/* REVENUE */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Total Revenue
              </p>

              <IndianRupee
                size={20}
                className="text-[#c9a227]"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {formatAmount(
                totalRevenue
              )}
            </p>

          </div>

        </div>

        {/* SECONDARY STATISTICS */}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* CONFIRMED */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Confirmed Orders
              </p>

              <CheckCircle2
                size={20}
                className="text-blue-400/60"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {confirmedOrders}
            </p>

          </div>

          {/* TODAY */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Today's Revenue
              </p>

              <IndianRupee
                size={20}
                className="text-[#c9a227]"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {formatAmount(
                todayRevenue
              )}
            </p>

          </div>

          {/* 7 DAYS */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Last 7 Days Revenue
              </p>

              <TrendingUp
                size={20}
                className="text-green-400/60"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {formatAmount(
                last7DaysRevenue
              )}
            </p>

          </div>

        </div>

        {/* ORDER STATUS STATISTICS */}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* SHIPPED */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Shipped Orders
              </p>

              <Truck
                size={20}
                className="text-cyan-400/60"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {shippedOrders}
            </p>

          </div>

          {/* DELIVERED */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Delivered Orders
              </p>

              <CheckCircle2
                size={20}
                className="text-green-400/60"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {deliveredOrders}
            </p>

          </div>

          {/* CANCELLED */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Cancelled Orders
              </p>

              <XCircle
                size={20}
                className="text-red-400/60"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {cancelledOrders}
            </p>

          </div>

          {/* SHIPMENT PENDING */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-white/40">
                Shipment Pending
              </p>

              <ShoppingBag
                size={20}
                className="text-yellow-400/60"
              />

            </div>

            <p className="mt-5 text-3xl font-medium">
              {shipmentPending}
            </p>

          </div>

        </div>

        {/* REVENUE CHART */}

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-medium">
                Revenue — Last 7 Days
              </h2>

              <p className="mt-1 text-sm text-white/30">
                Paid orders only
              </p>

            </div>

            <span className="text-sm text-white/40">
              {formatAmount(
                last7DaysRevenue
              )}
            </span>

          </div>

          {/* CHART */}

          <div className="mt-8 flex h-64 items-end gap-3 sm:gap-5">

            {revenueChart.map(
              (item) => {

                const height =
                  Math.max(
                    8,
                    (item.revenue /
                      maxRevenue) *
                      100
                  );

                return (

                  <div
                    key={
                      item.date.toISOString()
                    }
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >

                    <div className="mb-2 text-xs text-white/40">

                      {item.revenue > 0
                        ? formatAmount(
                            item.revenue
                          )
                        : "₹0"}

                    </div>

                    <div
                      className="w-full rounded-t-xl bg-[#c9a227]/80 transition-all duration-500 hover:bg-[#c9a227]"
                      style={{
                        height:
                          `${height}%`,
                      }}
                    />

                    <div className="mt-3 text-xs text-white/30">
                      {item.label}
                    </div>

                  </div>

                );
              }
            )}

          </div>

        </section>

                {/* MANAGEMENT */}

        <section className="mt-10">

          <div className="mb-5">
            <h2 className="text-lg font-medium">
              Management
            </h2>

            <p className="mt-1 text-sm text-white/30">
              Manage your VAELIS store
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* PRODUCTS & INVENTORY */}

            <Link
              href="/admin/products"
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#c9a227]/30 hover:bg-white/[0.05]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a227]/10 text-2xl">
                  🛍
                </div>

                <ArrowRight
                  size={18}
                  className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white"
                />

              </div>

              <h3 className="mt-6 text-xl font-medium">
                Products & Inventory
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                Add, edit and manage products, product
                images, pricing, stock and availability.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                  Products
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                  Inventory
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                  Stock
                </span>

              </div>

            </Link>

            {/* ORDERS & SHIPPING */}

            <Link
              href="/admin/orders"
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/20 hover:bg-white/[0.05]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                  📦
                </div>

                <ArrowRight
                  size={18}
                  className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white"
                />

              </div>

              <h3 className="mt-6 text-xl font-medium">
                Orders & Shipping
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                Manage customer orders, payment status,
                order status and shipment information.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                  Orders
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                  Payments
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                  Shipping
                </span>

              </div>

            </Link>

          </div>

        </section>

        {/* RECENT ORDERS */}

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03]">

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

            <div>

              <h2 className="text-lg font-medium">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-white/30">
                Latest VAELIS orders
              </p>

            </div>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >

              View All

              <ArrowRight
                size={16}
              />

            </Link>

          </div>

          {loading ? (

            <div className="p-10 text-center text-white/40">
              Loading orders...
            </div>

          ) : recentOrders.length === 0 ? (

            <div className="p-10 text-center text-white/40">
              No orders found.
            </div>

          ) : (

            <div className="divide-y divide-white/10">

              {recentOrders.map(
                (order) => (

                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <p className="font-medium">
                        Order #{order.id}
                      </p>

                      <p className="mt-1 text-sm text-white/50">
                        {order.customerName}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-5">

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

                      {(
                        order.shippingPartner ||
                        order.trackingNumber
                      ) ? (

                        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
                          🚚 Shipment
                        </span>

                      ) : null}

                      <span className="font-medium">
                        {formatAmount(
                          order.total
                        )}
                      </span>

                      <ArrowRight
                        size={16}
                        className="text-white/30"
                      />

                    </div>

                  </Link>

                )
              )}

            </div>

          )}

        </section>

      </section>

    </main>
  );
}