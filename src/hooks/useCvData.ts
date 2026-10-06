// hooks/useSearchProfiles.ts
import { useState, useCallback } from "react";
import { cvService2,cvService} from "@/api/cv.apis";
import { toast } from "react-hot-toast";
import { ICvData } from "@/CvBuilder/CvBuilder";

interface UseCvDataReturn {
  cvData: ICvData | null;
  isCvLoading: boolean;
  error: string | null;
  searchCvData: (userId: string) => Promise<void>;
  searchFullCvData: () => Promise<void>;
  reset: () => void;
}

export function useCvData(): UseCvDataReturn {
  const [cvData, setCvData] = useState<ICvData | null>(null);
  const [isCvLoading, setIsCvLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCvData = useCallback(async (userId: string) => {
    if (!userId.trim()) {
      setCvData(null);
      return;
    }

    setIsCvLoading(true);
    setError(null);

    try { 
      const result = await cvService.ICvData(userId);
      console.log({result});
      setCvData(result.cvData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Search failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsCvLoading(false);
    }
  }, []);

  const searchFullCvData = useCallback(async () => {
    setIsCvLoading(true);
    setError(null);

    try { 
      const result = await cvService2.ICvData();
      console.log({result});
      setCvData(result.cvData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Search failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsCvLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCvData(null);
    setError(null);
  }, []);

  return { cvData, isCvLoading, error, searchCvData, reset, searchFullCvData };
}