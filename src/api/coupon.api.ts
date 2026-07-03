import api from "@/lib/api"

export interface IValidateCouponData {
  coupon: {
    valid: boolean;
    code: string;
    discountType: "percent" | "flat" | "free";
    discountAmount: number;
    finalAmount: number;
  };
}

export interface ICreateCouponPayload {
  code: string;
  discountType: "percent" | "flat" | "free";
  discountValue: number;
  applicablePlans: string[];
  maxUses: number | null;
  expiresAt: string | null;
  isActive: boolean;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percent" | "flat" | "free";
  discountValue: number;
  applicablePlans: string[];
  maxUses: number | null;
  expiresAt: string | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CouponResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string };


const createCoupon = async (
  payload: ICreateCouponPayload
): Promise<CouponResponse<{ message: string }>> => {
  try {
    const { data } = await api.post("/coupon/create", payload);
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not create coupon",
    };
  }
};


const validateCoupon = async (
  code: string,
  plan: string
): Promise<CouponResponse<IValidateCouponData>> => {
  try {
    const { data } = await api.post<CouponResponse<IValidateCouponData>>("/coupons/validate", {
      code,
      plan,
    });
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not validate coupon",
    };
  }
};


const updateCoupon = async (
  couponId: string,
  payload: ICreateCouponPayload
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data } = await api.put(`/coupons/update/${couponId}`, payload);
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not update coupon",
    };
  }
};

const deleteCoupon = async (
  couponId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data } = await api.delete(`/coupons/delete/${couponId}`);
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not delete coupon",
    };
  }
};


const getListOfCoupons = async ():Promise<CouponResponse<{ data: ICoupon[] }>> => {
  try {
    const { data } = await api.get("/coupons/list");
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not get list of coupons",
    };
  }
};


export const couponService = {
  createCoupon,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  getListOfCoupons
};
