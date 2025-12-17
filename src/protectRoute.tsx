import { Navigate } from "react-router-dom";
import { useUserData } from "@/context/AuthContext";
import ThreeDotLoader from "./components/Loader/ThreeDotLoader";
// import ThreeDotLoader from "./components/Loader/ThreeDotLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading} = useUserData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ThreeDotLoader w={100} h={100} yPos={"center"}/>
        <p className="text-center text-xl text-[#03257e] mb-10">Please hold on for a few seconds...</p>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
