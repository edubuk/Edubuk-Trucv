import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserData } from "@/context/AuthContext";
// import ThreeDotLoader from "./components/Loader/ThreeDotLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading,subscriptionDataLoading } = useUserData();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!(loading || subscriptionDataLoading)) {
      let current = 0;
      interval = setInterval(() => {
        current += 3; // increase progress by 5% every 100ms → ~2s total
        setProgress(current);
        if (current >= 100) {
          clearInterval(interval);
          setDone(true);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [loading,subscriptionDataLoading]);

  if (loading || !done || subscriptionDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <p className="text-center text-[#03257e]">Just hold on for few seconds</p>
        <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
          <div
            className="h-2 bg-[#006666] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-500">{Math.min(progress, 100)}%</p>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
