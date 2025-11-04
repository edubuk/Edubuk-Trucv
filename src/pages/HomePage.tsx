import CvFormContainer from "@/components/CvFormContainer";
import { useUserData } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
//import Header from "@/components/Header";

const HomePage = () => {
  const {user} = useUserData()
  return (
    <>
      {/* <Header /> */}
      {user?.subscriptionPlan === "pro"?<CvFormContainer />:<Navigate to="/pricing" />}
    </>
  );
};

export default HomePage;
