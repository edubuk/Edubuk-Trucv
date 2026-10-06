import { useEffect, useState } from "react";
import {
  Menu,
  X,
  FileText,
  FolderOpen,
  Image as NftIcon,
  Database,
} from "lucide-react";
import toast from "react-hot-toast";

import CvById from "./CvById";
import UserDocs from "./UserDocs";
import api from "@/lib/api";
//import Certificate from "./Certificate";
import { useUserData } from "@/context/AuthContext";
import OnChainSubmission from "./On-ChainSubmission";
import { useSearchParams } from "react-router-dom";
//import DocumentNFTCard from "@/components/Dashboard/DocumentNFTCard";

const DashBoard = () => {

  const [docRefresh, setDocRefresh] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {user} = useUserData();
  const [userDocs, setUserDocs] = useState({
    educations: [],
    experiences: [],
    awards: [],
  });

  //const [selected, setSelected] = useState<"cv" | "nft" | "docs" | "onchain">("docs");
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("tab") as "cv" | "docs" | "nft" | "onchain" | null || "docs";

  const getDocs = async () => {
    setSearchParams({ tab: "docs" });
    setSidebarOpen(false);
    try {
      setIsFetching(true);
      const res = await api.get("/doc/user-docs");
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setUserDocs(res.data.data);
    } catch {
      toast.error("Failed to fetch documents");
    } finally {
      setIsFetching(false);
    }
  };


  const fetchNFTsHandler = async() => {
    setSearchParams({ tab: "nft" });
    setSidebarOpen(false);
    // try {
    //   setIsFetching(true);
    //   const res = await api.get("/wallet/assets");
    //   console.log("asset res",res);
    //   if (res.data.success) {
    //     console.log(res.data.data);
    //     // setAssetIds(res.data.data);
    //   }
    // } catch (error) {
    //   toast.error("Failed to fetch assets");
    // } finally {
    //   setIsFetching(false);
    // }
  };

useEffect(() => {
  if (selected === "docs") getDocs();
  if (selected === "nft") fetchNFTsHandler();
}, [selected, docRefresh]);

  const handleTabChange = (tab: "cv" | "docs" | "nft" | "onchain") => {
    setSearchParams({ tab });
    setSidebarOpen(false);
  };


  const NavItem = ({
    id,
    label,
    Icon,
    onClick,
  }: {
    id: "docs" | "cv" | "nft" | "onchain";
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
    <div className="flex h-screen overflow-hidden bg-gray-50 relative">
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
            id="docs"
            label="My Documents"
            Icon={FolderOpen}
            onClick={() => handleTabChange("docs")}
          />
          <NavItem
            id="cv"
            label="My CV"
            Icon={FileText}
            onClick={() => handleTabChange("cv")}
          />
          <NavItem
            id="onchain"
            label="On-Chain Submission"
            Icon={Database}
            onClick={() => handleTabChange("onchain")}
          />
          {user?.isHackathonUser && <NavItem
            id="nft"
            label="Certification"
            Icon={NftIcon}
            onClick={fetchNFTsHandler}
          />}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 h-screen overflow-y-auto w-full p-1 sm:p-6">
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

        {selected === "cv" && (
          <CvById
          />
        )}

        {selected === "docs" && (
          <UserDocs
            educationDocs={userDocs.educations}
            experienceDocs={userDocs.experiences}
            awardDocs={userDocs.awards}
            setRefreshKey={setDocRefresh}
            isFetching={isFetching}
          />
        )}

        {/* {selected === "nft" && (
          <Certificate 
          cvData={cvData}
          />
        )} */}
        {selected === "onchain" && (
          <OnChainSubmission />
        )}
      </main>
    </div>
  );
};

export default DashBoard;
