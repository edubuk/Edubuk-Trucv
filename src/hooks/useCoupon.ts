import { couponService, IValidateCouponData, CouponResponse, ICreateCouponPayload, ICoupon } from "@/api/coupon.api";
import { useCallback, useState } from "react";


export const useCoupon = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validateCouponData, setValidateCouponData] = useState<CouponResponse<IValidateCouponData>>();
    const [createCouponData, setCreateCouponData] = useState<CouponResponse<{ message: string }>>();
    const [deleteCouponData, setDeleteCouponData] = useState<{ success: boolean; message: string }>();
    const [updateCouponData, setUpdateCouponData] = useState<{ success: boolean; message: string }>();
    const [listOfCouponsData, setListOfCouponsData] = useState<ICoupon[]>([]);

    const validateCoupon = useCallback(async ({code, plan}: {code: string, plan: string}) => {
        try {
            setError(null);
            setIsLoading(true);
            const coupon = await couponService.validateCoupon(code, plan);
            console.log({coupon});
            setValidateCouponData(coupon);
        } catch (error) {
            console.error(error);
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
        
    }, []);

    const createCoupon = useCallback(async (payload: ICreateCouponPayload) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await couponService.createCoupon(payload);
            console.log({response});
            setCreateCouponData(response);
        } catch (error) {
            console.error(error);
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, []);


    const deleteCoupon = useCallback(async (id: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await couponService.deleteCoupon(id);
            console.log({response});
            setDeleteCouponData(response);
        } catch (error) {
            console.error(error);
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, []);


    const updateCoupon = useCallback(async (couponId: string, payload: ICreateCouponPayload) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await couponService.updateCoupon(couponId, payload);
            console.log({response});
            setUpdateCouponData(response);
        } catch (error) {
            console.error(error);
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, []);


    const getListOfCoupons = useCallback(async () => {
  try {
    setError(null);
    setIsLoading(true);

    const response = await couponService.getListOfCoupons();

    if (!response.success) {
      setError(response.message);
      setListOfCouponsData([]);
      return;
    }
    console.log({response});
    setListOfCouponsData(response?.data?.coupons);
  } catch (error) {
    console.error(error);
    setError((error as Error).message);
  } finally {
    setIsLoading(false);
  }
}, []);
 
    
    return {
        validateCouponData,
        createCouponData,
        deleteCouponData,
        updateCouponData,
        listOfCouponsData,
        isLoading,
        error,
        validateCoupon,
        createCoupon,
        deleteCoupon,
        updateCoupon,
        getListOfCoupons,
    };
}