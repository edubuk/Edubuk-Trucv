import { Navigate } from "react-router-dom";
// import CvFormContainer from "@/components/CvFormContainer";
import { useUserData } from "@/context/AuthContext";
import CVBuilder from "@/CvBuilder/CvBuilder";

const CreateCv = () => {
  const { user,loading } = useUserData();
  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-2xl text-[#03257e]">Please hold on for a few seconds...</p>
      </div>
    );
  }

  return user?.subscriptionPlan=== "pro"?<CVBuilder />:<Navigate to="/pricing" replace />;
};

export default CreateCv;
