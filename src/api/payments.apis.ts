import api from "@/lib/api";

export type PaymentResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string };

export type PlanType = "starter" | "professional" | "elite";

interface IPaidCheckout {
  order: {
    amount: number;
    currency: string;
    receipt: string;
    id: string;
  };
}

interface IFreeCheckout {
  balance: number;
  couponCode: string;
  email: string[];
  paymentId: string;
  startDate: string;
  status: string;
  subscriptionPlan: string;
  updatedAt: string;
}

export type ICheckout = IPaidCheckout | IFreeCheckout;

export interface IVerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: PlanType;
  couponCode?: string | null;
}

export type Transaction = {
  type: "credit" | "debit";
  points: number;
  amount: number;
  reason: string;
  couponCode: string | null;
  docId: string | null;
  docModel: string | null;
  note: string;
  createdAt: string;
  _id: string;
};

export interface IPaymentRecord {
  transactions: Transaction[];
}

export const checkout = async (
  code: string | null,
  plan: PlanType
): Promise<PaymentResponse<ICheckout>> => {
  const response = await api.post("/cv/checkout", {
    code,
    plan
  });

  return response.data;
};

export const verifyPayment = async (
  input: IVerifyPaymentInput
): Promise<PaymentResponse<IPaymentRecord>> => {
  const response = await api.post("/cv/payment_verification", input);

  return response.data;
};

export const getPaymentRecord = async (): Promise<
  PaymentResponse<IPaymentRecord>
> => {
  const response = await api.get("/cv/payment-record");

  return response.data;
};