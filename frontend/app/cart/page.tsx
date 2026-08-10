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

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const deliveryCharge = subtotal >= 2000 || subtotal === 0 ? 0 : 99;

  const total = subtotal + deliveryCharge;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <Header />
      {/* PAGE */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
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
                  items.length === 1 ? "" : "s"
                } in your bag.`}
          </p>
        </div>

        {items.length === 0 ? (
          /* EMPTY CART */
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
              Discover premium technology designed for
              modern living.
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
            {/* ITEMS */}
            <div>
              <div className="overflow-hidden rounded-[30px] border border-white/10">
                {items.map((item, index) => (
                  <article
                    key={`${item.product.id}-${item.color}`}
                    className={`p-6 sm:p-8 ${
                      index !== items.length - 1
                        ? "border-b border-white/10"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-6 sm:flex-row">
                      {/* PRODUCT VISUAL */}
                      <a
                        href={`/products/${item.product.slug}`}
                        className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-950 to-black sm:h-40 sm:w-40"
                      >
                        <div className="h-20 w-20 rounded-[24px] border border-white/10 bg-white/[0.04] shadow-2xl" />
                      </a>

                      {/* INFO */}
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
                            onClick={() =>
                              removeFromCart(
                                item.product.id,
                                item.color,
                              )
                            }
                            className="h-fit text-white/30 transition hover:text-red-400"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-6">
                          {/* QUANTITY */}
                          <div className="flex items-center rounded-full border border-white/10">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.color,
                                  item.quantity - 1,
                                )
                              }
                              className="p-2.5 text-white/50 transition hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="min-w-8 text-center text-sm">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.color,
                                  item.quantity + 1,
                                )
                              }
                              className="p-2.5 text-white/50 transition hover:text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <p className="text-lg">
                            ₹
                            {(
                              item.product.price *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-between gap-4">
                <a
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
                >
                  <ArrowLeft size={15} />
                  Continue Shopping
                </a>

                <button
                  onClick={clearCart}
                  className="text-sm text-white/30 transition hover:text-red-400"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* SUMMARY */}
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
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/40">
                    Delivery
                  </span>

                  <span>
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge}`}
                  </span>
                </div>
              </div>

              {subtotal > 0 && subtotal < 2000 && (
                <div className="mt-6 rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/5 p-4 text-xs leading-5 text-white/50">
                  Add ₹
                  {(2000 - subtotal).toLocaleString("en-IN")} more
                  to unlock free delivery.
                </div>
              )}

              <div className="my-7 border-t border-white/10" />

              <div className="flex justify-between">
                <span className="text-white/50">
                  Total
                </span>

                <span className="text-2xl">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() =>
                  alert(
                    "Checkout will be connected to Razorpay in the next milestone.",
                  )
                }
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition hover:bg-[#c9a227]"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>

              <p className="mt-5 text-center text-[11px] leading-5 text-white/25">
                Secure checkout. Payments will be powered by
                Razorpay.
              </p>
            </aside>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-7xl justify-between text-xs text-white/30">
          <span>
            © {new Date().getFullYear()} VAELIS India.
          </span>

          <span>Designed for Tomorrow.</span>
        </div>
      </footer>
    </main>
  );
}