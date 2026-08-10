"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import Header from "../../../components/layout/Header";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

import { getProductBySlug, products } from "../../../data/products";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart, itemCount } = useCart(); 

  const product = getProductBySlug(slug);

  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] =
  useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] ?? "",
  );
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] text-[#c9a227]">
            VAELIS
          </p>

          <h1 className="mt-5 text-4xl font-medium">
            Product not found
          </h1>

          <a
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-black"
          >
            <ArrowLeft size={16} />
            Back to Products
          </a>
        </div>
      </main>
    );
  }

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = () => {
  addToCart(product, quantity, selectedColor);
  setShowAddedMessage(true);

  setTimeout(() => {
    setShowAddedMessage(false);
  }, 3000);
  console.log("VAELIS CART:", {
    product: product.name,
    quantity,
    color: selectedColor,
  });

};

  const handleBuyNow = () => {
    console.log("Buy now:", {
      product: product.id,
      quantity,
      color: selectedColor,
    });

    alert("Checkout will be connected in the next milestone.");
  };

  return (
    <main 
    
    className="min-h-screen bg-[#050505] text-white">
       {showAddedMessage && (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="fixed right-5 top-24 z-[100] w-[calc(100%-40px)] max-w-sm rounded-2xl border border-white/10 bg-[#111]/95 p-4 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c9a227] text-black">
            <Check size={18} />
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium">
              Added to Bag
            </p>

            <p className="mt-1 text-xs text-white/40">
              {product.name} · {selectedColor}
            </p>

            <a
              href="/cart"
              className="mt-3 inline-flex text-xs text-[#c9a227] transition hover:text-white"
            >
              View Bag →
            </a>
          </div>
        </div>
      </motion.div>
    )}
 
      {/* NAVIGATION */}
      <Header />

      {/* BREADCRUMB */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <a
          href="/products"
          className="inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Products
        </a>
      </div>

      {/* PRODUCT HERO */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* PRODUCT VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[520px] overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-950 to-black"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(201,162,39,0.14),transparent_42%)]" />

            {product.badge && (
              <div className="absolute left-7 top-7 z-10 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-[10px] tracking-[0.2em] text-white/60 backdrop-blur">
                {product.badge.toUpperCase()}
              </div>
            )}

            {/* Concept product */}
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex h-[300px] w-[220px] items-center justify-center rounded-[48px] border border-white/15 bg-gradient-to-br from-zinc-700 via-zinc-950 to-black shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
              >
                <div className="absolute inset-4 rounded-[38px] border border-white/5" />

                <div className="text-center">
                  <p className="text-[9px] tracking-[0.45em] text-[#c9a227]">
                    VAELIS
                  </p>

                  <p className="mt-2 text-4xl font-light">
                    {product.name
                      .replace("VAELIS ", "")
                      .split(" ")[0]
                      .toUpperCase()}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-center">
              <p className="text-[9px] tracking-[0.35em] text-white/30">
                VAELIS PRODUCT CONCEPT
              </p>
            </div>
          </motion.div>

          {/* PRODUCT INFORMATION */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs tracking-[0.4em] text-[#c9a227]">
              {product.category.toUpperCase()}
            </p>

            <h1 className="mt-5 text-5xl font-medium tracking-[-0.04em] sm:text-6xl">
              {product.name}
            </h1>

            <p className="mt-5 text-lg text-white/45">
              {product.shortDescription}
            </p>

            {/* Rating */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    fill={
                      star <= Math.round(product.rating)
                        ? "#c9a227"
                        : "transparent"
                    }
                    className={
                      star <= Math.round(product.rating)
                        ? "text-[#c9a227]"
                        : "text-white/20"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-white/40">
                {product.rating}
                {product.reviewCount > 0 &&
                  ` · ${product.reviewCount} reviews`}
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-8 border-y border-white/10 py-7">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-medium">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                {product.originalPrice && (
                  <span className="mb-1 text-sm text-white/30 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-white/35">
                Inclusive of all applicable taxes
              </p>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-7 text-sm leading-7 text-white/50">
              {product.description}
            </p>

            {/* COLORS */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-sm">Color</p>

                <span className="text-xs text-white/35">
                  {selectedColor}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-5 py-2.5 text-xs transition ${
                      selectedColor === color
                        ? "border-[#c9a227] text-[#c9a227]"
                        : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY + WISHLIST */}
            <div className="mt-8 flex gap-3">
              <div className="flex items-center rounded-full border border-white/10">
                <button
                  onClick={decreaseQuantity}
                  className="p-3 text-white/50 transition hover:text-white"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>

                <span className="min-w-10 text-center text-sm">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  className="p-3 text-white/50 transition hover:text-white"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={() =>
                  setAddedToWishlist(!addedToWishlist)
                }
                className={`rounded-full border px-4 transition ${
                  addedToWishlist
                    ? "border-[#c9a227] text-[#c9a227]"
                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart
                  size={18}
                  fill={addedToWishlist ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* ACTIONS */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex items-center justify-center gap-3 rounded-full border border-white/20 px-6 py-4 text-sm transition hover:border-[#c9a227] hover:text-[#c9a227] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag size={17} />
                {product.inStock
                  ? "Add to Bag"
                  : "Coming Soon"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition hover:bg-[#c9a227] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buy Now
              </button>
            </div>

            {/* DELIVERY */}
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-2">
              <div className="flex gap-3">
                <Truck
                  size={19}
                  className="mt-0.5 text-[#c9a227]"
                />

                <div>
                  <p className="text-xs">
                    Fast Delivery
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    Available across India
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 text-[#c9a227]"
                />

                <div>
                  <p className="text-xs">
                    1 Year Warranty
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    VAELIS official warranty
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-white/10 bg-[#080808] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.4em] text-[#c9a227]">
              ENGINEERED FOR YOU
            </p>

            <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">
              Everything you need.
              <br />
              Nothing you don&apos;t.
            </h2>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="bg-[#080808] p-7"
              >
                <Check
                  size={19}
                  className="text-[#c9a227]"
                />

                <p className="mt-5 text-sm text-white/70">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIFICATIONS */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs tracking-[0.4em] text-[#c9a227]">
              SPECIFICATIONS
            </p>

            <h2 className="mt-5 text-4xl font-medium">
              Built with precision.
            </h2>
          </div>

          <div className="mt-14 overflow-hidden rounded-[28px] border border-white/10">
            {product.specifications.map((spec, index) => (
              <div
                key={spec.label}
                className={`grid grid-cols-2 gap-5 px-6 py-5 text-sm ${
                  index !== product.specifications.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                <span className="text-white/35">
                  {spec.label}
                </span>

                <span className="text-right text-white/75">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT DESCRIPTION */}
      <section className="border-t border-white/10 bg-[#080808] px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.4em] text-[#c9a227]">
            THE VAELIS EXPERIENCE
          </p>

          <h2 className="mt-6 text-4xl font-medium sm:text-5xl">
            Designed for Tomorrow.
          </h2>

          <p className="mt-8 text-base leading-8 text-white/40">
            {product.description} Every detail is designed to
            deliver a premium experience while keeping technology
            simple, intuitive and beautifully integrated into
            everyday life.
          </p>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs tracking-[0.4em] text-[#c9a227]">
                YOU MAY ALSO LIKE
              </p>

              <h2 className="mt-4 text-4xl font-medium">
                Explore more.
              </h2>
            </div>

            <a
              href="/products"
              className="hidden items-center gap-2 text-sm text-white/40 transition hover:text-white sm:flex"
            >
              View all
              <ArrowLeft size={15} className="rotate-180" />
            </a>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((item) => item.id !== product.id)
              .slice(0, 3)
              .map((item) => (
                <a
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a]"
                >
                  <div className="flex h-64 items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-950 to-black">
                    <div className="h-28 w-28 rounded-[30px] border border-white/10 bg-white/[0.04] shadow-2xl transition duration-500 group-hover:scale-110" />
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] tracking-[0.3em] text-[#c9a227]">
                      {item.category.toUpperCase()}
                    </p>

                    <h3 className="mt-3 text-xl">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm text-white/35">
                      {item.shortDescription}
                    </p>

                    <p className="mt-5 text-sm">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-white/30 sm:flex-row">
          <span>
            © {new Date().getFullYear()} VAELIS India.
          </span>

          <span>Designed for Tomorrow.</span>
        </div>
      </footer>
    </main>
  );
}