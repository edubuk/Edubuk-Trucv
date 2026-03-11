import { API_BASE_URL } from "@/main";
import { useMutation } from "react-query";

export const useGetLinkdeinProfile = () => {
  const getLinkdeinProfile = async (profileUrl: string): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/scraper/linkdein-profile-scraper?profileUrl=${profileUrl}&useAI=true`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    if (!response.ok) {
      throw new Error("Could not get linkdein profile!");
    }
    return response.json();
  };

  const {
    mutateAsync: getLinkdeinProfileData,
    isLoading,
    data,
  } = useMutation(getLinkdeinProfile, {
    onSuccess: () => {
      console.log("Imported linkdein profile successfully");
    },
  });
  const cvData = data?.data;
  return { getLinkdeinProfileData, isLoading, cvData };
};
