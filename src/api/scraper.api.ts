import { API_BASE_URL } from "@/main";
import { useMutation, useQuery } from "react-query";


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
  if(!localStorage.getItem("linkedInCvData") && cvData!==undefined) {
    localStorage.setItem("linkedInCvData", JSON.stringify(cvData));
  }
  return { getLinkdeinProfileData, isLoading, cvData };
};

export interface IImportedProfiles {
  _id: string;
  userId: string;
  linkdeinScrapedUrl: string;
  scrapedAt: Date;
  fullName: string;
  imgUrl: string;
}
export const useGetALLImportedProfiles = () => {
  const getAllLinkdeinProfileReq = async (): Promise<IImportedProfiles[]> => {
    const response = await fetch(
      `${API_BASE_URL}/scraper/get-user-all-imported-linkdein-profiles`,
      {
        credentials: "include",
      },
    );
    if (!response.ok) {
      throw new Error("Could not get all imported linkedin profiles");
    }
    return response.json();
  };
  const { data, isLoading } = useQuery(
    ["getAllLinkdeinProfileReq"],
    getAllLinkdeinProfileReq,
  );

  return { profiles: data || [], isLoading };
};
