import { useEffect, useState } from "react";
import {
  Menu,
  X,
  FileText,
  FolderOpen,
  Image as NftIcon,
} from "lucide-react";

import AdminUserProfilesPage from "./Admin";
import { useUserData } from "@/context/AuthContext";
import AccessDeniedPage from "@/pages/AccessDenied";
import Hackathon from "./Hackathon";
import CVData from "./CVData";

const AdminDashBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<boolean>(true);
  const {user} = useUserData();
  const [selected, setSelected] = useState<"users" | "hackathon" | "cvData" | "cv" | "nft" >("users");

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
    id:"users" | "hackathon" | "cvData" | "cv" | "nft" ;
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
            Icon={FileText}
            onClick={()=>setSelected("hackathon")}
          />
          <NavItem
            id="cvData"
            label="Manage CV Data"
            Icon={NftIcon}
            onClick={()=>setSelected("cvData")}
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
         <Hackathon />
        )}

        {selected === "cvData" && (
        <CVData />
        )}
      </main>
    </div>:<AccessDeniedPage />}
    </>
  );
};

export default AdminDashBoard;
