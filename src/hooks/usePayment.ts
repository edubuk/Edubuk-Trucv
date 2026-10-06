import { useState } from "react";
import * as paymentService from "../api/payments.apis";
import type {
  ICheckout,
  IPaymentRecord,
  IVerifyPaymentInput,
  PlanType,
} from "../api/payments.apis";

export const usePayment = () => {
  const [paymentRecord, setPaymentRecord] = useState<IPaymentRecord | null>(null);
  const [orderDetails, setOrderDetails] = useState<ICheckout | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<IPaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const createOrder = async (code: string | null, plan: PlanType) => {
    try {
      setIsLoading(true);
      setPaymentError(null);

      const response = await paymentService.checkout(code, plan);

      if (!response.success) {
        setPaymentError(response.message);
        return null;
      }

      setOrderDetails(response.data);
      console.log("response in create order",response.data)
      return response.data;
    } catch (err: any) {
        console.log("error in checkout",err)
      setPaymentError(err.response?.data?.message || err.message || "Something went wrong");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (paymentData: IVerifyPaymentInput) => {
    try {
      setIsLoading(true);
      setPaymentError(null);

      const response = await paymentService.verifyPayment(paymentData);

      if (!response.success) {
        setPaymentError(response.message);
        return null;
      }

      setPaymentDetails(response.data);
      return response.data;
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || err.message || "Something went wrong");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentHistory = async () => {
    try {
      setIsLoading(true);
      setPaymentError(null);

      const response = await paymentService.getPaymentRecord();

      if (!response.success) {
        setPaymentError(response.message);
        return null;
      }

      setPaymentRecord(response.data);
      return response.data;
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || err.message || "Something went wrong");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orderDetails,
    paymentDetails,
    paymentRecord,
    isLoading,
    paymentError,
    setPaymentError,
    createOrder,
    verifyPayment,
    getPaymentHistory
  };
};