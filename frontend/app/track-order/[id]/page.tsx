"use client";
import API_BASE_URL from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Check,
  Truck,
  Package,
  MapPin,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type OrderItem = {
  id: number;
  productId: string;
  productName: string;
  color: string;
  price: number;
  quantity: number;
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

  shippingPartner: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  expectedDeliveryDate: string | null;

  createdAt: string;

  items: OrderItem[];
};

const statuses = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export default function TrackOrderPage() {

  const params = useParams();

  const id = params.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

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

          if (response.status === 404) {

            throw new Error(
              "Order not found."
            );
          }

          throw new Error(
            "Unable to load order."
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
            : "Unable to load order."
        );

      } finally {

        setLoading(false);

      }
    }


    if (id) {
      fetchOrder();
    }

  }, [id]);


  function formatAmount(
    amount: number
  ) {

    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  }


  function formatDate(
    date: string | null
  ) {

    if (!date) {
      return "To be confirmed";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }


  function getCurrentStep() {

    if (!order) {
      return 0;
    }

    const index =
      statuses.indexOf(
        order.orderStatus
      );

    return index >= 0 ? index : 0;
  }


  if (loading) {

    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <div className="flex min-h-screen items-center justify-center">

          <div className="text-sm text-white/40">
            Loading your order...
          </div>

        </div>

      </main>
    );
  }


  if (error || !order) {

    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">

          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">

            <Package
              size={40}
              className="mx-auto text-white/30"
            />

            <h1 className="mt-6 text-xl font-medium">
              Order Not Found
            </h1>

            <p className="mt-2 text-sm text-white/40">
              {error ||
                "We couldn't find this order."}
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to VAELIS
            </Link>

          </div>

        </div>

      </main>
    );
  }


  const currentStep =
    getCurrentStep();


  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-7">

          <Link
            href="/"
            className="text-xl font-semibold tracking-[0.3em]"
          >
            VAELIS
          </Link>

          <div className="text-xs tracking-[0.2em] text-[#c9a227]">
            ORDER TRACKING
          </div>

        </div>

      </header>


      {/* CONTENT */}

      <section className="mx-auto max-w-5xl px-6 py-12">

        {/* ORDER HEADER */}

        <div className="text-center">

          <p className="text-xs tracking-[0.2em] text-white/30">
            ORDER #{order.id}
          </p>

          <h1 className="mt-4 text-3xl font-medium">
            Track Your Order
          </h1>

          <p className="mt-3 text-sm text-white/40">
            Hello {order.customerName}, here's
            the latest update on your VAELIS order.
          </p>

        </div>


        {/* STATUS */}

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">

          <div className="relative">

            {/* CONNECTING LINE */}

            <div className="absolute left-[10%] right-[10%] top-6 hidden h-px bg-white/10 md:block" />

            <div
              className="absolute left-[10%] top-6 hidden h-px bg-[#c9a227] transition-all md:block"
              style={{
                width:
                  `${(currentStep / (statuses.length - 1)) * 80}%`,
              }}
            />


            {/* STEPS */}

            <div className="relative grid grid-cols-2 gap-8 md:grid-cols-5">

              {statuses.map(
                (status, index) => {

                  const completed =
                    index <= currentStep;

                  const isCurrent =
                    index === currentStep;


                  return (
                    <div
                      key={status}
                      className="text-center"
                    >

                      <div
                        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border ${
                          completed
                            ? "border-[#c9a227] bg-[#c9a227] text-black"
                            : "border-white/10 bg-[#111111] text-white/30"
                        }`}
                      >

                        {completed ? (
                          <Check size={19} />
                        ) : (
                          <Package size={17} />
                        )}

                      </div>


                      <p
                        className={`mt-4 text-xs font-medium ${
                          isCurrent
                            ? "text-[#c9a227]"
                            : completed
                            ? "text-white"
                            : "text-white/30"
                        }`}
                      >
                        {status}
                      </p>

                    </div>
                  );

                }
              )}

            </div>

          </div>

        </section>


        {/* SHIPMENT */}

        {(
          order.shippingPartner ||
          order.trackingNumber
        ) && (

          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <div className="flex items-center gap-3">

              <Truck
                size={20}
                className="text-[#c9a227]"
              />

              <div>

                <h2 className="font-medium">
                  Shipment Details
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  Your package is on its way.
                </p>

              </div>

            </div>


            <div className="mt-7 grid gap-6 sm:grid-cols-3">

              <div>

                <p className="text-xs text-white/30">
                  Shipping Partner
                </p>

                <p className="mt-2 text-sm font-medium">
                  {order.shippingPartner ||
                    "Not available"}
                </p>

              </div>


              <div>

                <p className="text-xs text-white/30">
                  Tracking Number
                </p>

                <p className="mt-2 text-sm font-medium">
                  {order.trackingNumber ||
                    "Not available"}
                </p>

              </div>


              <div>

                <p className="text-xs text-white/30">
                  Expected Delivery
                </p>

                <p className="mt-2 text-sm font-medium text-[#c9a227]">
                  {formatDate(
                    order.expectedDeliveryDate
                  )}
                </p>

              </div>

            </div>


            {order.trackingUrl && (

              <div className="mt-7">

                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-6 py-3 text-sm font-medium text-black transition hover:bg-[#d7b33a]"
                >
                  Track Shipment
                  <ExternalLink size={16} />
                </a>

              </div>

            )}

          </section>

        )}


        {/* ORDER INFORMATION */}

        <div className="mt-8 grid gap-8 md:grid-cols-2">

          {/* DELIVERY */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <div className="flex items-center gap-3">

              <MapPin
                size={20}
                className="text-[#c9a227]"
              />

              <h2 className="font-medium">
                Delivery Address
              </h2>

            </div>


            <div className="mt-6 text-sm leading-7 text-white/60">

              <p className="font-medium text-white">
                {order.customerName}
              </p>

              <p>
                {order.address}
              </p>

              <p>
                {order.city},{" "}
                {order.state} -{" "}
                {order.pincode}
              </p>

              <p className="mt-3 text-white/40">
                {order.phone}
              </p>

            </div>

          </section>


          {/* ORDER SUMMARY */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <h2 className="font-medium">
              Order Summary
            </h2>


            <div className="mt-6 space-y-4">

              {order.items.map(
                (item) => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4"
                  >

                    <div>

                      <p className="text-sm font-medium">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        {item.color} ×{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <p className="text-sm">
                      {formatAmount(
                        item.total
                      )}
                    </p>

                  </div>

                )
              )}

            </div>


            <div className="mt-6 border-t border-white/10 pt-5">

              <div className="flex justify-between text-sm text-white/50">
                <span>Subtotal</span>

                <span>
                  {formatAmount(
                    order.subtotal
                  )}
                </span>
              </div>


              <div className="mt-3 flex justify-between text-sm text-white/50">
                <span>Delivery</span>

                <span>
                  {order.deliveryCharge === 0
                    ? "FREE"
                    : formatAmount(
                        order.deliveryCharge
                      )}
                </span>
              </div>


              <div className="mt-4 flex justify-between border-t border-white/10 pt-4">

                <span className="font-medium">
                  Total
                </span>

                <span className="font-medium text-[#c9a227]">
                  {formatAmount(
                    order.total
                  )}
                </span>

              </div>

            </div>

          </section>

        </div>


        {/* FOOTER */}

        <div className="mt-12 text-center">

          <p className="text-xs tracking-[0.25em] text-white/20">
            VAELIS
          </p>

          <p className="mt-2 text-xs text-white/20">
            Designed for extraordinary sound.
          </p>

        </div>

      </section>

    </main>
  );
}