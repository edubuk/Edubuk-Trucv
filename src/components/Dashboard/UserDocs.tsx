import React, { useState } from "react";
import { ExternalLink, ShieldCheck, FileText,UserCircle} from "lucide-react";

import { useUserData } from "@/context/AuthContext";
import StatusBadge from "@/CvBuilder/StatusBadge";
import ResendEmail from "../../pages/ResendEmail";
import UserDocsSkeleton from "./UserDocsSkeleton";

const COLOR_PRIMARY = "#03257e";

export interface IUserDoc{
  _id:string;
  docType:string;
  title:string;
  organisation:string;
  docUrl:string;
  meta:object;
  status:VerificationStatus;
  createdAt:string;
  verified:boolean;
  verifiedThrough:VerificationMethod
}

export interface IEducationDoc {
  _id:string;
  userId:string;
  eduDocId:string,
  level:string,
  boardNameOrDegree:string,
  institutionName:string,
  gpa:string,
  duration:{from:string,to:string},
  selfAttested:boolean,
  isEmailSend?:boolean,
  issuerEmailId?:string,
  verified?:boolean,
  status?:VerificationStatus,
  verifiedThrough?:VerificationMethod,
  docUri?:string,
  createdAt:string,
  updatedAt:string,
}

export interface IExperienceDoc{
    _id:string;
    userId:string,
    expDocId:string,
    companyName:string,
    jobRole:string,
    duration:{from:string,to:string},
    skills:string,
    description:string,
    selfAttested:boolean,
    isEmailSend?:boolean,
    issuerEmailId?:string,
    verified?:boolean,
    status?:VerificationStatus,
    verifiedThrough?:VerificationMethod,
    docUri?:string,
    createdAt:string,
    updatedAt:string,
}
export interface IAwardDoc{
    _id:string;
    userId:string,
    awardDocId:string,
    name:string,
    awardDescription:string,
    organisation:string,
    selfAttested:boolean,
    isEmailSend?:boolean,
    issuerEmailId?:string,
    verified?:boolean,
    status?:VerificationStatus,
    verifiedThrough?:VerificationMethod,
    docUri?:string,
    createdAt:string,
    updatedAt:string,
}

// Types
export type VerificationStatus = "verified" | "pending" | "rejected" | "inProgress";
export type VerificationMethod = "DigiLocker" | "Email" | "Third Party" | null;


// UI bits


const MethodChip: React.FC<{ method: VerificationMethod }> = ({ method }) => {
  const label = method === "DigiLocker" ? "DigiLocker" : method === "Email" ? "Email" : method === "Third Party" ? "Third Party" : "Not set";
  const color = method ? COLOR_PRIMARY : "#666";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border"
      style={{ borderColor: color, color }}
    >
      <ShieldCheck className="h-3 w-3" /> {label}
    </span>
  );
};

export default function UserDocs({educationDocs,experienceDocs,awardDocs,setRefreshKey,isFetching}: 
  {educationDocs: IEducationDoc[],experienceDocs:IExperienceDoc[],awardDocs:IAwardDoc[],setRefreshKey:React.Dispatch<React.SetStateAction<boolean>>,isFetching:boolean}) 
  {
  const [openModel,setOpenModel] = useState(false);
  const [docId,setDocId] = useState<string>("");
  const {user} = useUserData();
  const [info,setInfo] = useState({
    org:"",
    roleOrLevel:"",
    docType:"",
  })
  // console.log("edu data",educationDocs)

  // const verifiedCount = useMemo(() => educationDocs?.reduce((sum, u) => (sum + (u.status==="verified"?1:0)), 0), [educationDocs]);
  // const totalCerts = useMemo(() => educationDocs?.reduce((sum) => sum + 1, 0), [educationDocs]);

  function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  }

  const modelHandler = (id:string,org:string,roleOrLevel:string,docType:string)=>{
    setOpenModel(true);
    setDocId(id);
    setInfo({
      org,
      roleOrLevel,
      docType
    })
  }

  if(isFetching)
  {
    return(
      <UserDocsSkeleton />
    )
  }



  return (
    <div className="min-h-screen w-full" style={{ background: "#f7f8fb" }}>

      {/* Users list */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {user&&
          <div key={user?._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Collapsible header (acts like profile row) */}
            <div
              className="w-full flex items-center justify-between px-4 py-3 sm:px-6 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 text-left">
                <UserCircle className="h-12 w-12 rounded-full object-cover shadow text-[#03257e]" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">{user.name}</h2>
                  <div className="text-sm text-gray-600">{user.email} • {user.phoneNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#03257e] text-xs sm:text-sm">
            {/* <BadgeCheck className="h-4 w-4 text-green-500" /> */}
            {/* <span>{verifiedCount}/{totalCerts} verified</span> */}
          </div>
            </div>

            {/* Smooth expandable section with ORIGINAL certificate card design */}
            <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden`}>
              <div className="px-4 sm:px-6 pb-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 mt-2">
                  <FileText className="h-5 w-5" /> Uploaded Certificates
                </h3>
                {educationDocs?.length===0?<div>
                  <p className="text-[#f14419] text-center mt-2 bg-gray-200 p-8 rounded">No education docs uploaded</p>
                </div>:<p className="text-[#03257e]"><span className="text-[#f14419]">Note:</span> If any document is got rejected, you can resend correct document by clicking on Resend Document button</p>}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {educationDocs?.map((cert) => (
                    <div
                      key={cert?.eduDocId}
                      className="group bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
                      aria-label={`Open ${cert.level}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm text-gray-500">{cert.institutionName || "Issuer —"}</div>
                          <div className="mt-0.5 text-base font-semibold text-gray-900">{cert.level}</div>
                        </div>
                        <StatusBadge status={cert?.status||"pending"} isEmailSend={cert.isEmailSend}/>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <MethodChip method={cert?.verifiedThrough!}/>
                        <div className="text-xs text-gray-500">{formatDate(cert?.createdAt)}</div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                      {!cert.verified&&<button 
                      onClick={()=>modelHandler(cert._id,cert.boardNameOrDegree,cert.level,"education")}
                      className="text-xs bg-[#008888] text-white shadow-sm px-2 py-1 rounded cursor-pointer ">Resend Document </button>}
                      {cert.docUri&&cert?.docUri.includes("https://")&&<a href={cert.docUri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                        View Document <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>}
                      </div>
                    </div>
                  ))}
                  {experienceDocs?.map((cert) => (
                    <button
                      key={cert?.expDocId}
                      className="group bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
                      aria-label={`Open ${cert.jobRole}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm text-gray-500">{cert.companyName || "Issuer —"}</div>
                          <div className="mt-0.5 text-base font-semibold text-gray-900">{cert.jobRole}</div>
                        </div>
                        <StatusBadge status={cert?.status || "pending"} isEmailSend={cert.isEmailSend} />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <MethodChip method={cert?.verifiedThrough!}/>
                        <div className="text-xs text-gray-500">{formatDate(cert?.createdAt)}</div>
                      </div>
                     <div className="flex justify-between items-center mt-4">
                      {!cert.verified&&<button 
                      onClick={()=>modelHandler(cert._id,cert.jobRole,cert.companyName,"experience")}
                      className="text-xs bg-[#008888] text-white shadow-sm px-2 py-1 rounded cursor-pointer ">
                      Resend Document </button>}
                      {cert.docUri&&cert?.docUri.includes("https://")&&<a href={cert.docUri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                        View Document <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>}
                      </div>
                    </button>
                  ))}
                  {awardDocs?.map((cert) => (
                    <button
                      key={cert?.awardDocId}
                      className="group bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
                      aria-label={`Open ${cert.name}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm text-gray-500">{cert.organisation || "Issuer —"}</div>
                          <div className="mt-0.5 text-base font-semibold text-gray-900">{cert.name}</div>
                        </div>
                        <StatusBadge status={cert?.status || "pending"} isEmailSend={cert.isEmailSend} />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <MethodChip method={cert?.verifiedThrough!}/>
                        <div className="text-xs text-gray-500">{formatDate(cert?.createdAt)}</div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                      {!cert.verified&&<button 
                      onClick={()=>modelHandler(cert._id,cert.name,cert.organisation,"award")}
                      className="text-xs bg-[#008888] text-white shadow-sm px-2 py-1 rounded cursor-pointer ">
                      Resend Document 
                      </button>}
                      {cert.docUri&&cert?.docUri.includes("https://")&&<a href={cert.docUri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                        View Document <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ResendEmail openModel={openModel} setOpenModel={setOpenModel} docId={docId} setDocId={setDocId} info={info} setRefreshKey={setRefreshKey}/>
          </div>
        }
      </main>

    </div>
  );
}
