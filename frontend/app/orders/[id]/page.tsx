"use client";

import API_BASE_URL from "@/lib/api";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Truck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Header from "../../../components/layout/Header";
import RetryPaymentButton from "../../../components/payment/RetryPaymentButton";

type OrderItem = {
  id: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color: string;
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
  createdAt: string;

  shippingPartner?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  expectedDeliveryDate?: string;

  items: OrderItem[];
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const orderId = params.id;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancelling, setCancelling] =
    useState(false);

  const [cancelMessage, setCancelMessage] =
    useState("");

  // =========================================================
  // LOAD ORDER
  // =========================================================

  useEffect(() => {
    if (!orderId) return;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/orders/${orderId}`,
        );

        if (!response.ok) {
          throw new Error(
            "Order not found.",
          );
        }

        const data =
          await response.json();

        setOrder(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load order.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  // =========================================================
  // CANCEL ORDER
  // =========================================================

  async function cancelOrder() {
    if (!order) {
      return;
    }

    if (
      order.orderStatus !== "PLACED" &&
      order.orderStatus !== "CONFIRMED" &&
      order.orderStatus !== "PROCESSING"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setCancelMessage("");
      setError("");

      const response =
        await fetch(
          `${API_BASE_URL}/api/orders/${order.id}/cancel`,
          {
            method: "POST",
          },
        );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
            "Unable to cancel order.",
        );
      }

      const updatedOrder =
        await response.json();

      setOrder(updatedOrder);

      setCancelMessage(
        "Your order has been cancelled successfully.",
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to cancel order.",
      );
    } finally {
      setCancelling(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Header />

        <section className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-6">
          <p className="text-white/40">
            Loading order...
          </p>
        </section>
      </main>
    );
  }

  // =========================================================
  // ERROR / NOT FOUND
  // =========================================================

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Header />

        <section className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl">
              Order Not Found
            </h1>

            <p className="mt-3 text-sm text-white/40">
              {error ||
                "Unable to find this order."}
            </p>

            <button
              onClick={() =>
                router.push("/orders")
              }
              className="mt-8 rounded-full bg-white px-7 py-3 text-sm font-medium text-black"
            >
              Back to Orders
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const orderDate =
    new Date(
      order.createdAt,
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );

  // =========================================================
  // EXPECTED DELIVERY FORMAT
  // =========================================================

  const expectedDelivery =
    order.expectedDeliveryDate
      ? new Date(
          order.expectedDeliveryDate,
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          },
        )
      : null;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-16">

        {/* =================================================
            BACK
        ================================================= */}

        <button
          onClick={() =>
            router.push("/orders")
          }
          className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />

          Back to Orders
        </button>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
              Order Details
            </p>

            <h1 className="mt-3 text-4xl font-medium">
              Order #{order.id}
            </h1>

            <p className="mt-3 text-sm text-white/40">
              {orderDate}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
              {order.orderStatus}
            </span>

            <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
              Payment:{" "}
              {order.paymentStatus}
            </span>
          </div>

        </div>

        {/* =================================================
            RETRY PAYMENT
        ================================================= */}

        {order.paymentStatus ===
          "PENDING" &&
          order.orderStatus ===
            "PLACED" && (

          <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.03] p-8">

            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
              Payment
            </p>

            <h2 className="mt-2 text-xl font-medium">
              Complete Your Payment
            </h2>

            <p className="mt-2 max-w-xl text-sm text-white/40">
              Your order has been created but
              payment has not been completed yet.
              You can safely retry the payment
              using the same order.
            </p>

            <div className="mt-5">
              <RetryPaymentButton
                orderId={order.id}
                onSuccess={() => {
                  window.location.reload();
                }}
              />
            </div>

          </div>
        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              ITEMS
          ================================================= */}

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-8">

            <div className="flex items-center gap-3">
              <Package
                size={20}
                className="text-white/50"
              />

              <h2 className="text-xl font-medium">
                Items
              </h2>
            </div>

            <div className="mt-8 space-y-6">

              {order.items.map(
                (item) => (

                <div
                  key={item.id}
                  className="flex justify-between gap-5 border-b border-white/10 pb-6 last:border-0 last:pb-0"
                >

                  <div>

                    <p className="text-base">
                      {item.productName}
                    </p>

                    <p className="mt-2 text-sm text-white/40">
                      {item.color} ×{" "}
                      {item.quantity}
                    </p>

                    <p className="mt-2 text-xs text-white/30">
                      ₹
                      {item.price.toLocaleString(
                        "en-IN",
                      )}{" "}
                      each
                    </p>

                  </div>

                  <p className="text-sm">
                    ₹
                    {item.total.toLocaleString(
                      "en-IN",
                    )}
                  </p>

                </div>
              ))}
            </div>

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="h-fit rounded-[30px] border border-white/10 bg-white/[0.03] p-8">

            <h2 className="text-xl font-medium">
              Order Summary
            </h2>

            <div className="mt-8 space-y-4 text-sm">

              <div className="flex justify-between text-white/50">
                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {order.subtotal.toLocaleString(
                    "en-IN",
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
                    : `₹${order.deliveryCharge.toLocaleString(
                        "en-IN",
                      )}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-white/10 pt-5 text-lg">
                <span>
                  Total
                </span>

                <span>
                  ₹
                  {order.total.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

            </div>

            <div className="mt-8 border-t border-white/10 pt-6">

              <div className="flex items-center gap-3">

                <CheckCircle
                  size={18}
                  className="text-white/60"
                />

                <div>

                  <p className="text-sm">
                    {order.orderStatus}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Payment:{" "}
                    {order.paymentStatus}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              DELIVERY DETAILS
          ================================================= */}

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-8 lg:col-span-2">

            <h2 className="text-xl font-medium">
              Delivery Details
            </h2>

            <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">

              <div>
                <p className="text-xs text-white/40">
                  Name
                </p>

                <p className="mt-2">
                  {order.customerName}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Email
                </p>

                <p className="mt-2 break-all">
                  {order.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Phone
                </p>

                <p className="mt-2">
                  {order.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Pincode
                </p>

                <p className="mt-2">
                  {order.pincode}
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">

                <p className="text-xs text-white/40">
                  Address
                </p>

                <p className="mt-2">
                  {order.address},{" "}
                  {order.city},{" "}
                  {order.state} -{" "}
                  {order.pincode}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SHIPPING / TRACKING
        ================================================= */}

        <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.03] p-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                Shipment
              </p>

              <h2 className="mt-2 text-xl font-medium">
                Tracking Information
              </h2>

            </div>

            {order.orderStatus ===
              "SHIPPED" && (

              <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
                SHIPPED
              </span>
            )}

          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs text-white/40">
                Shipping Partner
              </p>

              <p className="mt-2">
                {order.shippingPartner ||
                  "Not assigned yet"}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/40">
                Tracking Number
              </p>

              <p className="mt-2 break-all">
                {order.trackingNumber ||
                  "Not available yet"}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/40">
                Expected Delivery
              </p>

              <p className="mt-2">
                {expectedDelivery ||
                  "Not available yet"}
              </p>
            </div>

            <div className="flex items-end">

              {order.trackingUrl ? (

                <a
                  href={
                    order.trackingUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                >

                  <Truck size={15} />

                  Track Shipment

                </a>

              ) : (

                <span className="text-xs text-white/30">
                  Tracking link will appear
                  after shipment.
                </span>
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            CANCEL ORDER
        ================================================= */}

        {(
          order.orderStatus ===
            "PLACED" ||
          order.orderStatus ===
            "CONFIRMED" ||
          order.orderStatus ===
            "PROCESSING"
        ) && (

          <div className="mt-8 rounded-[30px] border border-red-500/20 bg-red-500/[0.03] p-8">

            <h2 className="text-lg font-medium">
              Cancel Order
            </h2>

            <p className="mt-2 text-sm text-white/40">
              You can cancel this order before
              it is shipped.
            </p>

            {cancelMessage && (
              <p className="mt-4 text-sm text-green-400">
                {cancelMessage}
              </p>
            )}

            <button
              type="button"
              onClick={cancelOrder}
              disabled={cancelling}
              className="mt-5 rounded-full border border-red-500/30 px-6 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}
            </button>

          </div>
        )}

        {/* =================================================
            CONTINUE SHOPPING
        ================================================= */}

        <button
          onClick={() =>
            router.push("/products")
          }
          className="mt-10 rounded-full bg-white px-8 py-3 text-sm font-medium text-black"
        >
          Continue Shopping
        </button>

      </section>
    </main>
  );
}