import { API_BASE_URL } from "@/main";
import React, { createContext, useContext, useEffect, useState } from "react";


// interface ISubscriptionData {
//   userEmail: string;
//   subscriptionPlan: "free" | "basic" | "pro";
// }

interface IUSER {
  name: string;
  email: string;
  phoneNumber: string;
  roles:string;                       // array of roles
  uuid: string;
  _id?: string;                          // optional because it may be missing in some flows
  subscriptionPlan?: "free" | "basic" | "pro"; // optional union syntax fixed
  endDate?: string;
}

interface UserContextType {
  user: IUSER | null;
  loading:boolean;
  subscriptionDataLoading:boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUSER | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionDataLoading,setSubscriptionDataLoading]= useState<boolean>(false);
  //const [userData, setUserData] = useState<ISubscriptionData | null>(null);

  const getUser = async()=>{
    try {
      setLoading(true);
      const user = await fetch(`${API_BASE_URL}/user/profile`,{
        method:"GET",
        credentials: "include"
      })
      const userData = await user.json();
      if(userData && userData.success)
      {
        setUser({name:userData?.user?.name,email:userData?.user?.email,phoneNumber:userData?.user?.phoneNumber,roles:userData?.user?.roles,uuid:userData?.user?.uuid,_id:userData?.user?._id})
      }
      console.log("userData", userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }finally{
      setLoading(false);
    }
  }

  const userSubscription = async () => {
    try {
      setSubscriptionDataLoading(true)
      const res = await fetch(`${API_BASE_URL}/user/subscription`, {
        method: "GET",
        credentials: "include",
      });
      const subscription = await res.json();

      if (subscription && subscription.success) {
        // update user state safely (functional update to avoid stale closure)
        setUser((prev) =>
          prev
            ? { ...prev, subscriptionPlan: subscription.subscription.subscriptionPlan, endDate: subscription.subscription.endDate }
            : prev
        );
      }
    } catch (error) {
      console.error("Error fetching user subscription:", error);
    }
    finally{setSubscriptionDataLoading(false)};
  }

  useEffect(() => {
    // load both — order doesn't strictly matter because subscription update uses functional setUser
    getUser();
    userSubscription();
    console.log("user",user)
  }, []);

  return (
    <UserContext.Provider value={{user,loading,subscriptionDataLoading}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserData must be used within UserContextProvider");
  return context;
};
