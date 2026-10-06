import { useCallback, useState } from "react";
import { fetchSubscription, type ISubscription } from "@/api/subscription.apis";

export interface UseSubscriptionReturn {
  getSubscription: () => Promise<ISubscription | null>;
  isSubscriptionLoading: boolean;
  subscriptionError: string | null;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const getSubscription = useCallback(async (): Promise<ISubscription | null> => {
    setIsSubscriptionLoading(true);
    setSubscriptionError(null);

    try {
      const subscription = await fetchSubscription();
      console.log("subscription hook", subscription);
      return subscription;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error?.message : "Failed to fetch subscription";
      setSubscriptionError(message);
      return null;
    } finally {
      setIsSubscriptionLoading(false);
    }
  }, []);

  return {
    getSubscription,
    isSubscriptionLoading,
    subscriptionError,
  };
};