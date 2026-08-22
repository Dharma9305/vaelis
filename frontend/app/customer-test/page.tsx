"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import API_BASE_URL from "@/lib/api";
import { getCustomerAuthHeader } from "@/lib/customerAuth";

export default function CustomerTestPage() {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [backendResponse, setBackendResponse] =
    useState<any>(null);

  const [error, setError] = useState("");

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);
          setLoading(false);

        }
      );

    return () => unsubscribe();

  }, []);

  async function testBackend() {

    setError("");
    setBackendResponse(null);

    try {

      const authorization =
        await getCustomerAuthHeader();

      if (!authorization) {

        throw new Error(
          "You are not signed in with Firebase."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/auth/customer`,
          {
            method: "GET",

            headers: {
              Authorization: authorization,
              Accept: "application/json",
            },

            cache: "no-store",
          }
        );

      const text =
        await response.text();

      let data: any;

      try {

        data = JSON.parse(text);

      } catch {

        data = text;

      }

      if (!response.ok) {

        throw new Error(
          typeof data === "string"
            ? data
            : data?.error ||
              "Backend authentication failed."
        );
      }

      setBackendResponse(data);

    } catch (error) {

      console.error(
        "Customer backend test failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Backend authentication failed."
      );
    }
  }

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        Loading...
      </main>
    );
  }

  return (

    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">

      <div className="mx-auto max-w-2xl">

        <div className="mb-10">

          <p className="text-3xl font-semibold tracking-[0.3em]">
            VAELIS
          </p>

          <p className="mt-3 text-sm text-white/40">
            Customer Authentication Test
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

          <h1 className="text-2xl font-medium">
            Firebase → Spring Boot
          </h1>

          {!user ? (

            <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">

              No Firebase customer is currently signed in.

              <div className="mt-4">

                <a
                  href="/sign-in"
                  className="text-white underline"
                >
                  Go to Customer Sign In
                </a>

              </div>

            </div>

          ) : (

            <>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">

                <p className="text-sm text-white/40">
                  Firebase User
                </p>

                <p className="mt-2 text-white">
                  {user.displayName ||
                    user.email ||
                    user.phoneNumber ||
                    "Customer"}
                </p>

                {user.email && (

                  <p className="mt-1 text-sm text-white/40">
                    {user.email}
                  </p>

                )}

                {user.phoneNumber && (

                  <p className="mt-1 text-sm text-white/40">
                    {user.phoneNumber}
                  </p>

                )}

              </div>

              <button
                type="button"
                onClick={testBackend}
                className="mt-6 w-full rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90"
              >
                Test Spring Boot Authentication
              </button>

            </>

          )}

          {error && (

            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">

              {error}

            </div>

          )}

          {backendResponse && (

            <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-5">

              <p className="text-sm font-medium text-green-300">
                Backend authentication successful
              </p>

              <pre className="mt-4 overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/70">
                {JSON.stringify(
                  backendResponse,
                  null,
                  2
                )}
              </pre>

            </div>

          )}

        </div>

      </div>

    </main>

  );
}