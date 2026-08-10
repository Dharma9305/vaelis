"use client";

import {
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "../cart/CartProvider";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-[0.28em]"
        >
          VAELIS
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-10 text-sm text-white/60 md:flex">
          <Link
            href="/"
            className="transition hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="transition hover:text-white"
          >
            Products
          </Link>

          <Link
            href="/#story"
            className="transition hover:text-white"
          >
            Our Story
          </Link>

          <Link
            href="/#support"
            className="transition hover:text-white"
          >
            Support
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-5 md:flex">
          <button
            className="text-white/60 transition hover:text-white"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          <Link
            href="/cart"
            className="relative text-white/60 transition hover:text-white"
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <ShoppingBag size={20} />

            {itemCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c9a227] px-1 text-[10px] font-semibold text-black">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-6 py-7 md:hidden">
          <nav className="flex flex-col gap-6">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-lg text-white/80"
            >
              Home
            </Link>

            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="text-lg text-white/80"
            >
              Products
            </Link>

            <Link
              href="/#story"
              onClick={() => setMenuOpen(false)}
              className="text-lg text-white/80"
            >
              Our Story
            </Link>

            <Link
              href="/#support"
              onClick={() => setMenuOpen(false)}
              className="text-lg text-white/80"
            >
              Support
            </Link>

            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-lg text-white/80"
            >
              <ShoppingBag size={20} />

              Bag

              {itemCount > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#c9a227] px-1 text-xs font-semibold text-black">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}