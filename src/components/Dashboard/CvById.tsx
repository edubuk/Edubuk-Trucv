
import { useUserData } from "@/context/AuthContext";

import { useCvData } from "@/hooks/useCvData";
import { CvSkeleton } from "../SkeletonLoader/CvSkeleton";
import CvOutputPage from "@/pages/CvOutputPage";


const CvById = () => {
  const {user} = useUserData();
  const {isCvLoading} = useCvData();

  if(isCvLoading){
    return (
      <CvSkeleton />
    )
  }
  return (
  <CvOutputPage userId={user?._id || ""} />
  );
};

export default CvById;
