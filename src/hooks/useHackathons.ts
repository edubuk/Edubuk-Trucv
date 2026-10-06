import api from "@/lib/api";
import { useEffect, useState } from "react";

interface Hackathon {
  hackathonName: string;
  organization: string;
  emailId?: string;
  startDate?: string;
  endDate?: string;
  status?: "active" | "inactive" | "completed";
  description?: string;
}

const useHackathons = () => {
  const [data, setData] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHackathons = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get("/hackathon/get-hackathons");
      const hackathons = response.data?.hackathons || [];

      setData(hackathons);
      return hackathons;
    } catch (err: any) {
      console.error("Error fetching hackathons:", err);
      setError(err.message || "Something went wrong");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // auto-fetch (optional but recommended for list pages)
  useEffect(() => {
    getHackathons();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: getHackathons,
  };
};

export default useHackathons;