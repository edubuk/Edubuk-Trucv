// hooks/useSearchProfiles.ts
import { useState, useCallback } from "react";
import { searchService, type SearchProfile } from "@/api/search.apis";
import { toast } from "react-hot-toast";

interface UseSearchProfilesReturn {
  users: SearchProfile[];
  isLoading: boolean;
  error: string | null;
  searchProfiles: (query: string,page?:number) => Promise<void>;
  totalProfiles?:number;
  reset: () => void;
  setTotalProfiles:(totalProfiles:number)=>void
}

export function useSearchProfiles(): UseSearchProfilesReturn {
  const [users, setUsers] = useState<SearchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProfiles,setTotalProfiles] = useState<number>();
  const [error, setError] = useState<string | null>(null);

  const searchProfiles = useCallback(async (query: string,page?:number) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try { 
      const result = await searchService.searchProfiles(query==="default"?"":query,page);
      setUsers(result.profiles);
      console.log({result});
      if(result?.totalProfiles?.[0])
      {
        console.log("total profile",result?.totalProfiles)
        setTotalProfiles(result.totalProfiles[0].count)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Search failed";
      console.log("err",err)
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUsers([]);
    setError(null);
  }, []);

  return { users, isLoading,totalProfiles, error, searchProfiles, reset,setTotalProfiles };
}