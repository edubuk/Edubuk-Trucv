import { Navigate } from "react-router-dom";
import { useUserData } from "@/context/AuthContext";
import ThreeDotLoader from "./components/Loader/ThreeDotLoader";
// import ThreeDotLoader from "./components/Loader/ThreeDotLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading} = useUserData();
  // const [progress, setProgress] = useState(0);
  // const [done, setDone] = useState(false);

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;

  //   if (!(loading || subscriptionDataLoading)) {
  //     let current = 0;
  //     interval = setInterval(() => {
  //       current += 3; // increase progress by 5% every 100ms → ~2s total
  //       setProgress(current);
  //       if (current >= 100) {
  //         clearInterval(interval);
  //         setDone(true);
  //       }
  //     }, 100);
  //   }

  //   return () => clearInterval(interval);
  // }, [loading,subscriptionDataLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ThreeDotLoader w={100} h={100} yPos={"center"}/>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
