import { useState, useEffect, useRef } from "react";
import EBUKLogo from "@/assets/ebukLogo.webp";
import {
  Infinity as InfinityIcon,
  ShieldCheck,
  TrendingUp,
  Check,
  Zap,
  Tag,
  Loader2,
  X,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePayment } from "../../hooks/usePayment";
import { useCoupon } from "../../hooks/useCoupon";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const COLOR_PRIMARY = "#03257e";
const COLOR_ACCENT = "#008888";
const COLOR_WARNING = "#f14419";

interface IPlan {
  id: "starter" | "professional" | "elite";
  label: string;
  price: number;
  points: number;
  badge?: string;
}

const PLANS: IPlan[] = [
  {
    id: "starter",
    label: "Starter",
    price: 1999,
    points: 499,
  },
  {
    id: "professional",
    label: "Professional",
    price: 2499,
    points: 799,
    badge: "Most Popular",
  },
  {
    id: "elite",
    label: "Elite",
    price: 2999,
    points: 999,
    badge:"Best value"
  },
];

const FEATURES = [
  {
    icon: <InfinityIcon className="h-5 w-5" style={{ color: COLOR_PRIMARY }} />,
    title: "Verify once, stay verified",
    desc: "Lifetime verification — no repeat checks needed.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" style={{ color: "#0F6E56" }} />,
    title: "Skip post-hire checks",
    desc: "No background verification worries after you're hired.",
  },
  {
    icon: <TrendingUp className="h-5 w-5" style={{ color: COLOR_WARNING }} />,
    title: "Rank higher in shortlists",
    desc: "Verified profiles surface first to recruiters.",
  },
  {
    icon: <Zap className="h-5 w-5" style={{ color: COLOR_ACCENT }} />,
    title: "Instant verification credits",
    desc: "Points land in your wallet the moment payment succeeds.",
  },
];

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BuyPoints() {
  const [selectedPlan, setSelectedPlan] = useState<IPlan["id"]>("starter");
  const [couponInput, setCouponInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const { createOrder, verifyPayment,paymentError,setPaymentError } = usePayment();
  const { validateCoupon,validateCouponData,setValidateCouponData,couponError,setCouponError } = useCoupon();

  const activePlan = PLANS.find((p) => p.id === selectedPlan)!;
  const finalPrice = validateCouponData?.coupon ? validateCouponData.coupon.finalAmount : activePlan.price;

  useEffect(() => {
    if (validateCouponData) {
      validateCouponHandler(validateCouponData.coupon.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan]);

  const validateCouponHandler = async (codeRaw: string) => {
    const code = codeRaw.trim().toUpperCase();
    if (!code) return;

    setIsValidating(true);
    setCouponError(null);
    setPaymentError(null);

    try {
      const result = await validateCoupon({
        code,
        plan: selectedPlan,
      });

      if (!result?.success) {
        setValidateCouponData(null);
        setCouponError("Invalid coupon code");
        return;
      }
    } catch (err: any) {
      setValidateCouponData(null);
      setCouponError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not validate coupon"
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleCouponChange = (value: string) => {
    setCouponInput(value);
    setCouponError(null);

    if (validateCouponData) {
      setValidateCouponData(null);
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) return;

    debounceRef.current = setTimeout(() => {
      validateCouponHandler(value);
    }, 600);
  };

  const clearCoupon = () => {
    setCouponInput("");
    setValidateCouponData(null);
    setCouponError(null);
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    setCouponError(null);

    try {
      const orderData = await createOrder(
        validateCouponData?.coupon.code ?? null,
        selectedPlan
      );
       console.log("orderData", orderData);
      if (!orderData) {
        setCouponError("Could not create payment order");
        return;
      }

      if('paymentId' in orderData){
        // Handle free plan or existing payment
        navigate("/dashboard", {
            state: { purchased: true },
          });
        return;
      }
      
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        setCouponError("Razorpay failed to load");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RZ_KEY,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        order_id: orderData.order.id,
        name: "EBUK",
        description: `${activePlan.label} points plan`,

        handler: async (response: any) => {
          const verified = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan: selectedPlan,
            couponCode: validateCouponData?.coupon.code ?? null,
          });

          if (!verified) {
            setCouponError("Payment verification failed");
            return;
          }

          navigate("/dashboard", {
            state: { purchased: true },
          });
        },

        theme: {
          color: COLOR_ACCENT,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setCouponError(
        err?.response?.data?.message || err?.message || "Something went wrong"
      );
    } finally {
      setIsPurchasing(false);
    }
  };
  console.log({validateCouponData})
  return (
    <div className="min-h-screen w-full" style={{ background: "#f7f8fb" }}>
      <div className="flex items-center justify-start p-4">
        <Link to="/" className="flex items-center gap-2 text-[#03257e] hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft className="w-6 h-6" />
          Go Back
        </Link>
      </div>
      <main className="w-full sm:max-w-4xl sm:mx-auto sm:px-6 py-6 space-y-6">
        <div className="relative">
          <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] opacity-90" />
          <div className="relative bg-white border border-gray-200 rounded-xl px-6 py-8 text-center">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: "#e6f1fb" }}
            >
              <img src={EBUKLogo} alt="EBUK Logo" className="h-auto w-10 rounded-full" />
            
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Buy EBUK Credits
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Top up your wallet to verify your education, experience and award
              documents. Credits never expire.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className="text-left bg-white rounded-xl p-5 transition-all duration-200 relative"
                style={{
                  border: isSelected
                    ? `2px solid ${COLOR_ACCENT}`
                    : "1px solid #e5e7eb",
                  boxShadow: isSelected
                    ? "0 4px 14px rgba(0,136,136,0.12)"
                    : "none",
                }}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3 left-5 text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: COLOR_WARNING }}
                  >
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">
                    {plan.label}
                  </p>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: isSelected ? COLOR_ACCENT : "#d1d5db",
                      backgroundColor: isSelected ? COLOR_ACCENT : "white",
                    }}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <img src={EBUKLogo} alt="EBUK Logo" className="h-auto w-4 rounded-full" />
                  <span className="text-sm font-semibold text-gray-900">
                    {plan.points} credits
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4" style={{ color: COLOR_PRIMARY }} />
            <p className="text-sm font-semibold text-gray-900">
              Have a coupon code?
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => handleCouponChange(e.target.value)}
                placeholder="Enter coupon code"
                disabled={!!validateCouponData?.coupon}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500"
                style={{
                  borderColor: validateCouponData?.coupon
                    ? COLOR_ACCENT
                    : couponError
                      ? "#dc2626"
                      : "#d1d5db",
                }}
              />

              {isValidating && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>

            {validateCouponData?.coupon ? (
              <button
                onClick={clearCoupon}
                className="flex items-center gap-1 text-xs font-medium px-3 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            ) : (
              <button
                onClick={() => validateCouponHandler(couponInput)}
                disabled={!couponInput.trim() || isValidating}
                className="text-xs font-medium px-4 py-2.5 rounded-lg text-white disabled:opacity-40"
                style={{ backgroundColor: COLOR_PRIMARY }}
              >
                Apply
              </button>
            )}
          </div>

          {validateCouponData?.coupon && (
            <div
              className="mt-3 flex items-center gap-2 text-sm"
              style={{ color: "#0F6E56" }}
            >
              <CheckCircle2 className="h-4 w-4" />
              {validateCouponData.coupon.discountType === "free" ? (
                <span className="font-medium">
                  Coupon applied — this plan is free!
                </span>
              ) : (
                <span className="font-medium">
                  Coupon applied — you saved ₹ {validateCouponData.coupon.discountAmount}
                </span>
              )}
            </div>
          )}

          {couponError && (
            <p className="mt-3 text-sm text-red-600">{couponError}</p>
          )}
       
          {paymentError && (
            <p className="mt-3 text-sm text-red-600">{paymentError}</p>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900 mb-3 px-1">
            What you get with verification
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#f7f8fb" }}
                >
                  {feature.icon}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {feature.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-4 sticky bottom-4 shadow-lg">
          <div>
            <p className="text-xs text-gray-500">You selected</p>
            <p className="text-base font-bold text-gray-900 flex items-baseline gap-2 flex-wrap">
              {activePlan.label} —{" "}
              {validateCouponData?.coupon ? (
                <>
                  <span className="line-through text-gray-400 font-normal text-sm">
                    ₹{activePlan.price}
                  </span>
                  <span>₹{finalPrice}</span>
                </>
              ) : (
                <span>₹{activePlan.price}</span>
              )}{" "}
              for {activePlan.points} points
            </p>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="text-sm font-medium px-6 py-3 rounded-lg text-white transition-all duration-200 hover:shadow-md disabled:opacity-60 flex items-center gap-2"
            style={{ backgroundColor: COLOR_ACCENT }}
          >
            {isPurchasing && <Loader2 className="h-4 w-4 animate-spin" />}
            {validateCouponData?.coupon?.discountType === "free"
              ? "Activate free plan"
              : "Proceed to payment"}
          </button>
        </div>
      </main>
    </div>
  );
}