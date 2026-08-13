"use client";

import API_BASE_URL from "@/lib/api";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "../../components/layout/Header";
import { indiaLocations } from "../../data/indiaLocations";
import { useCart } from "../../components/cart/CartProvider";
import { getIndiaPincode } from "india-pincode/browser";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type LocationDistrict = {
  state: string;
  district: string;
  cities: string[];
};

const indiaDistricts: LocationDistrict[] =
  indiaLocations.flatMap((stateItem) =>
    stateItem.districts.map((districtItem) => ({
      state: stateItem.name,
      district: districtItem.name,
      cities: districtItem.cities,
    }))
  );

type CityLocation = {
  city: string;
  state: string;
  district: string;
};

const indiaCityLocations: CityLocation[] =
  indiaDistricts.flatMap((districtItem) =>
    districtItem.cities.map((cityName) => ({
      city: cityName,
      state: districtItem.state,
      district: districtItem.district,
    }))
  );

const cityOptions = Array.from(
  new Set(
    indiaCityLocations.map(
      (item) => item.city
    )
  )
).sort((a, b) =>
  a.localeCompare(b)
);


export default function CheckoutPage() {
  const router = useRouter();

  const {
    items,
    subtotal,
    clearCart,
  } = useCart();

  const deliveryCharge =
    subtotal >= 2000 || subtotal === 0 ? 0 : 99;

  const total = subtotal + deliveryCharge;

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");

  const [isOtherLocation, setIsOtherLocation] =
    useState(false);

  const [pincode, setPincode] = useState("");

  const [pincodeLoading, setPincodeLoading] =
    useState(false);

  const [pincodeError, setPincodeError] =
    useState("");

  const [pincodeReady, setPincodeReady] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [orderId, setOrderId] =
    useState<number | null>(null);

  const [confirmedOrder, setConfirmedOrder] =
    useState<any>(null);

  // ---------------------------------------------------------
  // CITY -> DISTRICT -> STATE
  // ---------------------------------------------------------

  const districtsForSelectedCity =
    city
      ? Array.from(
          new Map(
            indiaCityLocations
              .filter(
                (item) =>
                  item.city === city
              )
              .map((item) => [
                `${item.state}|||${item.district}`,
                {
                  district:
                    item.district,
                  state:
                    item.state,
                },
              ])
          ).values()
        ).sort((a, b) =>
          a.district.localeCompare(
            b.district
          )
        )
      : [];

  const statesForSelectedCity =
    city
      ? Array.from(
          new Set(
            indiaCityLocations
              .filter(
                (item) =>
                  item.city === city
              )
              .map(
                (item) => item.state
              )
          )
        )
      : [];

  function handleCityChange(
    selectedCity: string
  ) {
    if (selectedCity === "Other") {
      setCity("");
      setDistrict("");
      setState("");
      setIsOtherLocation(true);
      setPincodeError("");
      setPincodeReady(false);
      return;
    }

    const locations =
      indiaCityLocations.filter(
        (item) =>
          item.city === selectedCity
      );

    setCity(selectedCity);
    setDistrict("");
    setIsOtherLocation(false);
    setPincodeError("");
    setPincodeReady(false);

    // If this city exists in only one state,
    // state can be filled immediately.
    const states = Array.from(
      new Set(
        locations.map(
          (item) => item.state
        )
      )
    );

    if (states.length === 1) {
      setState(states[0]);
    } else {
      setState("");
    }

    // If the city has only one district,
    // select it automatically. Otherwise
    // let the customer choose from the
    // filtered district list.
    const districts = Array.from(
      new Map(
        locations.map((item) => [
          `${item.state}|||${item.district}`,
          item.district,
        ])
      ).values()
    );

    if (
      districts.length === 1 &&
      states.length === 1
    ) {
      setDistrict(districts[0]);
    }
  }

  function handleDistrictChange(
    selectedDistrictValue: string
  ) {
    if (
      selectedDistrictValue ===
      "Other"
    ) {
      setDistrict("");
      setState("");
      setIsOtherLocation(true);
      setPincodeError("");
      setPincodeReady(false);
      return;
    }

    const separator = "|||";
    const [
      selectedState,
      selectedDistrict,
    ] =
      selectedDistrictValue.split(
        separator
      );

    setDistrict(
      selectedDistrict || ""
    );
    setState(
      selectedState || ""
    );
    setIsOtherLocation(false);
    setPincodeError("");
    setPincodeReady(false);
  }

  // ---------------------------------------------------------
  // LOAD RAZORPAY CHECKOUT SCRIPT
  // ---------------------------------------------------------

  useEffect(() => {
    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      console.log(
        "Razorpay Checkout loaded"
      );
    };

    script.onerror = () => {
      console.error(
        "Unable to load Razorpay Checkout"
      );
    };

    document.body.appendChild(script);
  }, []);

  // ---------------------------------------------------------
  // LOAD CONFIRMED VAELIS ORDER
  // ---------------------------------------------------------

  useEffect(() => {
    if (!orderId) return;

    async function loadOrder() {
      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/orders/${orderId}`
          );

        if (!response.ok) {
          throw new Error(
            "Unable to load order details."
          );
        }

        const data =
          await response.json();

        setConfirmedOrder(data);

      } catch (error) {
        console.error(error);
      }
    }

    loadOrder();
  }, [orderId]);

  // ---------------------------------------------------------
  // PINCODE VALIDATION
  // ---------------------------------------------------------

  useEffect(() => {
    if (pincode.length !== 6) {
      setPincodeReady(false);
      setPincodeError("");
      setPincodeLoading(false);
      return;
    }

    const normalizedPincode =
      pincode.replace(/\D/g, "");

    if (
      !/^[1-9][0-9]{5}$/.test(
        normalizedPincode
      )
    ) {
      setPincodeReady(false);
      setPincodeError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    // For manually entered "Other" locations,
    // only enforce valid 6-digit Indian PIN format.
    if (isOtherLocation) {
      setPincodeReady(true);
      setPincodeError("");
      setPincodeLoading(false);
      return;
    }

    let cancelled = false;

    async function lookupPincode() {
      try {
        setPincodeLoading(true);
        setPincodeError("");
        setPincodeReady(false);

        const pin =
          await getIndiaPincode();

        const result =
          pin.getPincodeSummary(
            normalizedPincode
          );

        if (cancelled) return;

        if (!result.success) {
          setPincodeError(
            "Invalid or unavailable Indian pincode."
          );
          return;
        }

        const data = result.data;

        const normalize = (
          value: string
        ) =>
          value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

        const selectedStateName =
          normalize(state);

        const selectedDistrictName =
          normalize(district);

        const returnedState =
          normalize(data.state);

        const returnedDistrict =
          normalize(data.district);

        if (
          selectedStateName &&
          returnedState !==
            selectedStateName &&
          !returnedState.includes(
            selectedStateName
          ) &&
          !selectedStateName.includes(
            returnedState
          )
        ) {
          setPincodeError(
            `Pincode ${normalizedPincode} does not belong to ${state}.`
          );
          return;
        }

        if (
          selectedDistrictName &&
          returnedDistrict !==
            selectedDistrictName &&
          !returnedDistrict.includes(
            selectedDistrictName
          ) &&
          !selectedDistrictName.includes(
            returnedDistrict
          )
        ) {
          setPincodeError(
            `Pincode ${normalizedPincode} does not belong to ${district}.`
          );
          return;
        }

        setPincodeReady(true);

      } catch (error) {
        console.error(
          "Pincode lookup failed:",
          error
        );

        if (!cancelled) {
          setPincodeError(
            "Unable to verify pincode. Please try again."
          );
        }

      } finally {
        if (!cancelled) {
          setPincodeLoading(false);
        }
      }
    }

    lookupPincode();

    return () => {
      cancelled = true;
    };

  }, [
    pincode,
    state,
    district,
    city,
    isOtherLocation,
  ]);

  // ---------------------------------------------------------
  // OPEN RAZORPAY CHECKOUT
  // ---------------------------------------------------------

  async function openRazorpayCheckout(
    vaelisOrderId: number
  ) {
    try {
      setError("");

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is still loading. Please try again."
        );
      }

      const keyId =
        process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error(
          "Razorpay Key ID is not configured."
        );
      }

      const razorpayResponse =
        await fetch(
          `${API_BASE_URL}/api/payments/create/${vaelisOrderId}`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      if (!razorpayResponse.ok) {
        const message =
          await razorpayResponse.text();

        throw new Error(
          message ||
            "Unable to create Razorpay order."
        );
      }

      const razorpayOrder =
        await razorpayResponse.json();

      const options = {
        key: keyId,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        name: "VAELIS",

        description:
          "VAELIS Order #" +
          vaelisOrderId,

        order_id:
          razorpayOrder.razorpayOrderId,

        prefill: {
          name: customerName,
          email: email,
          contact: "+91" + phone,
        },

        notes: {
          vaelisOrderId:
            String(vaelisOrderId),
        },

        theme: {
          color: "#c9a227",
        },

        modal: {
          confirm_close: true,
          escape: false,
          backdropclose: false,
        },

        handler:
          async function (
            response: any
          ) {
            try {
              setLoading(true);
              setError("");

              const verifyResponse =
                await fetch(
                  `${API_BASE_URL}/api/payments/verify`,
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify({
                        vaelisOrderId:
                          vaelisOrderId,

                        razorpayOrderId:
                          response.razorpay_order_id,

                        razorpayPaymentId:
                          response.razorpay_payment_id,

                        razorpaySignature:
                          response.razorpay_signature,
                      }),
                  }
                );

              if (!verifyResponse.ok) {
                const message =
                  await verifyResponse.text();

                throw new Error(
                  message ||
                    "Payment verification failed."
                );
              }

              const verification =
                await verifyResponse.json();

              if (
                verification.success !== true
              ) {
                throw new Error(
                  "Payment verification failed."
                );
              }

              clearCart();

              setOrderId(
                vaelisOrderId
              );

            } catch (error) {
              console.error(
                "Payment verification error:",
                error
              );

              setError(
                error instanceof Error
                  ? error.message
                  : "Payment verification failed."
              );

            } finally {
              setLoading(false);
            }
          },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (
          response: any
        ) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setError(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(
        "Razorpay Checkout error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );

      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // CREATE VAELIS ORDER
  // ---------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (items.length === 0) {
      setError(
        "Your cart is empty."
      );
      return;
    }

    if (!customerName.trim()) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!phone.match(/^\d{10}$/)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!city.trim()) {
      setError(
        "Please select or enter a city."
      );
      return;
    }

    if (!district.trim()) {
      setError(
        "Please select or enter a district."
      );
      return;
    }

    if (!state.trim()) {
      setError(
        "Please select or enter a state."
      );
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    if (!pincodeReady) {
      setError(
        isOtherLocation
          ? "Please enter a valid 6-digit pincode."
          : "Please enter a valid pincode matching the selected district."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = {
        customerName,
        email,
        phone,
        address,
        city,
        district,
        state,
        pincode,

        items: items.map(
          (item) => ({
            productId:
              item.product.id,

            quantity:
              item.quantity,

            color:
              item.color,
          })
        ),
      };

      const response =
        await fetch(
          `${API_BASE_URL}/api/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                orderData
              ),
          }
        );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
            "Unable to place order."
        );
      }

      const order =
        await response.json();

      console.log(
        "VAELIS Order:",
        order
      );

      await openRazorpayCheckout(
        order.id
      );

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to place order."
      );

      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // CONFIRMED ORDER SCREEN
  // ---------------------------------------------------------

  if (orderId) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Header />

        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-20">
          <div className="w-full rounded-[30px] border border-white/10 bg-white/[0.03] p-10 text-center">

            <CheckCircle
              size={52}
              className="mx-auto mb-6"
            />

            <h1 className="text-3xl font-medium">
              Order Confirmed
            </h1>

            <p className="mt-4 text-white/50">
              Thank you for shopping with VAELIS.
            </p>

            <p className="mt-3 text-sm text-white/40">
              Order #{orderId}
            </p>

            {confirmedOrder ? (
              <div className="mt-10 text-left">

                <div className="space-y-4">
                  {confirmedOrder.items?.map(
                    (item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between border-b border-white/10 pb-4"
                      >
                        <div>
                          <p className="text-sm">
                            {item.productName}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            {item.color} ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm">
                          ₹
                          {item.total?.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-6 space-y-3 text-sm">

                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>

                    <span>
                      ₹
                      {confirmedOrder.subtotal?.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-white/50">
                    <span>Delivery</span>

                    <span>
                      {confirmedOrder.deliveryCharge ===
                      0
                        ? "FREE"
                        : `₹${confirmedOrder.deliveryCharge}`}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-white/10 pt-4 text-lg">
                    <span>Total</span>

                    <span>
                      ₹
                      {confirmedOrder.total?.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                </div>

                <div className="mt-6 text-xs text-white/40">
                  Payment:{" "}
                  {confirmedOrder.paymentStatus}

                  <br />

                  Order Status:{" "}
                  {confirmedOrder.orderStatus}
                </div>

              </div>
            ) : (
              <p className="mt-8 text-sm text-white/40">
                Loading order details...
              </p>
            )}

            <button
              onClick={() =>
                router.push("/products")
              }
              className="mt-8 rounded-full bg-white px-8 py-3 text-black"
            >
              Continue Shopping
            </button>

          </div>
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------
  // CHECKOUT PAGE
  // ---------------------------------------------------------

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-16">

        <button
          onClick={() =>
            router.push("/cart")
          }
          className="mb-10 flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </button>

        <h1 className="text-4xl font-medium">
          Checkout
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">

          {/* CUSTOMER DETAILS */}

          <form
            onSubmit={handleSubmit}
            className="rounded-[30px] border border-white/10 bg-white/[0.03] p-8"
          >
            <h2 className="text-xl font-medium">
              Delivery Details
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">

              {/* FULL NAME */}

              <div>
                <label className="text-sm text-white/50">
                  Full Name
                </label>

                <input
                  required
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  placeholder="Your name"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="text-sm text-white/50">
                  Email
                </label>

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  placeholder="you@example.com"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="text-sm text-white/50">
                  Phone
                </label>

                <input
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                    setPhone(value);
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  placeholder="10 digit mobile number"
                />
              </div>

              {/* PINCODE */}

              <div>
                <label className="text-sm text-white/50">
                  Pincode
                </label>

                <input
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[1-9][0-9]{5}"
                  value={pincode}
                  onChange={(e) => {
                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

                    setPincode(value);
                    setPincodeError("");
                    setPincodeReady(false);
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  placeholder="110001"
                />

                {pincodeLoading && (
                  <p className="mt-2 text-xs text-white/40">
                    Verifying pincode...
                  </p>
                )}

                {!pincodeLoading &&
                  pincodeReady && (
                    <p className="mt-2 text-xs text-green-400">
                      ✓ Pincode verified
                    </p>
                  )}

                {pincodeError && (
                  <p className="mt-2 text-xs text-red-400">
                    {pincodeError}
                  </p>
                )}
              </div>

              {/* ADDRESS */}

              <div className="sm:col-span-2">
                <label className="text-sm text-white/50">
                  Address
                </label>

                <textarea
                  required
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  placeholder="House number, street, locality"
                />
              </div>

              {/* CITY */}

              <div>
                <label className="text-sm text-white/50">
                  City
                </label>

                {isOtherLocation ? (
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                    placeholder="Enter city"
                  />
                ) : (
                  <select
                    required
                    value={city}
                    onChange={(e) =>
                      handleCityChange(
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  >
                    <option value="">
                      Select City
                    </option>

                    {cityOptions.map(
                      (cityName) => (
                        <option
                          key={cityName}
                          value={cityName}
                        >
                          {cityName}
                        </option>
                      )
                    )}

                    <option value="Other">
                      Other
                    </option>
                  </select>
                )}
              </div>

              {/* DISTRICT */}

              <div>
                <label className="text-sm text-white/50">
                  District
                </label>

                {isOtherLocation ? (
                  <input
                    required
                    type="text"
                    value={district}
                    onChange={(e) =>
                      setDistrict(
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                    placeholder="Enter district"
                  />
                ) : (
                  <select
                    required
                    value={
                      district && state
                        ? `${state}|||${district}`
                        : ""
                    }
                    onChange={(e) =>
                      handleDistrictChange(
                        e.target.value
                      )
                    }
                    disabled={!city}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {!city
                        ? "Select city first"
                        : districtsForSelectedCity.length ===
                            1
                          ? "District selected"
                          : "Select District"}
                    </option>

                    {districtsForSelectedCity.map(
                      (item) => (
                        <option
                          key={`${item.state}|||${item.district}`}
                          value={`${item.state}|||${item.district}`}
                        >
                          {item.district}
                        </option>
                      )
                    )}

                    <option value="Other">
                      Other
                    </option>
                  </select>
                )}
              </div>

              {/* STATE */}

              <div className="sm:col-span-2">
                <label className="text-sm text-white/50">
                  State
                </label>

                {isOtherLocation ? (
                  <input
                    required
                    type="text"
                    value={state}
                    onChange={(e) =>
                      setState(
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                    placeholder="Enter state"
                  />
                ) : (
                  <input
                    required
                    type="text"
                    value={state}
                    readOnly
                    disabled
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder={
                      !city
                        ? "Select city first"
                        : statesForSelectedCity.length > 1
                          ? "Select district"
                          : "Auto-filled from city"
                    }
                  />
                )}
              </div>

            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                items.length === 0
              }
              className="mt-8 w-full rounded-full bg-white px-6 py-4 font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Opening Payment..."
                : `Pay ₹${total.toLocaleString(
                    "en-IN"
                  )}`}
            </button>
          </form>

          {/* ORDER SUMMARY */}

          <aside className="h-fit rounded-[30px] border border-white/10 bg-white/[0.03] p-8">

            <h2 className="text-xl font-medium">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">

              {items.map(
                (item) => (
                  <div
                    key={`${item.product.id}-${item.color}`}
                    className="flex justify-between gap-4 border-b border-white/10 pb-5"
                  >
                    <div>
                      <p className="text-sm">
                        {item.product.name}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {item.color} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm">
                      ₹
                      {(
                        item.product.price *
                        item.quantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                )
              )}

            </div>

            <div className="mt-8 space-y-4 text-sm">

              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>

                <span>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between text-white/50">
                <span>Delivery</span>

                <span>
                  {deliveryCharge === 0
                    ? "Free"
                    : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-white/10 pt-5 text-lg">
                <span>Total</span>

                <span>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

            </div>

          </aside>

        </div>
      </section>
    </main>
  );
}
