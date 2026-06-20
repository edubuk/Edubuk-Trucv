import { useEffect, useState } from "react";
import {
  Menu,
  X,
  FolderOpen,
  Image as NftIcon,
  ShieldCheck,
  Zap,
  File,
  UserCogIcon,
  Tag,
} from "lucide-react";

import AdminUserProfilesPage from "./Admin";
import { useUserData } from "@/context/AuthContext";
import CVData from "./CVData";
import WhitelistIssuer from "./ManageIssuer";
import DocumentCard from "./ManageRequestDoc";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ManageHackathon from "./ManageHackathon";
import AccessDeniedPage from "@/pages/AccessDenied";
import CreateUser from "./CreateUser";
import CouponManager from "./CouponManager";

const AdminDashBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [requestedDoc,setRequestedDoc] = useState<[]>([]);
  const {user} = useUserData();
  const [selected, setSelected] = useState<"users" | "hackathon" | "cvData" | "cv" | "nft" | "issuer" | "requestedDoc"|"create-user"|"coupon-manager">("users");

    const fetchRequestDocHandler = async() => {
    setSelected("requestedDoc");
    setSidebarOpen(false);
    try {
      setIsFetching(true);
      const res = await api.get("/admin/get-requested-doc");
      console.log("doc res",res);
      if (res.data.success) {
        console.log(res.data.data);
        setRequestedDoc(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch requested doc");
    } finally {
      setIsFetching(false);
    }
  };

  const Users = () => {
    setSelected("users");
    setRefreshKey(true);
  };


  useEffect(() => {
    Users();
  }, [refreshKey]);

  const NavItem = ({
    id,
    label,
    Icon,
    onClick,
  }: {
    id:"users" | "hackathon" | "cvData" | "cv" | "nft" | "issuer" | "requestedDoc" | "create-user" | "coupon-manager";
    label: string;
    Icon: any;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
        ${
          selected === id
            ? "bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] text-white shadow"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <>
    {user?.roles === "admin"? <div className="flex h-screen overflow-hidden bg-gray-50 relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
       className={`fixed lg:static z-50 top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 px-4 py-6
      transform transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-[#03257e]">Dashboard</h2>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem
            id="users"
            label="Users Profile"
            Icon={FolderOpen}
            onClick={Users}
          />
          <NavItem
            id="hackathon"
            label="Manage Hackathon"
            Icon={Zap}
            onClick={()=>setSelected("hackathon")}
          />
          <NavItem
            id="cvData"
            label="Manage CV Data"
            Icon={NftIcon}
            onClick={()=>setSelected("cvData")}
          />
          <NavItem
            id="issuer"
            label="Manage Issuer"
            Icon={ShieldCheck}
            onClick={()=>setSelected("issuer")}
          />
            <NavItem
              id="requestedDoc"
              label="Manage Requested Doc"
              Icon={File}
              onClick={fetchRequestDocHandler}
            />
            <NavItem
              id="create-user"
              label="Create User"
              Icon={UserCogIcon}
              onClick={()=>setSelected("create-user")}
            />
            <NavItem
              id="coupon-manager"
              label="Coupon Manager"
              Icon={Tag}
              onClick={()=>setSelected("coupon-manager")}
            />
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 h-screen overflow-y-auto w-full p-4 sm:p-6">
        {/* Mobile Header */}
        <div className="flex items-center gap-3 mb-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg border border-gray-200 bg-white"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Dashboard
          </h1>
        </div>

        {/* {isFetching && (
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Loader2 className="animate-spin" size={18} />
            Loading...
          </div>
        )} */}

        {selected === "users" && (
          <AdminUserProfilesPage />
        )}

        {selected === "hackathon" && (
         <ManageHackathon />
        )}

        {selected === "cvData" && (
        <CVData />
        )}
        
        {selected === "issuer" && (
        <WhitelistIssuer />
        )}
        {
          selected==="requestedDoc"&&(
            <DocumentCard 
            requestedDoc={requestedDoc}
            isFetching={isFetching}
            />
          )
        }
        {selected === "create-user" && (
        <CreateUser />
        )}
        {selected === "coupon-manager" && (
        <CouponManager />
        )}
      </main>
    </div>:<AccessDeniedPage />}
    </>
  );
};

export default AdminDashBoard;
