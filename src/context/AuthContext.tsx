import api from "@/lib/api";
import React, { createContext, useContext, useEffect, useState } from "react";
interface IUSER {
  name: string;
  email: string;
  phoneNumber: string;
  roles: string; // array of roles
  uuid: string;
  address: string;
  userImageUrl: string;
  yearOfExp: string;
  githubUrl: string;
  linkedInUrl: string;
  selfAttested: boolean;
  updatedAt: string;
  profession: "student" | "employee";
  profileSummary: string;
  _id?: string; // optional because it may be missing in some flows
  subscriptionPlan?: "free" | "basic" | "pro"; // optional union syntax fixed
  subscriptionExpiry?: string;
  isHackathonUser?:boolean;
  tag?:string;
  rank?:string;
}

interface UserContextType {
  user: IUSER | null;
  loading: boolean;
  setLoading:React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<IUSER | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDetails = async () => {
    try {
      //setLoading(true);
      const [data1, data2, data3] = await Promise.allSettled([
        api.get("/user/profile"),
        api.get("/user/subscription"),
        api.get("/hackathon/is-email-present")
      ]);

      const userData = data1.status === "fulfilled" ? data1.value.data : null;

      const subscription = data2.status === "fulfilled" ? data2.value.data : null;
      
      const isMatch = data3.status === "fulfilled" ? data3.value.data : null;
      console.log("User:", userData);
      console.log("Subscription:", subscription);

      console.log("userData", userData);
      if (userData && userData.success) {
        console.log("userData", userData);
        // setUser({name:userData?.user?.name,email:userData?.user?.email,phoneNumber:userData?.user?.phoneNumber,address:userData.user.address,roles:userData?.user?.roles,uuid:userData?.user?.uuid,_id:userData?.user?._id})
        setUser(userData.user);
      }
      if (subscription && subscription.success) {
        // update user state safely (functional update to avoid stale closure)
        setUser((prev) =>
          prev
            ? {
                ...prev,
                subscriptionPlan: subscription.subscription.subscriptionPlan,
                subscriptionExpiry: subscription.subscription.endDate,
                isHackathonUser: isMatch.match,
                tag: isMatch.tag,
                rank: isMatch.rank
              }
            : prev
        );
      }
    } catch (error) {
      console.error("Error fetching user subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load both — order doesn't strictly matter because subscription update uses functional setUser
    fetchDetails();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading,setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserData must be used within UserContextProvider");
  return context;
};
