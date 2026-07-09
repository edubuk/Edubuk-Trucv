import api from "@/lib/api";

export interface ISubscription {
  userId: string;
  email: string[];
  subscriptionPlan: "starter" | "professional" | "elite";
  status: "active" | "cancelled";
  balance: number;
  paymentId: string;
  couponCode: string;
  orderId: string;
  startDate: string;
  renewsAt: string;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionResponse =
  | {
      success: true;
      message: string;
      data: ISubscription;
    }
  | {
      success: false;
      message: string;
    };

export const fetchSubscription = async (): Promise<ISubscription> => {
  const {data} = await api.get<SubscriptionResponse>("/subscription/fetch");
  console.log("res", data);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch subscription");
  }
  
  return data.data;

};