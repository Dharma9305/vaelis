"use client";

import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Header from "../../components/layout/Header";
import { useCart } from "@/components/cart/CartProvider";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // =========================================================
  // INVENTORY VALIDATION
  // =========================================================

  const invalidItems = items.filter(
    (item) => {
      const stock =
        typeof item.product.stockQuantity ===
        "number"
          ? Math.max(
              0,
              item.product.stockQuantity,
            )
          : null;

      // If backend stock isn't available yet,
      // don't block the customer solely because
      // an old cart item doesn't contain stock data.
      if (stock === null) {
        return false;
      }

      return (
        stock === 0 ||
        item.quantity > stock
      );
    },
  );

  const hasInvalidItems =
    invalidItems.length > 0;

  const deliveryCharge =
    subtotal >= 2000 ||
    subtotal === 0
      ? 0
      : 99;

  const total =
    subtotal + deliveryCharge;

  // =========================================================
  // STOCK STATUS
  // =========================================================

  const getStockStatus = (
    item: typeof items[number],
  ) => {

    const stock =
      typeof item.product.stockQuantity ===
      "number"
        ? Math.max(
            0,
            item.product.stockQuantity,
          )
        : null;

    const threshold =
      typeof item.product.lowStockThreshold ===
      "number"
        ? Math.max(
            0,
            item.product.lowStockThreshold,
          )
        : 5;

    if (stock === null) {
      return {
        type: "unknown" as const,
        label: "Checking stock...",
      };
    }

    if (stock === 0) {
      return {
        type: "out" as const,
        label: "OUT OF STOCK",
      };
    }

    if (stock <= threshold) {
      return {
        type: "low" as const,
        label:
          stock === 1
            ? "ONLY 1 LEFT"
            : `ONLY ${stock} LEFT`,
      };
    }

    return {
      type: "available" as const,
      label: `${stock} AVAILABLE`,
    };
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <Header />

      {/* =====================================================
          PAGE
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

        {/* ===================================================
            TITLE
            =================================================== */}

        <div className="mb-12">

          <p className="text-xs tracking-[0.4em] text-[#c9a227]">
            VAELIS
          </p>

          <h1 className="mt-4 text-5xl font-medium tracking-tight sm:text-6xl">
            Your Bag
          </h1>

          <p className="mt-4 text-sm text-white/40">

            {items.length === 0
              ? "Your bag is currently empty."
              : `${items.length} product${
                  items.length === 1
                    ? ""
                    : "s"
                } in your bag.`}

          </p>

        </div>

        {/* ===================================================
            EMPTY CART
            =================================================== */}

        {items.length === 0 ? (

          <div className="rounded-[32px] border border-white/10 bg-[#090909] px-6 py-24 text-center">

            <ShoppingBag
              size={42}
              strokeWidth={1}
              className="mx-auto text-white/25"
            />

            <h2 className="mt-7 text-2xl font-medium">
              Your bag is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/35">
              Discover premium technology designed
              for modern living.
            </p>

            <a
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-[#c9a227]"
            >
              Explore Products
              <ArrowRight size={16} />
            </a>

          </div>

        ) : (

          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

            {/* =================================================
                ITEMS
                ================================================= */}

            <div>

              <div className="overflow-hidden rounded-[30px] border border-white/10">

                {items.map(
                  (
                    item,
                    index,
                  ) => {

                    const stockStatus =
                      getStockStatus(
                        item,
                      );

                    const stock =
                      typeof item.product.stockQuantity ===
                      "number"
                        ? Math.max(
                            0,
                            item.product.stockQuantity,
                          )
                        : null;

                    const isOutOfStock =
                      stockStatus.type ===
                      "out";

                    const isLowStock =
                      stockStatus.type ===
                      "low";

                    const quantityAtLimit =
                      stock !== null &&
                      item.quantity >=
                        stock;

                    const quantityExceedsStock =
                      stock !== null &&
                      item.quantity >
                        stock;

                    return (

                      <article
                        key={`${item.product.id}-${item.color}`}
                        className={`p-6 sm:p-8 ${
                          index !==
                          items.length - 1
                            ? "border-b border-white/10"
                            : ""
                        }`}
                      >

                        <div className="flex flex-col gap-6 sm:flex-row">

                          {/* =================================
                              PRODUCT VISUAL
                              ================================= */}

                          <a
                            href={`/products/${item.product.slug}`}
                            className={`flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-950 to-black sm:h-40 sm:w-40 ${
                              isOutOfStock
                                ? "opacity-50"
                                : ""
                            }`}
                          >

                            {item.imageUrl ? (

                              <img
                                src={item.imageUrl}
                                alt={
                                  item.product.name
                                }
                                className={`h-full w-full object-contain p-5 ${
                                  isOutOfStock
                                    ? "grayscale"
                                    : ""
                                }`}
                              />

                            ) : (

                              <div className="h-20 w-20 rounded-[24px] border border-white/10 bg-white/[0.04] shadow-2xl" />

                            )}

                          </a>

                          {/* =================================
                              INFO
                              ================================= */}

                          <div className="flex flex-1 flex-col">

                            <div className="flex justify-between gap-5">

                              <div>

                                <p className="text-[10px] tracking-[0.3em] text-[#c9a227]">
                                  {item.product.category.toUpperCase()}
                                </p>

                                <h2 className="mt-2 text-xl font-medium">
                                  {item.product.name}
                                </h2>

                                <p className="mt-2 text-sm text-white/35">
                                  {item.color}
                                </p>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(
                                    item.product.id,
                                    item.color,
                                  )
                                }
                                className="h-fit text-white/30 transition hover:text-red-400"
                                aria-label={`Remove ${item.product.name}`}
                              >
                                <Trash2
                                  size={18}
                                />
                              </button>

                            </div>

                            {/* =================================
                                STOCK STATUS
                                ================================= */}

                            <div className="mt-5">

                              {isOutOfStock ? (

                                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

                                  <p className="text-xs font-medium tracking-wider text-red-300">
                                    OUT OF STOCK
                                  </p>

                                  <p className="mt-1 text-[11px] text-red-200/50">
                                    This product is currently unavailable.
                                  </p>

                                </div>

                              ) : isLowStock ? (

                                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">

                                  <p className="text-xs font-medium tracking-wider text-yellow-300">
                                    {stockStatus.label}
                                  </p>

                                  <p className="mt-1 text-[11px] text-yellow-200/50">
                                    Order soon before it sells out.
                                  </p>

                                </div>

                              ) : (

                                <div className="flex items-center gap-2">

                                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                  <p className="text-xs text-emerald-300">
                                    {stockStatus.label}
                                  </p>

                                </div>

                              )}

                            </div>

                            {/* =================================
                                QUANTITY + PRICE
                                ================================= */}

                            <div className="mt-auto flex items-center justify-between pt-6">

                              {/* QUANTITY */}

                              <div className="flex items-center rounded-full border border-white/10">

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.color,
                                      item.quantity -
                                        1,
                                    )
                                  }
                                  disabled={
                                    item.quantity <=
                                    1
                                  }
                                  className="p-2.5 text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus
                                    size={14}
                                  />
                                </button>

                                <span className="min-w-8 text-center text-sm">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.color,
                                      item.quantity +
                                        1,
                                    )
                                  }
                                  disabled={
                                    isOutOfStock ||
                                    quantityAtLimit
                                  }
                                  className="p-2.5 text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                  aria-label="Increase quantity"
                                >
                                  <Plus
                                    size={14}
                                  />
                                </button>

                              </div>

                              <p className="text-lg">
                                ₹
                                {(
                                  item.product.price *
                                  item.quantity
                                ).toLocaleString(
                                  "en-IN",
                                )}
                              </p>

                            </div>

                            {/* =================================
                                LIMIT WARNING
                                ================================= */}

                            {quantityAtLimit &&
                              !isOutOfStock &&
                              stock !== null && (

                                <p className="mt-3 text-right text-[11px] text-white/30">
                                  Maximum available:
                                  {" "}
                                  {stock}
                                </p>

                              )}

                            {quantityExceedsStock &&
                              stock !== null && (

                                <p className="mt-3 text-right text-[11px] text-red-300">
                                  Only{" "}
                                  {stock}{" "}
                                  available.
                                  Quantity will be adjusted automatically.
                                </p>

                              )}

                          </div>

                        </div>

                      </article>

                    );
                  },
                )}

              </div>

              {/* =================================================
                  INVALID CART WARNING
                  ================================================= */}

              {hasInvalidItems && (

                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

                  <p className="text-sm font-medium text-red-300">
                    Some items are unavailable
                  </p>

                  <p className="mt-2 text-xs leading-5 text-red-200/50">
                    Please remove unavailable items or
                    wait for stock to become available
                    before proceeding to checkout.
                  </p>

                </div>

              )}

              {/* =================================================
                  CART ACTIONS
                  ================================================= */}

              <div className="mt-6 flex flex-wrap justify-between gap-4">

                <a
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
                >
                  <ArrowLeft size={15} />
                  Continue Shopping
                </a>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm text-white/30 transition hover:text-red-400"
                >
                  Clear Bag
                </button>

              </div>

            </div>

            {/* =================================================
                SUMMARY
                ================================================= */}

            <aside className="h-fit rounded-[30px] border border-white/10 bg-[#090909] p-7 lg:sticky lg:top-8">

              <h2 className="text-xl font-medium">
                Order Summary
              </h2>

              <div className="mt-8 space-y-4 text-sm">

                <div className="flex justify-between">

                  <span className="text-white/40">
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN",
                    )}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-white/40">
                    Delivery
                  </span>

                  <span>
                    {deliveryCharge ===
                    0
                      ? "FREE"
                      : `₹${deliveryCharge}`}
                  </span>

                </div>

              </div>

              {/* =================================================
                  FREE DELIVERY MESSAGE
                  ================================================= */}

              {subtotal > 0 &&
                subtotal < 2000 && (

                  <div className="mt-6 rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/5 p-4 text-xs leading-5 text-white/50">

                    Add ₹
                    {(
                      2000 -
                      subtotal
                    ).toLocaleString(
                      "en-IN",
                    )}{" "}
                    more to unlock free delivery.

                  </div>

                )}

              <div className="my-7 border-t border-white/10" />

              <div className="flex justify-between">

                <span className="text-white/50">
                  Total
                </span>

                <span className="text-2xl">
                  ₹
                  {total.toLocaleString(
                    "en-IN",
                  )}
                </span>

              </div>

              {/* =================================================
                  CHECKOUT BUTTON
                  ================================================= */}

              <button
                type="button"
                disabled={
                  hasInvalidItems ||
                  subtotal <= 0
                }
                onClick={() => {

                  if (
                    hasInvalidItems
                  ) {
                    return;
                  }

                  router.push(
                    "/checkout",
                  );
                }}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition hover:bg-[#c9a227] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
              >

                {hasInvalidItems
                  ? "Stock Unavailable"
                  : "Proceed to Checkout"}

                {!hasInvalidItems && (
                  <ArrowRight
                    size={16}
                  />
                )}

              </button>

              {/* =================================================
                  CHECKOUT WARNING
                  ================================================= */}

              {hasInvalidItems ? (

                <p className="mt-5 text-center text-[11px] leading-5 text-red-300/60">
                  Please resolve the stock issue
                  before continuing.
                </p>

              ) : (

                <p className="mt-5 text-center text-[11px] leading-5 text-white/25">
                  Secure checkout. Payments will be
                  powered by Razorpay.
                </p>

              )}

            </aside>

          </div>

        )}

      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="border-t border-white/10 px-6 py-12">

        <div className="mx-auto flex max-w-7xl justify-between text-xs text-white/30">

          <span>
            ©{" "}
            {new Date().getFullYear()}{" "}
            VAELIS India.
          </span>

          <span>
            Designed for Tomorrow.
          </span>

        </div>

      </footer>

    </main>
  );
}