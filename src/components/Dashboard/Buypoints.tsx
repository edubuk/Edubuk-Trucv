import { useState, useEffect, useRef } from "react";
import {
  Coins,
  Infinity as InfinityIcon,
  ShieldCheck,
  TrendingUp,
  Check,
  Zap,
  Tag,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api"; // your axios/fetch wrapper — adjust import path

const COLOR_PRIMARY = "#03257e";
const COLOR_ACCENT = "#008888";
const COLOR_WARNING = "#f14419";

interface IPlan {
  id: "half_yearly" | "yearly";
  label: string;
  durationMonths: number;
  price: number;
  points: number;
  badge?: string;
  perMonth: string;
}

interface ICouponResult {
  valid: boolean;
  code: string;
  discountType: "percent" | "flat" | "free";
  discountAmount: number; // in rupees, already calculated for the selected plan
  finalAmount: number; // in rupees
  message?: string;
}

const PLANS: IPlan[] = [
  {
    id: "half_yearly",
    label: "Half yearly",
    durationMonths: 6,
    price: 899,
    points: 300,
    perMonth: "₹150/month",
  },
  {
    id: "yearly",
    label: "Yearly",
    durationMonths: 12,
    price: 1799,
    points: 700,
    badge: "Best value",
    perMonth: "₹150/month",
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

export default function BuyPoints() {
  const [selectedPlan, setSelectedPlan] = useState<IPlan["id"]>("yearly");
  const [couponInput, setCouponInput] = useState("");
  const [couponResult, setCouponResult] = useState<ICouponResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const activePlan = PLANS.find((p) => p.id === selectedPlan)!;

  // re-validate automatically if user switches plans after applying a coupon
  useEffect(() => {
    if (couponResult) {
      validateCoupon(couponResult.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan]);

  const validateCoupon = async (codeRaw: string) => {
    const code = codeRaw.trim().toUpperCase();
    if (!code) return;

    setIsValidating(true);
    setCouponError(null);

    try {
      const res = await api.post("/coupons/validate", {
        code,
        plan: selectedPlan,
      });

      if (!res.data.success) {
        setCouponResult(null);
        setCouponError(res.data.message || "Invalid coupon code");
        return;
      }

      setCouponResult(res.data.data); // { valid, code, discountType, discountAmount, finalAmount }
    } catch (err: any) {
      setCouponResult(null);
      setCouponError(
        err?.response?.data?.message || "Could not validate coupon",
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleCouponChange = (value: string) => {
    setCouponInput(value);
    setCouponError(null);

    // clear any applied coupon as soon as the user edits the field again
    if (couponResult) setCouponResult(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) return;

    // debounce live validation as the user types
    debounceRef.current = setTimeout(() => validateCoupon(value), 600);
  };

  const clearCoupon = () => {
    setCouponInput("");
    setCouponResult(null);
    setCouponError(null);
  };

  const finalPrice = couponResult ? couponResult.finalAmount : activePlan.price;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      // server recalculates the price + re-validates the coupon —
      // never trust couponResult.finalAmount for the actual charge
      const res = await api.post("/payments/checkout", {
        plan: selectedPlan,
        couponCode: couponResult ? couponResult.code : undefined,
      });

      const { order, free } = res.data;

      // free coupon (e.g. "FOUNDER6") — backend already activated the
      // subscription, no Razorpay flow needed
      if (free) {
        navigate("/dashboard", { state: { activated: true } });
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "EBUK",
        description: `${activePlan.label} points plan`,
        handler: async (response: any) => {
          await api.post("/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            couponCode: couponResult ? couponResult.code : undefined,
          });
          navigate("/dashboard", { state: { purchased: true } });
        },
        theme: { color: COLOR_ACCENT },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setCouponError(
        err?.response?.data?.message || "Something went wrong, try again",
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#f7f8fb" }}>
      <main className="w-full sm:max-w-4xl sm:mx-auto sm:px-6 py-6 space-y-6">
        {/* Header banner */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] opacity-90" />
          <div className="relative bg-white border border-gray-200 rounded-xl px-6 py-8 text-center">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: "#e6f1fb" }}
            >
              <Coins className="h-7 w-7" style={{ color: COLOR_PRIMARY }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Buy EBUK points
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Top up your wallet to verify your education, experience and
              award documents. Points never expire.
            </p>
          </div>
        </div>

        {/* Plan cards */}
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
                  <span className="text-sm text-gray-500">
                    /{plan.durationMonths === 12 ? "yr" : "6mo"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{plan.perMonth}</p>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Coins className="h-4 w-4" style={{ color: COLOR_PRIMARY }} />
                  <span className="text-sm font-semibold text-gray-900">
                    {plan.points} points
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Coupon code */}
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
                disabled={!!couponResult}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500"
                style={{
                  borderColor: couponResult
                    ? COLOR_ACCENT
                    : couponError
                      ? "#dc2626"
                      : "#d1d5db",
                }}
              />
              {isValidating && (
                <Loader2
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"
                />
              )}
            </div>

            {couponResult ? (
              <button
                onClick={clearCoupon}
                className="flex items-center gap-1 text-xs font-medium px-3 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            ) : (
              <button
                onClick={() => validateCoupon(couponInput)}
                disabled={!couponInput.trim() || isValidating}
                className="text-xs font-medium px-4 py-2.5 rounded-lg text-white disabled:opacity-40"
                style={{ backgroundColor: COLOR_PRIMARY }}
              >
                Apply
              </button>
            )}
          </div>

          {couponResult && (
            <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: "#0F6E56" }}>
              <CheckCircle2 className="h-4 w-4" />
              {couponResult.discountType === "free" ? (
                <span className="font-medium">
                  Coupon applied — this plan is free!
                </span>
              ) : (
                <span className="font-medium">
                  Coupon applied — you saved ₹{couponResult.discountAmount}
                </span>
              )}
            </div>
          )}

          {couponError && (
            <p className="mt-3 text-sm text-red-600">{couponError}</p>
          )}
        </div>

        {/* Features */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-3 px-1">
            What you get with verification
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#f7f8fb" }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {f.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky purchase bar */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-4 sticky bottom-4 shadow-lg">
          <div>
            <p className="text-xs text-gray-500">You selected</p>
            <p className="text-base font-bold text-gray-900 flex items-baseline gap-2 flex-wrap">
              {activePlan.label} —{" "}
              {couponResult ? (
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
            {couponResult?.discountType === "free"
              ? "Activate free plan"
              : "Proceed to payment"}
          </button>
        </div>
      </main>
    </div>
  );
}