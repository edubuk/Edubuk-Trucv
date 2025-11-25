import { Navigate } from "react-router-dom";
import CvFormContainer from "@/components/CvFormContainer";
import { useUserData } from "@/context/AuthContext";

const HomePage = () => {
  const { user,loading } = useUserData();
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-[#03257e]">Please hold on for a few seconds...</p>
      </div>
    );
  }

  return user?.subscriptionPlan=== "pro"?<CvFormContainer />:<Navigate to="/pricing" replace />;
};

export default HomePage;
