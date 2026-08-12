import { API_BASE_URL } from "@/main";
import { useMutation, useQuery } from "react-query";

export const useGetLinkdeinProfile = () => {
  const getLinkdeinProfile = async (profileUrl: string): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/scraper/linkdein-profile-scraper?profileUrl=${profileUrl}&useAI=true`,
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
  if (!localStorage.getItem("linkedInCvData") && cvData !== undefined) {
    localStorage.setItem("linkedInCvData", JSON.stringify(cvData));
  }
  return { getLinkdeinProfileData, isLoading, cvData };
};

export const useCheckUserHasCreatedTrucvAndOnboardedOnTrujobs = () => {
  const checkUserHasCreatedTrucvAndOnboardedOnTrujobs =
    async (): Promise<any> => {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/trujobs/check-user-onboarded-on-trujobs`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Could not check trujobs onboarding status!");
      }
      return response.json();
    };

  const {
    mutateAsync: checkUserHasCreatedTrucvAndOnboardedOnTrujobsData,
    isLoading,
    data,
  } = useMutation(checkUserHasCreatedTrucvAndOnboardedOnTrujobs, {
    onSuccess: () => {
      console.log(
        "Checked user has created trucv and onboarded on trujobs successfully",
      );
    },
  });

  return {
    checkUserHasCreatedTrucvAndOnboardedOnTrujobsData,
    isLoading,
    data,
  };
};

export const useOnBoardCandidateOnTruJobsInOneClick = () => {
  const onBoardCandidateOnTruJobsInOneClick = async (): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/trujobs/onboard-candidate-on-trujobs`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        data?.message || "Could not onboard candidate on trujobs!",
      );
    }
    return data;
  };

  const {
    mutateAsync: onBoardCandidateOnTruJobsInOneClickData,
    isLoading,
    data,
  } = useMutation(onBoardCandidateOnTruJobsInOneClick, {
    onSuccess: () => {
      console.log("Onboarded candidate on trujobs successfully");
    },
  });

  return {
    onBoardCandidateOnTruJobsInOneClickData,
    isLoading,
    data,
  };
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
      `${API_BASE_URL}/api/v1/scraper/get-user-all-imported-linkdein-profiles`,
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
