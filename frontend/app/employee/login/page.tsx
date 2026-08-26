"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  setEmployeeCredentials,
} from "@/lib/employeeAuth";

import API_BASE_URL from "@/lib/api";

export default function EmployeeLoginPage() {

  const router =
    useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setLoading(true);
    setError("");

    try {

      // =====================================================
      // BASIC AUTH CREDENTIALS
      // =====================================================

      const credentials =
        btoa(
          `${username.trim()}:${password}`
        );

      const authHeader =
        `Basic ${credentials}`;

      // =====================================================
      // VERIFY EMPLOYEE AUTHENTICATION
      // =====================================================
      //
      // Employee authentication is handled directly by:
      //
      // GET /api/employee/me
      //
      // Do NOT call /api/admin/me here.
      //
      // =====================================================

      const response =
        await fetch(
          `${API_BASE_URL}/api/employee/me`,
          {
            method: "GET",

            headers: {
              Authorization:
                authHeader,

              Accept:
                "application/json",
            },

            cache:
              "no-store",
          }
        );

      // =====================================================
      // INVALID CREDENTIALS
      // =====================================================

      if (
        response.status ===
        401
      ) {

        throw new Error(
          "Invalid username or password."
        );
      }

      // =====================================================
      // NOT AUTHORIZED
      // =====================================================

      if (
        response.status ===
        403
      ) {

        let message =
          "This account is not authorized for employee access.";

        try {

          const data =
            await response.json();

          if (
            data?.error &&
            typeof data.error ===
              "string"
          ) {

            message =
              data.error;
          }

        } catch {
          // Keep default message.
        }

        throw new Error(
          message
        );
      }

      // =====================================================
      // EMPLOYEE PROFILE NOT FOUND
      // =====================================================

      if (
        response.status ===
        404
      ) {

        let message =
          "Employee profile has not been created yet.";

        try {

          const data =
            await response.json();

          if (
            data?.error &&
            typeof data.error ===
              "string"
          ) {

            message =
              data.error;
          }

        } catch {
          // Keep default message.
        }

        throw new Error(
          message
        );
      }

      // =====================================================
      // OTHER SERVER ERROR
      // =====================================================

      if (
        !response.ok
      ) {

        let message =
          "Unable to login.";

        try {

          const data =
            await response.json();

          if (
            data?.error &&
            typeof data.error ===
              "string"
          ) {

            message =
              data.error;

          } else if (
            data?.message &&
            typeof data.message ===
              "string"
          ) {

            message =
              data.message;
          }

        } catch {

          try {

            const text =
              await response.text();

            if (text) {
              message =
                text;
            }

          } catch {
            // Keep default message.
          }
        }

        throw new Error(
          message
        );
      }

      // =====================================================
      // LOAD EMPLOYEE PROFILE
      // =====================================================

      const profile =
        await response.json();

      // =====================================================
      // FINAL EMPLOYEE VALIDATION
      // =====================================================

      if (
        profile?.role !==
        "EMPLOYEE"
      ) {

        throw new Error(
          "This login is only for VAELIS employees."
        );
      }

      if (
        !profile?.employeeId
      ) {

        throw new Error(
          "Employee profile is not available."
        );
      }

      // =====================================================
      // SAVE EMPLOYEE AUTHENTICATION
      // =====================================================

      setEmployeeCredentials(
        credentials
      );

      // =====================================================
      // REDIRECT TO EMPLOYEE DASHBOARD
      // =====================================================

      router.replace(
        "/employee"
      );

    } catch (error) {

      console.error(
        "Employee login error:",
        error
      );

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

        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="mb-10 text-center">

          <p className="text-2xl font-semibold tracking-[0.3em]">
            VAELIS
          </p>

          <p className="mt-3 text-sm text-white/40">
            EMPLOYEE PORTAL
          </p>

        </div>

        {/* ===================================================
            LOGIN CARD
        =================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

          <h1 className="text-2xl font-medium">
            Employee Login
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Sign in to access your VAELIS employee portal.
          </p>

          <form
            onSubmit={
              handleLogin
            }
            className="mt-8 space-y-5"
          >

            {/* =================================================
                USERNAME
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm text-white/60">
                Username
              </label>

              <input
                type="text"
                value={
                  username
                }
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                placeholder="Enter username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                disabled={
                  loading
                }
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              />

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm text-white/60">
                Password
              </label>

              <input
                type="password"
                value={
                  password
                }
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter password"
                autoComplete="current-password"
                required
                disabled={
                  loading
                }
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              />

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
              >
                {error}
              </div>
            )}

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={
                loading ||
                !username.trim() ||
                !password
              }
              className="w-full rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

        </div>

        <p className="mt-6 text-center text-xs text-white/20">
          VAELIS Employee Portal
        </p>

      </div>

    </main>
  );
}