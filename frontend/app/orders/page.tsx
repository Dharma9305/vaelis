"use client";

import API_BASE_URL from "@/lib/api";
import { useEffect, useState } from "react";
import { ArrowRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import Header from "../../components/layout/Header";
import RetryPaymentButton from "../../components/payment/RetryPaymentButton";

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

  const [user, setUser] = useState<User | null>(null);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [searched, setSearched] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================================
  // FIREBASE AUTH STATE
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setAuthLoading(false);
        },
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // LOAD ORDERS
  // =========================================================

  async function loadOrders(
    currentUser?: User | null,
  ) {
    const firebaseUser =
      currentUser ?? user;

    if (!firebaseUser) {
      setOrders([]);
      setLoading(false);
      setSearched(false);

      setError(
        "Please sign in to view your orders.",
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      // =====================================================
      // GET FRESH FIREBASE ID TOKEN
      // =====================================================

      const token =
        await firebaseUser.getIdToken();

      // =====================================================
      // REQUEST CUSTOMER ORDERS
      //
      // IMPORTANT:
      // We deliberately do NOT send an email query parameter.
      //
      // Spring Boot gets the customer identity from the
      // verified Firebase ID token.
      // =====================================================

      const response =
        await fetch(
          `${API_BASE_URL}/api/orders`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",
            },

            cache: "no-store",
          },
        );

      const responseText =
        await response.text();

      let data: unknown;

      try {
        data =
          responseText
            ? JSON.parse(responseText)
            : null;
      } catch {
        data = responseText;
      }

      // =====================================================
      // AUTHENTICATION FAILURE
      // =====================================================

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please sign in again.",
        );
      }

      // =====================================================
      // AUTHORIZATION FAILURE
      // =====================================================

      if (response.status === 403) {
        throw new Error(
          "You are not authorized to view these orders.",
        );
      }

      // =====================================================
      // OTHER FAILURE
      // =====================================================

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Unable to load orders.",
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      setOrders(
        Array.isArray(data)
          ? (data as Order[])
          : [],
      );

    } catch (error) {
      console.error(
        "Unable to load customer orders:",
        error,
      );

      setOrders([]);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load orders.",
      );

    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // AUTOMATICALLY LOAD ORDERS AFTER FIREBASE AUTH IS READY
  // =========================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      setSearched(false);

      setError(
        "Please sign in to view your orders.",
      );

      return;
    }

    loadOrders(user);
  }, [
    authLoading,
    user,
  ]);

  // =========================================================
  // AUTHENTICATION LOADING
  // =========================================================

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Header />

        <section className="mx-auto max-w-6xl px-6 py-16">

          <div className="py-20 text-center text-white/40">
            Checking your account...
          </div>

        </section>
      </main>
    );
  }

  // =========================================================
  // CUSTOMER NOT SIGNED IN
  // =========================================================

  if (!user) {
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
              Sign in to view your orders and track
              your purchases.
            </p>

          </div>

          <div className="mt-12 max-w-xl rounded-[30px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center">

            <Package
              size={42}
              className="mx-auto text-white/30"
            />

            <h2 className="mt-6 text-xl">
              Sign in required
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Please sign in with Google or your
              mobile number to view your orders.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/sign-in")
              }
              className="mt-8 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Sign In
            </button>

          </div>

        </section>
      </main>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-16">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="max-w-2xl">

          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            VAELIS
          </p>

          <h1 className="mt-4 text-4xl font-medium">
            My Orders
          </h1>

          <p className="mt-4 text-white/50">
            View and track your VAELIS orders.
          </p>

          {/* CUSTOMER IDENTITY */}

          <div className="mt-5">

            <p className="text-xs text-white/30">
              Signed in as
            </p>

            <p className="mt-1 text-sm text-white/60">
              {user.email ||
                user.phoneNumber ||
                user.displayName ||
                "VAELIS Customer"}
            </p>

          </div>

        </div>

        {/* =================================================
            REFRESH
        ================================================= */}

        <div className="mt-8">

          <button
            type="button"
            onClick={() =>
              loadOrders(user)
            }
            disabled={loading}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : "Refresh Orders"}
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 max-w-xl rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* =================================================
            ORDERS
        ================================================= */}

        <div className="mt-12">

          {loading ? (

            <div className="py-20 text-center text-white/40">
              Loading your orders...
            </div>

          ) : searched &&
            orders.length === 0 ? (

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] px-6 py-20 text-center">

              <Package
                size={42}
                className="mx-auto text-white/30"
              />

              <h2 className="mt-6 text-xl">
                No orders found
              </h2>

              <p className="mt-2 text-sm text-white/40">
                You don't have any orders yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/products")
                }
                className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
              >
                Continue Shopping
              </button>

            </div>

          ) : (

            <div className="space-y-5">

              {orders.map((order) => (

                <div
                  key={order.id}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                >

                  {/* =================================================
                      ORDER HEADER
                  ================================================= */}

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
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                      <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
                        {order.orderStatus}
                      </span>

                      <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
                        {order.paymentStatus}
                      </span>

                    </div>

                  </div>

                  {/* =================================================
                      ORDER ITEMS
                  ================================================= */}

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

                  {/* =================================================
                      TOTAL + ACTIONS
                  ================================================= */}

                  <div className="mt-6 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    {/* TOTAL */}

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

                    {/* ACTIONS */}

                    <div className="flex flex-wrap items-center gap-3">

                      {/* =================================================
                          RETRY PAYMENT
                          Only PENDING + PLACED orders
                      ================================================= */}

                      {order.paymentStatus ===
                        "PENDING" &&
                        order.orderStatus ===
                          "PLACED" && (

                          <RetryPaymentButton
                            orderId={order.id}
                            onSuccess={() => {
                              loadOrders(user);
                            }}
                          />

                        )}

                      {/* =================================================
                          VIEW ORDER
                      ================================================= */}

                      <button
                        onClick={() =>
                          router.push(
                            `/orders/${order.id}`,
                          )
                        }
                        className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.06]"
                      >

                        View Order

                        <ArrowRight
                          size={15}
                        />

                      </button>

                    </div>

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