"use client";
import API_BASE_URL from "@/lib/api";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";

import Header from "../components/layout/Header";

type ProductImage = {
  id?: number;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  primaryImage: boolean;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string | null;
  description: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  badge: string | null;
  rating: number | null;
  reviewCount: number | null;
  inStock: boolean;
  colors: string[];
  features: string[];
  images: ProductImage[];
};

export default function HomePage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/products`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load products."
          );
        }

        const data =
          await response.json();

        setProducts(
          data.map(
            (product: Product) => ({
              ...product,
              images:
                product.images || [],
              colors:
                product.colors || [],
              features:
                product.features || [],
            })
          )
        );
      } catch (err) {
        console.error(
          "Homepage products error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function getProductImage(
    product: Product
  ) {
    const images =
      product.images || [];

    const primary =
      images.find(
        (image) =>
          image.primaryImage === true
      );

    return (
      primary?.imageUrl ||
      images[0]?.imageUrl ||
      null
    );
  }

  const featuredProducts =
    products.slice(0, 3);

  const heroProduct =
    products.find(
      (product) =>
        product.slug ===
        "vaelis-air"
    ) ||
    products[0];

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* =========================
          HEADER
          ========================= */}

      <Header />

      {/* =========================
          HERO
          ========================= */}

      <section className="relative overflow-hidden border-b border-white/10">

        {/* Background glow */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#c9a227]/10 blur-[140px]" />

          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-white/[0.03] blur-[120px]" />

        </div>

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8">

          {/* HERO TEXT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            <p className="text-xs tracking-[0.5em] text-[#c9a227]">
              VAELIS TECHNOLOGY
            </p>

            <h1 className="mt-7 text-6xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">

              Designed

              <br />

              <span className="text-white/35">
                for Tomorrow.
              </span>

            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/45 sm:text-lg">

              Premium technology engineered
              around the way modern life moves,
              works and connects.

            </p>

            <div className="mt-10 flex flex-wrap gap-3">

              <a
                href="/products"
                className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-[#c9a227]"
              >
                Explore Collection
                <ArrowRight size={16} />
              </a>

              <a
                href="/products/vaelis-air"
                className="inline-flex items-center gap-3 rounded-full border border-white/15 px-7 py-4 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Discover VAELIS Air
              </a>

            </div>

            {/* Trust */}

            <div className="mt-12 flex flex-wrap gap-7 text-xs text-white/35">

              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  className="text-[#c9a227]"
                />
                Official Warranty
              </div>

              <div className="flex items-center gap-2">
                <Truck
                  size={16}
                  className="text-[#c9a227]"
                />
                Pan-India Delivery
              </div>

            </div>

          </motion.div>

          {/* HERO PRODUCT */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
            }}
            className="relative"
          >

            <div className="relative mx-auto aspect-square max-w-[620px] overflow-hidden rounded-[48px] border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-950 to-black">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(201,162,39,0.18),transparent_45%)]" />

              {heroProduct &&
              getProductImage(
                heroProduct
              ) ? (

                <img
                  src={getProductImage(
                    heroProduct
                  ) || ""}
                  alt={
                    heroProduct.name
                  }
                  className="relative z-10 h-full w-full object-contain p-10 transition duration-700 hover:scale-105"
                />

              ) : (

                <div className="absolute inset-0 flex items-center justify-center">

                  <div className="h-64 w-48 rounded-[55px] border border-white/10 bg-white/[0.04] shadow-[0_40px_100px_rgba(0,0,0,0.8)]" />

                </div>

              )}

              {heroProduct && (

                <div className="absolute bottom-7 left-7 right-7 z-20 flex items-end justify-between">

                  <div>

                    <p className="text-[9px] tracking-[0.35em] text-[#c9a227]">
                      FEATURED
                    </p>

                    <p className="mt-2 text-xl font-medium">
                      {heroProduct.name}
                    </p>

                  </div>

                  <a
                    href={`/products/${heroProduct.slug}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:bg-[#c9a227]"
                  >
                    <ArrowRight
                      size={17}
                    />
                  </a>

                </div>

              )}

            </div>

          </motion.div>

        </div>

      </section>

      {/* =========================
          FEATURED PRODUCTS
          ========================= */}

      <section className="px-6 py-28 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs tracking-[0.45em] text-[#c9a227]">
                THE COLLECTION
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">
                Technology,
                <br />
                refined.
              </h2>

            </div>

            <a
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
            >
              View all products
              <ArrowRight
                size={15}
              />
            </a>

          </div>

          {/* Loading */}

          {loading && (

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (

                  <div
                    key={item}
                    className="h-[520px] animate-pulse rounded-[30px] border border-white/10 bg-white/[0.03]"
                  />

                )
              )}

            </div>

          )}

          {/* Error */}

          {!loading &&
            error && (

              <div className="mt-14 rounded-[30px] border border-red-500/20 bg-red-500/5 px-6 py-20 text-center">

                <p className="text-sm text-red-300/70">
                  {error}
                </p>

              </div>

            )}

          {/* Products */}

          {!loading &&
            !error && (

              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {featuredProducts.map(
                  (
                    product,
                    index
                  ) => {

                    const image =
                      getProductImage(
                        product
                      );

                    return (

                      <motion.article
                        key={
                          product.id
                        }
                        initial={{
                          opacity: 0,
                          y: 25,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.5,
                          delay:
                            index *
                            0.08,
                        }}
                        className="group overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0a]"
                      >

                        {/* IMAGE */}

                        <a
                          href={`/products/${product.slug}`}
                          className="relative flex h-[390px] items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-950 to-black"
                        >

                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(201,162,39,0.12),transparent_45%)]" />

                          {image ? (

                            <img
                              src={image}
                              alt={
                                product.name
                              }
                              className="relative z-10 h-full w-full object-contain p-10 transition duration-700 group-hover:scale-110"
                            />

                          ) : (

                            <div className="h-44 w-44 rounded-[45px] border border-white/10 bg-white/[0.04]" />

                          )}

                          {product.badge && (

                            <span className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] tracking-wider text-white/70 backdrop-blur">
                              {product.badge}
                            </span>

                          )}

                        </a>

                        {/* INFO */}

                        <div className="p-7">

                          <p className="text-[10px] tracking-[0.3em] text-[#c9a227]">
                            {product.category.toUpperCase()}
                          </p>

                          <h3 className="mt-3 text-2xl font-medium">
                            {product.name}
                          </h3>

                          <p className="mt-2 text-sm text-white/40">
                            {
                              product.shortDescription
                            }
                          </p>

                          <div className="mt-5 flex items-center gap-2">

                            <div className="flex gap-0.5">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (

                                  <Star
                                    key={
                                      star
                                    }
                                    size={
                                      12
                                    }
                                    fill={
                                      star <=
                                      Math.round(
                                        product.rating ||
                                          0
                                      )
                                        ? "#c9a227"
                                        : "transparent"
                                    }
                                    className={
                                      star <=
                                      Math.round(
                                        product.rating ||
                                          0
                                      )
                                        ? "text-[#c9a227]"
                                        : "text-white/20"
                                    }
                                  />

                                )
                              )}

                            </div>

                            <span className="text-xs text-white/30">

                              {product.rating ||
                                0}

                              {(product.reviewCount ||
                                0) >
                                0 &&
                                ` (${product.reviewCount})`}

                            </span>

                          </div>

                          <div className="mt-6 flex items-center justify-between">

                            <span className="text-lg">
                              ₹
                              {product.price.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <a
                              href={`/products/${product.slug}`}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs text-white/60 transition hover:border-[#c9a227] hover:text-[#c9a227]"
                            >
                              Explore
                              <ArrowRight
                                size={14}
                              />
                            </a>

                          </div>

                        </div>

                      </motion.article>

                    );
                  }
                )}

              </div>

            )}

        </div>

      </section>

      {/* =========================
          BRAND STATEMENT
          ========================= */}

      <section className="border-y border-white/10 bg-[#080808] px-6 py-32 lg:px-8">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-xs tracking-[0.45em] text-[#c9a227]">
            THE VAELIS PHILOSOPHY
          </p>

          <h2 className="mt-7 text-4xl font-medium tracking-tight sm:text-6xl">

            Technology should
            <br />

            <span className="text-white/35">
              disappear into life.
            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/40">

            Every VAELIS product is designed to
            combine intelligent engineering,
            refined materials and effortless
            everyday experience.

          </p>

        </div>

      </section>

      {/* =========================
          WHY VAELIS
          ========================= */}

      <section className="px-6 py-28 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-xs tracking-[0.45em] text-[#c9a227]">
              WHY VAELIS
            </p>

            <h2 className="mt-5 text-4xl font-medium sm:text-5xl">
              Built around
              <br />
              real life.
            </h2>

          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[30px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                title:
                  "Thoughtful Design",
                text:
                  "Minimal forms and refined details created for everyday use.",
              },
              {
                title:
                  "Smart Engineering",
                text:
                  "Modern technology designed to perform without unnecessary complexity.",
              },
              {
                title:
                  "Premium Experience",
                text:
                  "Carefully selected materials and considered interactions.",
              },
              {
                title:
                  "Made for Tomorrow",
                text:
                  "Products designed to remain relevant as technology evolves.",
              },
            ].map(
              (item) => (

                <div
                  key={
                    item.title
                  }
                  className="bg-[#080808] p-7"
                >

                  <Check
                    size={19}
                    className="text-[#c9a227]"
                  />

                  <h3 className="mt-6 text-base">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/35">
                    {item.text}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>

      {/* =========================
          CTA
          ========================= */}

      <section className="border-t border-white/10 px-6 py-28 lg:px-8">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#161616] to-[#080808] px-8 py-20 text-center sm:px-16">

          <p className="text-xs tracking-[0.45em] text-[#c9a227]">
            EXPLORE VAELIS
          </p>

          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-medium sm:text-6xl">

            Find technology
            <br />
            that fits your world.

          </h2>

          <a
            href="/products"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-[#c9a227]"
          >
            Explore Collection
            <ChevronRight
              size={16}
            />
          </a>

        </div>

      </section>

      {/* =========================
          FOOTER
          ========================= */}

      <footer className="border-t border-white/10 px-6 py-12">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs text-white/30 sm:flex-row">

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