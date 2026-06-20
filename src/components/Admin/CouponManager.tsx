import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Percent,
  IndianRupee,
  Gift,
  AlertTriangle,
} from "lucide-react";

import { useCoupon } from "@/hooks/useCoupon";
import CouponSkeleton from "./CouponSkeleton";

const COLOR_PRIMARY = "#03257e";
const COLOR_ACCENT = "#008888";
const COLOR_WARNING = "#f14419";

type DiscountType = "percent" | "flat" | "free";

interface ICoupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  applicablePlans: string[];
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

interface ICouponFormState {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  applicablePlans: string[];
  maxUses: string;
  expiresAt: string;
  isActive: boolean;
}

const PLAN_OPTIONS = [
  { id: "yearly", label: "Yearly" },
  { id: "half_yearly", label: "Half Yearly" },
];

const EMPTY_FORM: ICouponFormState = {
  code: "",
  discountType: "percent",
  discountValue: "",
  applicablePlans: [],
  maxUses: "",
  expiresAt: "",
  isActive: true,
};

export default function CouponManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ICouponFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICoupon | null>(null);
  const { getListOfCoupons,isLoading,listOfCouponsData,createCoupon,updateCoupon,deleteCoupon} = useCoupon();

  useEffect(() => {
    getListOfCoupons();
  }, []);

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (coupon: ICoupon) => {
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      applicablePlans: coupon.applicablePlans,
      maxUses: coupon.maxUses !== null ? String(coupon.maxUses) : "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      isActive: coupon.isActive,
    });
    setEditingId(coupon._id);
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const togglePlan = (planId: string) => {
    setForm((prev) => ({
      ...prev,
      applicablePlans: prev.applicablePlans.includes(planId)
        ? prev.applicablePlans.filter((p) => p !== planId)
        : [...prev.applicablePlans, planId],
    }));
  };

  const validateForm = (): string | null => {
    if (!form.code.trim()) return "Coupon code is required";
    if (form.applicablePlans.length === 0)
      return "Select at least one applicable plan";
    if (form.discountType !== "free") {
      if (!form.discountValue || Number(form.discountValue) <= 0)
        return "Enter a valid discount value";
      if (form.discountType === "percent" && Number(form.discountValue) > 100)
        return "Percent discount cannot exceed 100";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: form.discountType === "free" ? 0 : Number(form.discountValue),
      applicablePlans: form.applicablePlans,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      isActive: form.isActive,
    };

      if (editingId) {
        await updateCoupon(editingId, payload);
      } else {
        await createCoupon(payload);
      }
      closeForm();
      await getListOfCoupons();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCoupon(deleteTarget._id);
    setDeleteTarget(null);
    getListOfCoupons();
  };

  const formatDiscount = (c: ICoupon) => {
    if (c.discountType === "free") return "Free plan";
    if (c.discountType === "percent") return `${c.discountValue}% off`;
    return `₹${c.discountValue} off`;
  };

  const isExpired = (c: ICoupon) =>
    c.expiresAt ? new Date(c.expiresAt) < new Date() : false;

  if(isLoading){
    return (
      <div>
        <CouponSkeleton />
      </div>
    );
  }
  

  return (
    <div className="min-h-screen w-full" style={{ background: "#f7f8fb" }}>
      <main className="w-full sm:max-w-5xl sm:mx-auto sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#e6f1fb" }}
            >
              <Tag className="h-5 w-5" style={{ color: COLOR_PRIMARY }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Coupon codes</h1>
              <p className="text-sm text-gray-500">
                Create and manage discount coupons for EBUK points plans
              </p>
            </div>
          </div>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg text-white"
            style={{ backgroundColor: COLOR_ACCENT }}
          >
            <Plus className="h-4 w-4" /> New coupon
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : listOfCouponsData.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                <Tag className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                No coupons yet
              </p>
              <p className="text-sm text-gray-500">
                Create your first coupon to offer discounts on plans.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {listOfCouponsData.length > 0 && listOfCouponsData.map((c: ICoupon) => {
                const expired = isExpired(c);
                const maxedOut = c.maxUses !== null && c.usedCount >= c.maxUses;
                const inactive = !c.isActive || expired || maxedOut;

                return (
                  <div
                    key={c._id}
                    className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#f7f8fb" }}
                      >
                        {c.discountType === "free" ? (
                          <Gift className="h-4 w-4" style={{ color: COLOR_WARNING }} />
                        ) : c.discountType === "percent" ? (
                          <Percent className="h-4 w-4" style={{ color: COLOR_PRIMARY }} />
                        ) : (
                          <IndianRupee className="h-4 w-4" style={{ color: COLOR_ACCENT }} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-900 tracking-wide">
                            {c.code}
                          </span>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: inactive ? "#f3f4f6" : "#e1f5ee",
                              color: inactive ? "#6b7280" : "#0f6e56",
                            }}
                          >
                            {expired
                              ? "Expired"
                              : maxedOut
                                ? "Limit reached"
                                : c.isActive
                                  ? "Active"
                                  : "Disabled"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDiscount(c)} · {c.applicablePlans.join(", ")} ·{" "}
                          {c.usedCount}/{c.maxUses ?? "∞"} used
                          {c.expiresAt && (
                            <>
                              {" "}
                              · expires{" "}
                              {new Date(c.expiresAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              })}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditForm(c)}
                        className="text-xs font-medium px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="text-xs font-medium px-3 py-2 rounded-lg border flex items-center gap-1.5"
                        style={{ borderColor: "#fca5a5", color: "#dc2626" }}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {isFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                {editingId ? "Edit coupon" : "Create coupon"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Coupon code
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="e.g. SAVE50"
                  disabled={!!editingId}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 uppercase tracking-wide focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500"
                />
                {editingId && (
                  <p className="text-xs text-gray-400 mt-1">
                    Code cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Discount type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["percent", "flat", "free"] as DiscountType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm((p) => ({ ...p, discountType: type }))}
                      className="text-xs font-medium px-3 py-2.5 rounded-lg border capitalize"
                      style={{
                        borderColor:
                          form.discountType === type ? COLOR_ACCENT : "#d1d5db",
                        backgroundColor:
                          form.discountType === type ? "#e1f5ee" : "white",
                        color: form.discountType === type ? "#0f6e56" : "#374151",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {form.discountType !== "free" && (
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Discount value{" "}
                    {form.discountType === "percent" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, discountValue: e.target.value }))
                    }
                    placeholder={form.discountType === "percent" ? "50" : "100"}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Applicable plans
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PLAN_OPTIONS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => togglePlan(plan.id)}
                      className="text-xs font-medium px-3 py-2 rounded-lg border"
                      style={{
                        borderColor: form.applicablePlans.includes(plan.id)
                          ? COLOR_PRIMARY
                          : "#d1d5db",
                        backgroundColor: form.applicablePlans.includes(plan.id)
                          ? "#e6f1fb"
                          : "white",
                        color: form.applicablePlans.includes(plan.id)
                          ? COLOR_PRIMARY
                          : "#374151",
                      }}
                    >
                      {plan.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Max uses
                  </label>
                  <input
                    type="number"
                    value={form.maxUses}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, maxUses: e.target.value }))
                    }
                    placeholder="Unlimited"
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Expires on
                  </label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, expiresAt: e.target.value }))
                    }
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>

              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
              <button
                onClick={closeForm}
                className="text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="text-sm font-medium px-5 py-2.5 rounded-lg text-white disabled:opacity-60 flex items-center gap-2"
                style={{ backgroundColor: COLOR_ACCENT }}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save changes" : "Create coupon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <div className="bg-white rounded-xl w-full max-w-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#fcebeb" }}
              >
                <AlertTriangle className="h-5 w-5" style={{ color: "#dc2626" }} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Delete coupon</p>
                <p className="text-xs text-gray-500">This cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {deleteTarget.code}
              </span>
              ? Users will no longer be able to apply this coupon.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="text-sm font-medium px-4 py-2.5 rounded-lg text-white disabled:opacity-60 flex items-center gap-2"
                style={{ backgroundColor: "#dc2626" }}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}