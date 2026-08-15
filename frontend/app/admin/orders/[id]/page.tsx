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
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: string;
  shippingPartner: string;
  trackingNumber: string;
  trackingUrl: string;
  expectedDeliveryDate: string;
  items: OrderItem[];
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

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");
const [shipmentSaving, setShipmentSaving] =
  useState(false);

const [shippingPartner, setShippingPartner] =
  useState("");

const [trackingNumber, setTrackingNumber] =
  useState("");

const [trackingUrl, setTrackingUrl] =
  useState("");

const [expectedDeliveryDate, setExpectedDeliveryDate] =
  useState("");

  // =========================
  // FETCH ORDER
  // =========================

  async function fetchOrder() {

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(
        `${API_BASE_URL}/api/orders/${id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

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


  // =========================
  // LOAD
  // =========================

  useEffect(() => {

    if (id) {
      fetchOrder();
    }

  }, [id]);


  // =========================
  // UPDATE STATUS
  // =========================

  async function updateOrderStatus() {

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

        throw new Error(
          "Unable to update order status."
        );
      }


      const updatedOrder =
        await response.json();

      setOrder(
        updatedOrder
      );

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

  async function updateShipment() {

  if (!order) {
    return;
  }

  try {

    setShipmentSaving(true);
    setError("");
    setSuccess("");

    const credentials =
      localStorage.getItem(
        "vaelis_admin_auth"
      );

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

      localStorage.removeItem(
        "vaelis_admin_auth"
      );

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

    setOrder(updatedOrder);

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


  // =========================
  // FORMAT AMOUNT
  // =========================

  function formatAmount(
    amount: number
  ) {

    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;

  }


  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(
    date: string
  ) {

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


  // =========================
  // STATUS INDEX
  // =========================

  const currentStatusIndex =
    order
      ? orderStatuses.indexOf(
          order.orderStatus
        )
      : -1;


  // =========================
  // LOADING
  // =========================

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


  // =========================
  // ERROR
  // =========================

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


  // =========================
  // PAGE
  // =========================

  return (

    <main className="min-h-screen bg-[#050505] text-white">


      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-10">


        {/* BACK */}

        <Link
          href="/admin/orders"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >

          <ArrowLeft
            size={16}
          />

          Back to Orders

        </Link>


        {/* TITLE */}

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


        {/* MESSAGES */}

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


          {/* LEFT */}

          <div className="space-y-8">


            {/* ORDER STATUS TIMELINE */}

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
                              className={`mt-2 text-[10px] text-center sm:text-xs ${
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


            {/* CUSTOMER */}

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


            {/* ITEMS */}

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
                          )} each

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


          {/* RIGHT */}

          <aside className="space-y-8">


            {/* STATUS CONTROL */}

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
      orderStatus: e.target.value,
    });
  }}
  className="mt-5 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
>
  {getAvailableOrderStatuses(
    order.orderStatus
  ).map((status) => (
    <option
      key={status}
      value={status}
    >
      {status}
    </option>
  ))}
</select>



              <button
                onClick={
                  updateOrderStatus
                }
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

                {/* SHIPMENT */}

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
        setShippingPartner(e.target.value)
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
        setTrackingNumber(e.target.value)
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
        setTrackingUrl(e.target.value)
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

    <input
      type="date"
      value={expectedDeliveryDate}
      onChange={(e) =>
        setExpectedDeliveryDate(
          e.target.value
        )
      }
      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
    />

  </div>


  {/* SAVE */}

  <button
    onClick={updateShipment}
    disabled={shipmentSaving}
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


            {/* PAYMENT */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

              <h2 className="text-lg font-medium">

                Payment

              </h2>


              <div className="mt-6 space-y-5">


                <div className="flex justify-between">

                  <span className="text-sm text-white/40">
                    Status
                  </span>

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


            {/* SUMMARY */}

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