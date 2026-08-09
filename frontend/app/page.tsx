"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";

const products = [
  {
    category: "AUDIO",
    name: "VAELIS Air",
    description: "Immersive sound. Refined.",
    price: "₹2,999",
    gradient: "from-zinc-800 via-zinc-950 to-black",
  },
  {
    category: "POWER",
    name: "VAELIS Charge",
    description: "Power, beautifully engineered.",
    price: "₹1,499",
    gradient: "from-neutral-700 via-neutral-900 to-black",
  },
  {
    category: "WEARABLE",
    name: "VAELIS Watch",
    description: "Intelligence on your wrist.",
    price: "Coming Soon",
    gradient: "from-stone-700 via-zinc-900 to-black",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* NAVIGATION */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <a
            href="#"
            className="text-2xl font-semibold tracking-[0.28em]"
          >
            VAELIS
          </a>

          <nav className="hidden items-center gap-10 text-sm text-white/70 md:flex">
            <a className="transition hover:text-white" href="#products">
              Products
            </a>
            <a className="transition hover:text-white" href="#collections">
              Collections
            </a>
            <a className="transition hover:text-white" href="#story">
              Our Story
            </a>
            <a className="transition hover:text-white" href="#support">
              Support
            </a>
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <button className="text-white/70 transition hover:text-white">
              <Search size={19} />
            </button>

            <button className="text-white/70 transition hover:text-white">
              <ShoppingBag size={19} />
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-black px-6 py-8 md:hidden">
            <nav className="flex flex-col gap-6 text-lg">
              <a href="#products">Products</a>
              <a href="#collections">Collections</a>
              <a href="#story">Our Story</a>
              <a href="#support">Support</a>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.12),transparent_35%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <p className="mb-6 text-xs font-medium tracking-[0.45em] text-[#c9a227]">
              VAELIS INDIA
            </p>

            <h1 className="max-w-3xl text-6xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
              Designed
              <br />
              for Tomorrow.
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-white/55">
              Premium technology crafted for modern living.
              Experience intelligent design, refined performance,
              and a new generation of connected products.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#products"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-[#c9a227]"
              >
                Explore Products
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="#story"
                className="rounded-full border border-white/20 px-7 py-4 text-sm text-white/80 transition hover:border-white/50"
              >
                Discover VAELIS
              </a>
            </div>
          </motion.div>

          {/* PRODUCT CONCEPT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex min-h-[500px] items-center justify-center"
          >
            <div className="absolute h-80 w-80 rounded-full bg-[#c9a227]/10 blur-3xl" />

            <div className="relative h-[390px] w-[250px] rotate-[-8deg] rounded-[55px] border border-white/20 bg-gradient-to-br from-zinc-700 via-zinc-950 to-black p-5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-4 rounded-[43px] border border-white/10" />

              <div className="absolute left-1/2 top-12 h-2 w-20 -translate-x-1/2 rounded-full bg-black shadow-inner" />

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
                <div className="mb-2 text-[10px] tracking-[0.4em] text-[#c9a227]">
                  VAELIS
                </div>

                <div className="text-4xl font-light tracking-tight">
                  AIR
                </div>
              </div>

              <div className="absolute bottom-5 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white/20" />
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="text-xs tracking-[0.35em] text-white/40">
                CONCEPT PRODUCT
              </p>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="animate-bounce text-white/30" size={22} />
        </div>
      </section>

      {/* INTRO */}
      <section className="border-y border-white/10 bg-[#080808] px-6 py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs tracking-[0.4em] text-[#c9a227]">
            THE VAELIS PHILOSOPHY
          </p>

          <h2 className="mt-8 text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            Technology should feel
            <span className="text-white/40"> effortless.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/45">
            We believe great technology should disappear into your
            lifestyle. Beautiful when you see it. Powerful when you
            use it. Simple enough to become part of your everyday life.
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs tracking-[0.4em] text-[#c9a227]">
                EXPLORE
              </p>

              <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-6xl">
                Our Collection
              </h2>
            </div>

            <a
              href="#"
              className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              View all products
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {products.map((product, index) => (
              <motion.article
                key={product.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b]"
              >
                <div
                  className={`relative flex h-[420px] items-center justify-center overflow-hidden bg-gradient-to-br ${product.gradient}`}
                >
                  <div className="h-44 w-44 rounded-[45px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm transition duration-700 group-hover:scale-105" />

                  <div className="absolute left-6 top-6 text-[10px] tracking-[0.3em] text-white/40">
                    {product.category}
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-medium">{product.name}</h3>

                  <p className="mt-2 text-sm text-white/45">
                    {product.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-white/70">
                      {product.price}
                    </span>

                    <button className="rounded-full border border-white/15 px-5 py-2 text-xs transition hover:border-[#c9a227] hover:text-[#c9a227]">
                      Explore
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section
        id="story"
        className="relative overflow-hidden border-y border-white/10 bg-[#080808] px-6 py-36"
      >
        <div className="absolute right-[-10%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#c9a227]/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs tracking-[0.4em] text-[#c9a227]">
            BORN IN INDIA
          </p>

          <h2 className="mt-8 text-4xl font-medium leading-tight sm:text-6xl">
            Crafted with purpose.
            <br />
            <span className="text-white/35">Built for the future.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/45">
            VAELIS is an Indian technology brand created with a simple
            ambition: bring sophisticated design and meaningful
            innovation into everyday life.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-white/10 bg-gradient-to-br from-[#171717] to-[#080808] px-8 py-24 text-center">
          <p className="text-xs tracking-[0.4em] text-[#c9a227]">
            VAELIS
          </p>

          <h2 className="mt-6 text-5xl font-medium tracking-tight sm:text-7xl">
            Designed for Tomorrow.
          </h2>

          <button className="mt-10 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c9a227]">
            Explore VAELIS
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="support"
        className="border-t border-white/10 px-6 py-16"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
          <div>
            <div className="text-xl font-semibold tracking-[0.25em]">
              VAELIS
            </div>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/40">
              Premium technology designed for modern living.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Products</h4>
            <div className="mt-5 space-y-3 text-sm text-white/40">
              <p>Audio</p>
              <p>Wearables</p>
              <p>Power</p>
              <p>Smart Home</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Support</h4>
            <div className="mt-5 space-y-3 text-sm text-white/40">
              <p>Contact Us</p>
              <p>Warranty</p>
              <p>Track Order</p>
              <p>Service Center</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Company</h4>
            <div className="mt-5 space-y-3 text-sm text-white/40">
              <p>About VAELIS</p>
              <p>Careers</p>
              <p>Become a Dealer</p>
              <p>Privacy</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-8 text-xs text-white/30">
          © {new Date().getFullYear()} VAELIS India. All rights reserved.
        </div>
      </footer>
    </main>
  );
}