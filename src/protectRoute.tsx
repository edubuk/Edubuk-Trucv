
import { Navigate } from "react-router-dom";
import { useUserData } from "@/context/AuthContext";
import ThreeDotLoader from "./components/Loader/ThreeDotLoader";


const ProtectedRoute = ({children}:{children:React.ReactNode}) => {
  const {user,loading} = useUserData();
  if(loading)
  {
    return <div><ThreeDotLoader w={100} h={100} yPos={"center"}/></div>
  }
  console.log("user",user)
  return (user?<>{children}</>:<Navigate to="/login"/>
  );
};


export default ProtectedRoute;