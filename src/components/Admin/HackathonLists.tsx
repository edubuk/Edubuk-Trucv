import useHackathons from "@/hooks/useHackathons";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import IssuedCertificatesList from "./IssuedCertificatesList";
//import toast from "react-hot-toast";
import { Edit } from "lucide-react";
//import RegisterHackathon from "./RegisterHackathon";

type HackathonStatus = "active" | "inactive" | "completed";

interface Hackathon {
  _id?: string;
  hackathonName: string;
  organization: string;
  emailId?: string;
  startDate?: string;
  endDate?: string;
  status?: HackathonStatus;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HackathonListProps {
  hackathon: Hackathon;
  hackathonData: [];
  setHackathonData: (data: any) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  totalCert: number;
  setTotalCert: (cert: number) => void;
  isFetching: boolean;
  setIsFetching: (fetching: boolean) => void;
  deleteHandler: (id: string) => Promise<any>;
  loading: boolean;
  idToDelete: string;
  getCertificates: (id: string) => Promise<any>;
  currPage: number;
  setCurrPage: (page: number) => void;
}

const SkeletonCard = () => {
  return (
    <div className="p-5 rounded-2xl shadow-md bg-white animate-pulse space-y-4 border border-gray-100">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status?: HackathonStatus }) => {
  const base = "px-3 py-1 text-xs font-medium rounded-full";

  const styles = {
    active: "bg-[#006666]/10 text-[#006666]",
    inactive: "bg-gray-100 text-gray-500",
    completed: "bg-[#03257e]/10 text-[#03257e]",
  };

  return (
    <span className={`${base} ${styles[status || "active"]}`}>
      {status || "active"}
    </span>
  );
};

const HackathonCard = ({hackathon, deleteHandler, loading, idToDelete, getCertificates, currPage, setCurrPage, hackathonData, setHackathonData, totalPages, setTotalPages, totalCert, setTotalCert }: HackathonListProps) => {
    const [showCertificates, setShowCertificates] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    //const [isUpdating, setIsUpdating] = useState(false);

    useEffect(()=>{
        getCertificates(hackathon._id as string);
    },[currPage])

    const editPopup = () => {
        setShowUpdateForm(true);
        //setIsUpdating(true);
    }

  
  return (
    <div className="p-5 rounded-2xl shadow-md bg-white hover:shadow-lg transition duration-200 flex flex-col justify-between border border-gray-100">
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#03257e]">
            {hackathon.hackathonName}
          </h2>
          <div className="flex gap-2 items-center">
          <button className="text-white bg-[#f14419] px-3 py-1 rounded-full text-sm font-medium" onClick={() => deleteHandler(hackathon._id || "")}>{loading&&(idToDelete === hackathon._id) ? "Deleting..." : "Delete"}</button>
          <Edit onClick={editPopup} className="w-5 h-5 text-[#006666] cursor-pointer" />
          </div>
        </div>

        <p className="text-sm text-[#006666] font-medium">
          {hackathon.organization} <br></br>
          <span>{hackathon.emailId}</span>
        </p>

        {hackathon.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {hackathon.description}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <StatusBadge status={hackathon.status} />

        <span className="text-xs text-gray-400">
          {hackathon.startDate
            ? `${new Date(hackathon.startDate).toLocaleDateString()} → ${hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : ""}`
            : "No dates"}
        </span>
      </div>
      <button 
      className="text-white bg-[#006666] px-3 py-1 rounded-full text-sm font-medium mt-2"
      onClick={() => {
        setShowCertificates(true);
        getCertificates(hackathon._id || "");
      }}>
        Get Certificates List
      </button>
      {showUpdateForm && <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      {/* <RegisterHackathon 
        heading="Update Hackathon" 
        setShowUpdateForm={setShowUpdateForm}
        buttonLabel="Update Hackathon"
        hackathonId={hackathon._id || ""}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        hackathonName={hackathon.hackathonName}
        hackathonDescription={hackathon.description}
        hackathonStartDate={hackathon.startDate ? new Date(hackathon.startDate) : undefined}
        hackathonEndDate={hackathon.endDate ? new Date(hackathon.endDate) : undefined}
        hackathonOrganization={hackathon.organization}
        emailId={hackathon.emailId || ""}
        status={hackathon.status}
        /> */}
      </div>}
      {showCertificates && (
      <IssuedCertificatesList 
        loading={loading} 
        currPage={currPage}
        setCurrPage={setCurrPage}
        hackathonData={hackathonData}
        setHackathonData={setHackathonData}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        totalCert={totalCert}
        setTotalCert={setTotalCert}
        setShowCertificates={setShowCertificates}
      />
      )}
    </div>
  );
};

const HackathonList = () => {
    const { data, isLoading,refetch } = useHackathons();    
    const [loading, setLoading] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string>("");
    const [currPage,setCurrPage] = useState<number>(1);
    const [hackathonData,setHackathonData] = useState<any>(null);
    const [totalPages,setTotalPages] = useState<number>(1);
    const [totalCert,setTotalCert] = useState<number>();
    const [isFetching,setIsFetching] = useState(true);
    
      const deleteHackathon = async (id: string) => {
        try {
          setLoading(true);
          setIdToDelete(id);
          const response = await api.delete(`/admin/delete-hackathon/${id}`);
          console.log("Response:", response);
          refetch();
          return response.data;
        } catch (err: any) {
          console.error("Error deleting hackathon:", err);
          return null;
        } finally {
          setLoading(false);
        }
      };

      const getCertificates = async (hackathonId: string) => {
        try {
          setLoading(true);
          const response = await api.get(`/admin/get-hackathon-certificates/${hackathonId}?page=${currPage}`);
          console.log("Response:", response);
          if(response.data){
            setHackathonData(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
            setTotalCert(response.data.pagination.totalCertificate);
            setIsFetching(false);
          }
        } catch (err: any) {
          console.error("Error getting certificates:", err);
          return null;
        } finally {
          setLoading(false);
        }
      }; 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#03257e] mb-6">
        Hackathons
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : data.map((hackathon, idx) => (
              <HackathonCard 
              key={idx} 
              hackathon={hackathon} 
              deleteHandler={deleteHackathon} 
              loading={loading} 
              idToDelete={idToDelete} 
              currPage={currPage}
              setCurrPage={setCurrPage}
              getCertificates={getCertificates}
              hackathonData={hackathonData}
              setHackathonData={setHackathonData}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              totalCert={totalCert || 0}
              setTotalCert={setTotalCert}
              isFetching={isFetching}
              setIsFetching={setIsFetching}
              />
            ))}
      </div>

      {!isLoading && data.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No hackathons available.
        </p>
      )}
    </div>
  );
};

export default HackathonList;