import { API_BASE_URL } from "@/main";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";

const UpdateSubscription = ({setModalOpen,user,userSubscriptionDetails}:any) => {
    const [newPlan, setNewPlan] = useState<"free" | "basic"|"pro">("free");
    const [saving, setSaving] = useState<boolean>(false);


    async function handleSubmit() {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/updateSubscriptionPlan?userId=${user._id}`, {
        method: "PUT",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("googleIdToken")}`,
        },
        body: JSON.stringify({ subscriptionPlan: newPlan }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok || (result && result.success === false)) {
        const msg = result?.message || `Server error: ${res.status}`;
        toast.error(`Failed to update: ${msg}`);
        setSaving(false);
        return;
      }

      toast.success("Subscription updated");
      // keep modal open briefly to show success then close
      setTimeout(() => {
        setSaving(false);
        setModalOpen(false);
      }, 500);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update subscription");
      setSaving(false);
    }
  }


    return (
            <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setModalOpen(false)}
                    aria-hidden
                />

                <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-sm text-gray-500">Edit Subscription</div>
                            <div className="mt-1 font-semibold text-lg flex items-center gap-3 break-all">
                                <span>{user.email}</span>
                                <span
                                    className="px-2 py-0.5 rounded-md text-sm"
                                    style={{
                                        border: "1px solid #e6e6e6",
                                        background: "rgba(3,37,126,0.03)",
                                        color: "#03257e",
                                    }}
                                >
                                    Current: {userSubscriptionDetails.subscriptionPlan}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setModalOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Subscription</label>

                        {/* Toggle style buttons */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setNewPlan("free")}
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium shadow-sm transition-colors`}
                                style={{
                                    background: newPlan === "free" ? "#006666" : "transparent",
                                    color: newPlan === "free" ? "white" : "#006666",
                                    borderColor: "#006666",
                                }}
                            >
                                Free
                            </button>

                            <button
                                onClick={() => setNewPlan("pro")}
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium shadow-sm transition-colors`}
                                style={{
                                    background: newPlan === "pro" ? "#f14419" : "transparent",
                                    color: newPlan === "pro" ? "white" : "#f14419",
                                    borderColor: "#f14419",
                                }}
                            >
                                Pro
                            </button>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            You are changing subscription for <strong>{user.email}</strong> to{" "}
                            <strong>{newPlan}</strong>.
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            onClick={() => setModalOpen(false)}
                            disabled={saving}
                            className="px-4 py-2 rounded-lg border"
                            style={{ borderColor: "#e6e6e6" }}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => handleSubmit()}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow"
                            style={{ background: "#03257e" }}
                        >
                            {saving ? (
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            ) : (
                                <FaCheck />
                            )}
                            <span>{saving ? "Saving..." : "Save changes"}</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

export default UpdateSubscription;