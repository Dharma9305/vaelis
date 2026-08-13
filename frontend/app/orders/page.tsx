"use client";
import API_BASE_URL from "@/lib/api";
import { useEffect, useState } from "react";
import { ArrowRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "../../components/layout/Header";

type OrderItem = {
  id: number;
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
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function loadOrders() {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const response = await fetch(
        `${API_BASE_URL}/api/orders?email=${encodeURIComponent(
          email.trim(),
        )}`,
      );

      if (!response.ok) {
        throw new Error("Unable to load orders.");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            VAELIS
          </p>

          <h1 className="mt-4 text-4xl font-medium">
            My Orders
          </h1>

          <p className="mt-4 text-white/50">
            Enter the email address used during checkout
            to view your orders.
          </p>
        </div>

        {/* EMAIL SEARCH */}
        <div className="mt-10 flex max-w-xl gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                loadOrders();
              }
            }}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
          />

          <button
            onClick={loadOrders}
            disabled={loading}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            {loading ? "Loading..." : "Find Orders"}
          </button>
        </div>

        {error && (
          <div className="mt-5 max-w-xl rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ORDERS */}
        <div className="mt-12">
          {loading ? (
            <div className="py-20 text-center text-white/40">
              Loading your orders...
            </div>
          ) : searched && orders.length === 0 ? (
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
              <Package
                size={42}
                className="mx-auto text-white/30"
              />

              <h2 className="mt-6 text-xl">
                No orders found
              </h2>

              <p className="mt-2 text-sm text-white/40">
                We couldn't find any orders for this email.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Order
                      </p>

                      <h2 className="mt-1 text-xl">
                        #{order.id}
                      </h2>

                      <p className="mt-2 text-xs text-white/40">
                        {new Date(
                          order.createdAt,
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
                        {order.orderStatus}
                      </span>

                      <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="text-sm">
                              {item.productName}
                            </p>

                            <p className="mt-1 text-xs text-white/40">
                              {item.color} ×{" "}
                              {item.quantity}
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

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
                    <div>
                      <p className="text-xs text-white/40">
                        Total
                      </p>

                      <p className="mt-1 text-xl">
                        ₹
                        {order.total.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          `/orders/${order.id}`,
                        )
                      }
                      className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
                    >
                      View Order
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}