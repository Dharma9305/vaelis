"use client";
import API_BASE_URL from "@/lib/api";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Search,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Header from "../../components/layout/Header";
type ProductImage = {
  id?: number;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  primaryImage: boolean;
};

type ProductSpecification = {
  label: string;
  value: string;
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
  specifications: ProductSpecification[];
  images: ProductImage[];
};

const categories = [
  "All",
  "Audio",
  "Power",
  "Wearables",
  "Earbuds",
];

export default function ProductsPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [sort, setSort] =
    useState("featured");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {

    async function loadProducts() {

      try {

        setLoading(true);
        setError("");

        const response =
          await fetch(
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

        console.log(
          "VAELIS PRODUCTS:",
          data
        );

        setProducts(
          data.map(
            (product: Product) => ({
              ...product,

              colors:
                product.colors || [],

              features:
                product.features || [],

              specifications:
                product.specifications || [],

              images:
                product.images || [],
            })
          )
        );

      } catch (error) {

        console.error(
          "Products API error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load products."
        );

      } finally {

        setLoading(false);
      }
    }

    loadProducts();

  }, []);

  // =========================
  // FILTER + SORT
  // =========================

  const filteredProducts =
    useMemo(() => {

      let result =
        [...products];

      // CATEGORY

      if (
        selectedCategory !==
        "All"
      ) {

        result =
          result.filter(
            (product) =>
              product.category ===
              selectedCategory
          );
      }

      // SEARCH

      const query =
        search
          .toLowerCase()
          .trim();

      if (query) {

        result =
          result.filter(
            (product) =>

              product.name
                .toLowerCase()
                .includes(query) ||

              product.category
                .toLowerCase()
                .includes(query) ||

              (
                product.shortDescription ||
                ""
              )
                .toLowerCase()
                .includes(query)
          );
      }

      // SORT

      if (
        sort ===
        "price-low"
      ) {

        result.sort(
          (a, b) =>
            a.price -
            b.price
        );
      }

      if (
        sort ===
        "price-high"
      ) {

        result.sort(
          (a, b) =>
            b.price -
            a.price
        );
      }

      if (
        sort ===
        "rating"
      ) {

        result.sort(
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0)
        );
      }

      return result;

    }, [
      products,
      selectedCategory,
      search,
      sort,
    ]);

  // =========================
  // GET PRIMARY IMAGE
  // =========================

  function getProductImage(
    product: Product
  ): string | null {

    const images =
      product.images || [];

    if (
      images.length === 0
    ) {
      return null;
    }

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

  return (

    <main className="min-h-screen bg-[#050505] text-white">

      {/* =========================
          HEADER
          ========================= */}

      <Header />

      {/* =========================
          HERO
          ========================= */}

      <section className="border-b border-white/10 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs tracking-[0.45em] text-[#c9a227]">
            VAELIS COLLECTION
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-medium tracking-[-0.04em] sm:text-7xl">

            Technology,

            <br />

            <span className="text-white/35">
              beautifully refined.
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-white/45">

            Explore the VAELIS collection of premium
            technology designed for modern living.

          </p>

        </div>

      </section>

      {/* =========================
          FILTERS
          ========================= */}

      <section className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          {/* CATEGORIES */}

          <div className="flex gap-2 overflow-x-auto">

            {categories.map(
              (category) => (

                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs transition ${
                    selectedCategory ===
                    category
                      ? "bg-white text-black"
                      : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >

                  {category}

                </button>

              )
            )}

          </div>

          {/* SEARCH + SORT */}

          <div className="flex gap-3">

            <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5">

              <Search
                size={16}
                className="text-white/40"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />

            </div>

            <div className="relative">

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="h-full appearance-none rounded-full border border-white/10 bg-[#0b0b0b] py-2.5 pl-4 pr-9 text-xs text-white/60 outline-none"
              >

                <option value="featured">
                  Featured
                </option>

                <option value="price-low">
                  Price: Low
                </option>

                <option value="price-high">
                  Price: High
                </option>

                <option value="rating">
                  Top Rated
                </option>

              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          PRODUCTS
          ========================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-7xl">

          {/* LOADING */}

          {loading && (

            <div className="py-32 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c9a227]" />

              <p className="mt-5 text-sm text-white/40">
                Loading products...
              </p>

            </div>

          )}

          {/* ERROR */}

          {!loading &&
            error && (

              <div className="rounded-[30px] border border-red-500/20 bg-red-500/5 px-6 py-20 text-center">

                <h2 className="text-xl">
                  Unable to load products
                </h2>

                <p className="mt-3 text-sm text-red-300/70">
                  {error}
                </p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-6 rounded-full bg-white px-6 py-3 text-xs text-black"
                >
                  Retry
                </button>

              </div>

            )}

          {/* PRODUCT COUNT */}

          {!loading &&
            !error && (

              <div className="mb-8 text-sm text-white/35">

                {filteredProducts.length}

                {" "}

                {filteredProducts.length ===
                1
                  ? "product"
                  : "products"}

              </div>

            )}

          {/* NO PRODUCTS */}

          {!loading &&
            !error &&
            filteredProducts.length ===
              0 && (

              <div className="rounded-[30px] border border-white/10 py-32 text-center">

                <h2 className="text-2xl">
                  No products found
                </h2>

                <p className="mt-3 text-sm text-white/40">
                  Try another search or category.
                </p>

              </div>

            )}

          {/* PRODUCT GRID */}

          {!loading &&
            !error &&
            filteredProducts.length >
              0 && (

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {filteredProducts.map(
                  (
                    product,
                    index
                  ) => {

                    const imageUrl =
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
                            0.05,
                        }}
                        className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a]"
                      >

                        {/* =========================
                            PRODUCT IMAGE
                            ========================= */}

                        <a
                          href={`/products/${product.slug}`}
                          className="relative flex h-[390px] items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-950 to-black"
                        >

                          {/* GOLD GLOW */}

                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(201,162,39,0.12),transparent_45%)]" />

                          {/* ACTUAL IMAGE */}

                          {imageUrl ? (

                            <img
                              src={imageUrl}
                              alt={
                                product
                                  .images
                                  ?.find(
                                    (
                                      image
                                    ) =>
                                      image.primaryImage
                                  )
                                  ?.altText ||
                                product.name
                              }
                              className="relative z-10 h-full w-full object-contain p-8 transition duration-700 group-hover:scale-110"
                              onError={() => {

                                console.error(
                                  "IMAGE FAILED:",
                                  imageUrl
                                );

                              }}
                            />

                          ) : (

                            /* FALLBACK */

                            <div className="relative h-48 w-48 rounded-[45px] border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-sm transition duration-700 group-hover:scale-110">

                              <div className="flex h-full items-center justify-center">

                                <span className="text-[10px] tracking-[0.35em] text-white/20">
                                  VAELIS
                                </span>

                              </div>

                            </div>

                          )}

                          {/* BADGE */}

                          {product.badge && (

                            <span className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] tracking-wider text-white/70 backdrop-blur">

                              {product.badge}

                            </span>

                          )}

                          {/* OUT OF STOCK */}

                          {!product.inStock && (

                            <span className="absolute right-6 top-6 z-20 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] tracking-wider text-red-300 backdrop-blur">

                              OUT OF STOCK

                            </span>

                          )}

                        </a>

                        {/* =========================
                            PRODUCT INFORMATION
                            ========================= */}

                        <div className="p-7">

                          <p className="text-[10px] tracking-[0.3em] text-[#c9a227]">

                            {product.category.toUpperCase()}

                          </p>

                          <h2 className="mt-3 text-2xl font-medium">

                            {product.name}

                          </h2>

                          <p className="mt-2 text-sm text-white/40">

                            {
                              product.shortDescription
                            }

                          </p>

                          {/* RATING */}

                          <div className="mt-5 flex items-center gap-2">

                            <div className="flex gap-0.5">

                              {[
                                1,
                                2,
                                3,
                                4,
                                5,
                              ].map(
                                (
                                  star
                                ) => (

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
                                0) > 0 &&
                                ` (${product.reviewCount})`}

                            </span>

                          </div>

                          {/* PRICE */}

                          <div className="mt-6 flex items-center justify-between">

                            <div>

                              <span className="text-lg">

                                ₹
                                {product.price.toLocaleString(
                                  "en-IN"
                                )}

                              </span>

                              {product.originalPrice &&
                                product.originalPrice >
                                  product.price && (

                                  <span className="ml-2 text-xs text-white/25 line-through">

                                    ₹
                                    {product.originalPrice.toLocaleString(
                                      "en-IN"
                                    )}

                                  </span>

                                )}

                            </div>

                            <span className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs text-white/60 transition group-hover:border-[#c9a227] group-hover:text-[#c9a227]">

                              Explore

                              <ArrowRight
                                size={14}
                              />

                            </span>

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