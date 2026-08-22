"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api";
import { auth } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type RetryPaymentButtonProps = {
  orderId: number;
  disabled?: boolean;
  onSuccess?: (result: any) => void;
  onError?: (message: string) => void;
};

export default function RetryPaymentButton({
  orderId,
  disabled = false,
  onSuccess,
  onError,
}: RetryPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
  // LOAD RAZORPAY
  // =========================================================

  useEffect(() => {
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      )
    ) {
      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);
  }, []);

  // =========================================================
  // RETRY PAYMENT
  // =========================================================

  async function retryPayment() {
    if (loading || disabled) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // =======================================================
      // FIREBASE CUSTOMER AUTHENTICATION
      // =======================================================

      const firebaseUser =
        auth.currentUser;

      if (!firebaseUser) {
        throw new Error(
          "Please sign in before retrying payment.",
        );
      }

      // Get a fresh Firebase ID token
      const token =
        await firebaseUser.getIdToken();

      // -------------------------------------------------------
      // CHECK RAZORPAY
      // -------------------------------------------------------

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is still loading. Please try again.",
        );
      }

      const keyId =
        process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error(
          "Razorpay Key ID is not configured.",
        );
      }

      // -------------------------------------------------------
      // CREATE RAZORPAY ORDER
      // -------------------------------------------------------

      const razorpayResponse =
        await fetch(
          `${API_BASE_URL}/api/payments/create/${orderId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      if (!razorpayResponse.ok) {
        const responseMessage =
          await razorpayResponse.text();

        throw new Error(
          responseMessage ||
            "Unable to create Razorpay order.",
        );
      }

      const razorpayOrder =
        await razorpayResponse.json();

      // -------------------------------------------------------
      // RAZORPAY OPTIONS
      // -------------------------------------------------------

      const options = {
        key: keyId,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        name: "VAELIS",

        description:
          "VAELIS Order #" +
          orderId,

        // IMPORTANT:
        // Razorpay expects order_id, not order.
        order_id:
          razorpayOrder.razorpayOrderId,

        notes: {
          vaelisOrderId:
            String(orderId),
        },

        theme: {
          color: "#c9a227",
        },

        modal: {
          confirm_close: true,
          escape: false,
          backdropclose: false,
        },

        // =====================================================
        // SUCCESS HANDLER
        // =====================================================

        handler:
          async function (
            response: any,
          ) {
            try {
              setLoading(true);
              setMessage("");

              // ------------------------------------------------
              // READ RAZORPAY RESPONSE
              // ------------------------------------------------

              const razorpayOrderId =
                response?.razorpay_order_id;

              const razorpayPaymentId =
                response?.razorpay_payment_id;

              const razorpaySignature =
                response?.razorpay_signature;

              // ------------------------------------------------
              // VALIDATE BEFORE CALLING BACKEND
              // ------------------------------------------------

              if (
                !razorpayOrderId ||
                !razorpayPaymentId ||
                !razorpaySignature
              ) {
                console.error(
                  "Invalid Razorpay success response:",
                  response,
                );

                throw new Error(
                  "Razorpay did not return complete payment details.",
                );
              }

              // ------------------------------------------------
              // VERIFY PAYMENT
              // ------------------------------------------------

              const verifyResponse =
                await fetch(
                  `${API_BASE_URL}/api/payments/verify`,
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      Authorization:
                        `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                      vaelisOrderId:
                        orderId,

                      razorpayOrderId:
                        razorpayOrderId,

                      razorpayPaymentId:
                        razorpayPaymentId,

                      razorpaySignature:
                        razorpaySignature,
                    }),
                  },
                );

              if (!verifyResponse.ok) {
                const responseMessage =
                  await verifyResponse.text();

                throw new Error(
                  responseMessage ||
                    "Payment verification failed.",
                );
              }

              const verification =
                await verifyResponse.json();

              if (
                verification.success !==
                true
              ) {
                throw new Error(
                  "Payment verification failed.",
                );
              }

              // ------------------------------------------------
              // SUCCESS
              // ------------------------------------------------

              setMessage(
                "Payment successful.",
              );

              if (onSuccess) {
                onSuccess(
                  verification,
                );
              }

            } catch (error) {
              console.error(
                "Payment verification error:",
                error,
              );

              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Payment verification failed.";

              setMessage(
                errorMessage,
              );

              if (onError) {
                onError(
                  errorMessage,
                );
              }

            } finally {
              setLoading(false);
            }
          },
      };

      // =======================================================
      // CREATE RAZORPAY INSTANCE
      // =======================================================

      const razorpay =
        new window.Razorpay(
          options,
        );

      // =======================================================
      // PAYMENT FAILED
      // =======================================================

      razorpay.on(
        "payment.failed",
        function (
          response: any,
        ) {
          console.error(
            "Razorpay payment failed:",
            response,
          );

          const errorMessage =
            response?.error
              ?.description ||
            "Payment failed. Please try again.";

          setMessage(
            errorMessage,
          );

          setLoading(false);

          if (onError) {
            onError(
              errorMessage,
            );
          }
        },
      );

      // =======================================================
      // OPEN CHECKOUT
      // =======================================================

      razorpay.open();

    } catch (error) {
      console.error(
        "Razorpay retry checkout error:",
        error,
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to start payment.";

      setMessage(
        errorMessage,
      );

      setLoading(false);

      if (onError) {
        onError(
          errorMessage,
        );
      }
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>
      <button
        type="button"
        onClick={retryPayment}
        disabled={
          loading || disabled
        }
        className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : "Retry Payment"}
      </button>

      {message && (
        <p className="mt-3 text-xs text-white/50">
          {message}
        </p>
      )}
    </div>
  );
}