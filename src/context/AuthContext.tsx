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
  exp:number;
  updatedAt: string;
  profession: "student" | "employee";
  profileSummary: string;
  _id?: string; // optional because it may be missing in some flows
  subscriptionPlan?: "free" | "basic" | "pro"; // optional union syntax fixed
  subscriptionExpiry?: string;
  isHackathonUser?:boolean;
  tag?:string;
  rank?:string;
  collegeName?:string;
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
      const [data1] = await Promise.allSettled([
        api.get("/user/profile"),
      ]);

      const userData = data1.status === "fulfilled" ? data1.value.data : null;  

      if (userData && userData.success) {
        setUser({...userData.user, exp: parseInt(userData.exp)});
      }
      console.log("userData", userData);
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
