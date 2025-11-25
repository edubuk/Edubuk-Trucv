import { API_BASE_URL } from "@/main";
import React, { createContext, useContext,useEffect, useState } from "react";


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
  address:string;
  userImageUrl:string;
  yearOfExp:string;
  githubUrl:string;
  linkedInUrl:string;
  selfAttested:boolean;
  updatedAt:string;
  profession:"student" | "employee";
  profileSummary:string;
  _id?: string;                    // optional because it may be missing in some flows
  subscriptionPlan?: "free" | "basic" | "pro"; // optional union syntax fixed
  endDate?: string;
}

interface UserContextType {
  user: IUSER | null;
  loading:boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUSER | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDetails = async()=>{
    try {
      setLoading(true);
      const [data1,data2] = await Promise.all([
        fetch(`${API_BASE_URL}/user/profile`,{
          method:"GET",
          credentials: "include"
        }),
        fetch(`${API_BASE_URL}/user/subscription`, {
          method: "GET",
          credentials: "include",
        })
      ]);
      const userData = await data1.json();
      const subscription = await data2.json();
      if(userData && userData.success)
      {
        // setUser({name:userData?.user?.name,email:userData?.user?.email,phoneNumber:userData?.user?.phoneNumber,address:userData.user.address,roles:userData?.user?.roles,uuid:userData?.user?.uuid,_id:userData?.user?._id})
        setUser(userData.user);
      }
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
    finally{setLoading(false)};
  }

  useEffect(() => {
    // load both — order doesn't strictly matter because subscription update uses functional setUser
    fetchDetails();
  }, []);

  return (
    <UserContext.Provider value={{user,loading}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserData must be used within UserContextProvider");
  return context;
};
