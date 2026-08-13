"use client";
import API_BASE_URL from "@/lib/api";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const credentials =
        btoa(`${username}:${password}`);

      const response = await fetch(
       `${API_BASE_URL}/api/admin/orders`,
        {
          method: "GET",

          headers: {
            Authorization: `Basic ${credentials}`,
          },

          cache: "no-store",
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Invalid username or password."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Unable to login."
        );
      }

      // Save authentication for admin pages
      localStorage.setItem(
        "vaelis_admin_auth",
        credentials
      );

      router.push("/admin/orders");

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="mb-10 text-center">

          <p className="text-2xl font-semibold tracking-[0.3em]">
            VAELIS
          </p>

          <p className="mt-3 text-sm text-white/40">
            ADMIN PANEL
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

          <h1 className="text-2xl font-medium">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Sign in to manage VAELIS orders.
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            {/* USERNAME */}

            <div>

              <label className="mb-2 block text-sm text-white/60">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-white/20 focus:border-white/30"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm text-white/60">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-white/20 focus:border-white/30"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

        </div>

        <p className="mt-6 text-center text-xs text-white/20">
          VAELIS Administration
        </p>

      </div>

    </main>
  );
}