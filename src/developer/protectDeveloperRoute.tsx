import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "@/lib/api";

const ProtectDeveloperRoute = () => {
  const [status, setStatus] = useState<"checking" | "ok" | "fail">("checking");

  useEffect(() => {
    api
      .get("/developer/auth")
      .then(({ data }) => setStatus(data?.success ? "ok" : "fail"))
      .catch(() => setStatus("fail"));
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center h-screen text-[#03257e]">
        Checking developer session...
      </div>
    );
  }

  return status === "ok" ? <Outlet /> : <Navigate to="/developer/sign-in" replace />;
};

export default ProtectDeveloperRoute;
