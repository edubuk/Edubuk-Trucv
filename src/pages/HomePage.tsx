import { Navigate } from "react-router-dom";
import CvFormContainer from "@/components/CvFormContainer";
import { useUserData } from "@/context/AuthContext";

const HomePage = () => {
  const { user,loading,subscriptionDataLoading } = useUserData(); // assuming your AuthContext provides loading state

  // 1️⃣ While loading user info, show loader (prevents flicker/false redirect)
  if (loading || subscriptionDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-[#03257e]">Please hold on for a few seconds...</p>
      </div>
    );
  }

  // 2️⃣ If user not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ If user doesn’t have a pro subscription, redirect to pricing
  if (user.subscriptionPlan !== "pro") {
    return <Navigate to="/pricing" replace />;
  }

  // 4️⃣ Otherwise, show main component
  return <CvFormContainer />;
};

export default HomePage;
