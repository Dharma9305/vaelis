"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "@/lib/firebase";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

type AuthMode =
  | "PHONE"
  | "OTP";

export default function CustomerSignInPage() {

  const router =
    useRouter();

  const [mode, setMode] =
    useState<AuthMode>("PHONE");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [resendSeconds, setResendSeconds] =
    useState(0);

  const recaptchaVerifier =
    useRef<RecaptchaVerifier | null>(null);

  const recaptchaContainerId =
    "vaelis-recaptcha-container";

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {

    return () => {

      if (
        recaptchaVerifier.current
      ) {

        recaptchaVerifier.current.clear();

        recaptchaVerifier.current =
          null;
      }

    };

  }, []);

  // =========================================================
  // RESEND TIMER
  // =========================================================

  useEffect(() => {

    if (resendSeconds <= 0) {
      return;
    }

    const timer =
      window.setInterval(() => {

        setResendSeconds(
          (seconds) =>
            seconds > 0
              ? seconds - 1
              : 0
        );

      }, 1000);

    return () =>
      window.clearInterval(timer);

  }, [resendSeconds]);

  // =========================================================
  // NORMALIZE PHONE
  // =========================================================

  function getPhoneNumber(): string {

    const digits =
      phoneNumber.replace(
        /\D/g,
        ""
      );

    return `+91${digits}`;
  }

  // =========================================================
  // VALIDATE PHONE
  // =========================================================

  function isValidPhone(): boolean {

    const digits =
      phoneNumber.replace(
        /\D/g,
        ""
      );

    return (
      digits.length === 10 &&
      /^[6-9]\d{9}$/.test(
        digits
      )
    );
  }

  // =========================================================
  // CREATE RECAPTCHA
  // =========================================================

  function createRecaptcha(): RecaptchaVerifier {

    if (
      recaptchaVerifier.current
    ) {

      return recaptchaVerifier.current;
    }

    const verifier =
      new RecaptchaVerifier(
        auth,
        recaptchaContainerId,
        {
          size: "invisible",

          callback: () => {
            // reCAPTCHA completed
          },

          "expired-callback": () => {

            setError(
              "Security verification expired. Please try again."
            );

          },
        }
      );

    recaptchaVerifier.current =
      verifier;

    return verifier;
  }

  // =========================================================
  // GOOGLE SIGN IN
  // =========================================================

  async function handleGoogleSignIn() {

    try {

      setGoogleLoading(true);

      setError("");
      setSuccess("");

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      const user =
        result.user;

      setSuccess(
        `Welcome, ${
          user.displayName ||
          user.email ||
          "Customer"
        }`
      );

      /*
       * Backend Firebase token verification
       * will be connected in the next phase.
       */

      router.push("/");

    } catch (error: any) {

      console.error(
        "Google sign-in failed:",
        error
      );

      if (
        error?.code ===
        "auth/popup-closed-by-user"
      ) {

        setError(
          "Google sign-in was cancelled."
        );

      } else if (
        error?.code ===
        "auth/popup-blocked"
      ) {

        setError(
          "Your browser blocked the Google sign-in popup. Please allow popups for VAELIS."
        );

      } else {

        setError(
          error?.message ||
          "Unable to sign in with Google."
        );

      }

    } finally {

      setGoogleLoading(false);

    }
  }

  // =========================================================
  // SEND OTP
  // =========================================================

  async function handleSendOtp(
    event?: FormEvent
  ) {

    event?.preventDefault();

    if (!isValidPhone()) {

      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return;
    }

    try {

      setLoading(true);

      setError("");
      setSuccess("");

      const verifier =
        createRecaptcha();

      const formattedPhone =
        getPhoneNumber();

      const result =
        await signInWithPhoneNumber(
          auth,
          formattedPhone,
          verifier
        );

      setConfirmationResult(
        result
      );

      setMode("OTP");

      setOtp("");

      setResendSeconds(30);

      setSuccess(
        `OTP sent to ${formattedPhone}`
      );

    } catch (error: any) {

      console.error(
        "OTP send failed:",
        error
      );

      if (
        recaptchaVerifier.current
      ) {

        try {

          recaptchaVerifier.current.clear();

        } catch {
          // Ignore cleanup errors
        }

        recaptchaVerifier.current =
          null;
      }

      switch (
        error?.code
      ) {

        case "auth/invalid-phone-number":

          setError(
            "The mobile number is invalid."
          );

          break;

        case "auth/too-many-requests":

          setError(
            "Too many attempts. Please wait and try again later."
          );

          break;

        case "auth/quota-exceeded":

          setError(
            "SMS quota has been exceeded for this Firebase project."
          );

          break;

        case "auth/captcha-check-failed":

          setError(
            "Security verification failed. Please try again."
          );

          break;

        default:

          setError(
            error?.message ||
            "Unable to send OTP."
          );
      }

    } finally {

      setLoading(false);

    }
  }

  // =========================================================
  // VERIFY OTP
  // =========================================================

  async function handleVerifyOtp(
    event: FormEvent
  ) {

    event.preventDefault();

    if (
      !confirmationResult
    ) {

      setError(
        "Your OTP session has expired. Please request a new OTP."
      );

      return;
    }

    if (
      !/^\d{6}$/.test(
        otp
      )
    ) {

      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    try {

      setLoading(true);

      setError("");
      setSuccess("");

      const result =
        await confirmationResult.confirm(
          otp
        );

      const user =
        result.user;

      setSuccess(
        `Welcome, ${
          user.phoneNumber ||
          "Customer"
        }`
      );

      /*
       * Backend Firebase token verification
       * will be connected in the next phase.
       */

      router.push("/");

    } catch (error: any) {

      console.error(
        "OTP verification failed:",
        error
      );

      switch (
        error?.code
      ) {

        case "auth/invalid-verification-code":

          setError(
            "Incorrect OTP. Please check the code and try again."
          );

          break;

        case "auth/code-expired":

          setError(
            "This OTP has expired. Please request a new OTP."
          );

          break;

        default:

          setError(
            error?.message ||
            "Unable to verify OTP."
          );
      }

    } finally {

      setLoading(false);

    }
  }

  // =========================================================
  // RESEND OTP
  // =========================================================

  async function handleResendOtp() {

    if (
      resendSeconds > 0 ||
      !isValidPhone()
    ) {

      return;
    }

    try {

      setResendLoading(true);

      setError("");
      setSuccess("");

      if (
        recaptchaVerifier.current
      ) {

        try {

          recaptchaVerifier.current.clear();

        } catch {
          // Ignore cleanup errors
        }

        recaptchaVerifier.current =
          null;
      }

      const verifier =
        createRecaptcha();

      const result =
        await signInWithPhoneNumber(
          auth,
          getPhoneNumber(),
          verifier
        );

      setConfirmationResult(
        result
      );

      setOtp("");

      setResendSeconds(30);

      setSuccess(
        "A new OTP has been sent."
      );

    } catch (error: any) {

      console.error(
        "Resend OTP failed:",
        error
      );

      setError(
        error?.message ||
        "Unable to resend OTP."
      );

    } finally {

      setResendLoading(false);

    }
  }

  // =========================================================
  // CHANGE NUMBER
  // =========================================================

  function handleChangeNumber() {

    setMode("PHONE");

    setOtp("");

    setConfirmationResult(
      null
    );

    setError("");

    setSuccess("");

    setResendSeconds(0);

    if (
      recaptchaVerifier.current
    ) {

      try {

        recaptchaVerifier.current.clear();

      } catch {
        // Ignore cleanup errors
      }

      recaptchaVerifier.current =
        null;
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async function handleLogout() {

    try {

      await signOut(auth);

      setMode("PHONE");

      setConfirmationResult(
        null
      );

      setOtp("");

      setSuccess(
        "You have been signed out."
      );

    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );

      setError(
        "Unable to sign out."
      );

    }
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (

    <main className="min-h-screen bg-[#050505] text-white">

      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6 py-12">

        <div className="w-full">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="mb-10 text-center">

            <p className="text-3xl font-semibold tracking-[0.35em]">
              VAELIS
            </p>

            <p className="mt-3 text-sm text-white/35">
              Luxury. Simplicity. Yours.
            </p>

          </div>


          {/* =================================================
              CARD
          ================================================= */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">

            {/* =================================================
                PHONE
            ================================================= */}

            {mode === "PHONE" && (

              <>

                <div>

                  <h1 className="text-2xl font-medium">
                    Welcome back
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Sign in to your VAELIS account.
                  </p>

                </div>


                {/* GOOGLE */}

                <button
                  type="button"
                  onClick={
                    handleGoogleSignIn
                  }
                  disabled={
                    googleLoading ||
                    loading
                  }
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {googleLoading ? (

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                  ) : (

                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-sm font-bold">
                      G
                    </span>

                  )}

                  {googleLoading
                    ? "Signing in..."
                    : "Continue with Google"}

                </button>


                {/* DIVIDER */}

                <div className="my-7 flex items-center gap-4">

                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-xs uppercase tracking-widest text-white/20">
                    or
                  </span>

                  <div className="h-px flex-1 bg-white/10" />

                </div>


                {/* PHONE FORM */}

                <form
                  onSubmit={
                    handleSendOtp
                  }
                  className="space-y-5"
                >

                  <div>

                    <label className="mb-2 block text-sm text-white/60">
                      Mobile Number
                    </label>

                    <div className="flex overflow-hidden rounded-xl border border-white/10 bg-black focus-within:border-white/30">

                      <div className="flex items-center border-r border-white/10 px-4 text-sm text-white/50">
                        +91
                      </div>

                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(event) => {

                          const digits =
                            event.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                10
                              );

                          setPhoneNumber(
                            digits
                          );

                          setError("");
                        }}
                        placeholder="Enter mobile number"
                        className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/20"
                      />

                    </div>

                    <p className="mt-2 text-xs text-white/20">
                      We'll send a one-time verification code.
                    </p>

                  </div>


                  {/* ERROR */}

                  {error && (

                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">
                      {error}
                    </div>

                  )}


                  {/* SUCCESS */}

                  {success && (

                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm leading-5 text-green-300">
                      {success}
                    </div>

                  )}


                  <button
                    type="submit"
                    disabled={
                      loading ||
                      googleLoading ||
                      !isValidPhone()
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    {loading && (

                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                    )}

                    {loading
                      ? "Sending OTP..."
                      : "Send OTP"}

                  </button>

                </form>

              </>

            )}


            {/* =================================================
                OTP
            ================================================= */}

            {mode === "OTP" && (

              <>

                <button
                  type="button"
                  onClick={
                    handleChangeNumber
                  }
                  className="mb-7 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
                >

                  <ArrowLeft
                    size={16}
                  />

                  Change number

                </button>


                <div>

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                    <ShieldCheck
                      size={22}
                      className="text-white/70"
                    />
                  </div>

                  <h1 className="text-2xl font-medium">
                    Verify your number
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-white/40">

                    Enter the 6-digit OTP sent to{" "}

                    <span className="text-white/70">
                      +91{" "}
                      {phoneNumber}
                    </span>

                  </p>

                </div>


                <form
                  onSubmit={
                    handleVerifyOtp
                  }
                  className="mt-8 space-y-5"
                >

                  <div>

                    <label className="mb-2 block text-sm text-white/60">
                      Verification Code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => {

                        const digits =
                          event.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(
                              0,
                              6
                            );

                        setOtp(
                          digits
                        );

                        setError("");
                      }}
                      placeholder="Enter 6-digit OTP"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-center text-2xl tracking-[0.5em] text-white outline-none placeholder:text-white/20 focus:border-white/30"
                    />

                  </div>


                  {/* ERROR */}

                  {error && (

                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">
                      {error}
                    </div>

                  )}


                  {/* SUCCESS */}

                  {success && (

                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm leading-5 text-green-300">
                      {success}
                    </div>

                  )}


                  <button
                    type="submit"
                    disabled={
                      loading ||
                      otp.length !== 6
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    {loading && (

                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                    )}

                    {loading
                      ? "Verifying..."
                      : "Verify & Continue"}

                  </button>


                  {/* RESEND */}

                  <div className="text-center">

                    {resendSeconds > 0 ? (

                      <p className="text-xs text-white/30">
                        Resend OTP in{" "}
                        <span className="text-white/60">
                          {resendSeconds}s
                        </span>
                      </p>

                    ) : (

                      <button
                        type="button"
                        onClick={
                          handleResendOtp
                        }
                        disabled={
                          resendLoading
                        }
                        className="inline-flex items-center gap-2 text-xs text-white/50 transition hover:text-white disabled:opacity-40"
                      >

                        {resendLoading && (

                          <RefreshCw
                            size={13}
                            className="animate-spin"
                          />

                        )}

                        Resend OTP

                      </button>

                    )}

                  </div>

                </form>

              </>

            )}

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-6 text-center">

            <div className="flex items-center justify-center gap-2 text-xs text-white/20">

              <ShieldCheck
                size={14}
              />

              Secure authentication powered by Firebase

            </div>

            <p className="mt-3 text-xs text-white/15">
              By continuing, you agree to VAELIS terms and privacy policy.
            </p>

          </div>


          {/* =================================================
              DEVELOPMENT LOGOUT
          ================================================= */}

          {auth.currentUser && (

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="mx-auto mt-6 flex items-center gap-2 text-xs text-white/20 transition hover:text-white/50"
            >

              <LogOut
                size={13}
              />

              Sign out current account

            </button>

          )}

          {/* =================================================
              INVISIBLE RECAPTCHA
          ================================================= */}

          <div
            id={
              recaptchaContainerId
            }
          />

        </div>

      </div>

    </main>

  );
}