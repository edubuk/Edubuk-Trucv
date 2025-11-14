import React, { useMemo} from "react";
import { CheckCircle, Clock, ExternalLink, ShieldCheck, FileText, BadgeCheck,UserCircle} from "lucide-react";

import { useUserData } from "@/context/AuthContext";
import { EducationFormValues, ExperienceFormValues } from "@/CvBuilder/cvSchema";

// Colors
const COLOR_PRIMARY = "#03257e"; // deep blue
const COLOR_TEAL = "#006666"; // teal
const COLOR_ACCENT = "#f14419"; // orange-red

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

// Types
export type VerificationStatus = "verified" | "pending" | "rejected" | "inProgress";
export type VerificationMethod = "DigiLocker" | "email" | "third_party" | null;


// UI bits
const StatusBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  if (status === "verified") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
        style={{ backgroundColor: COLOR_TEAL + "1a", color: COLOR_TEAL }}
      >
        <CheckCircle className="h-3.5 w-3.5" /> Verified
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
      style={{ backgroundColor: COLOR_ACCENT + "1a", color: COLOR_ACCENT }}
    >
      <Clock className="h-3.5 w-3.5" /> Pending
    </span>
  );
};

const MethodChip: React.FC<{ method: VerificationMethod }> = ({ method }) => {
  const label = method === "DigiLocker" ? "DigiLocker" : method === "email" ? "Email" : method === "third_party" ? "Third Party" : "Not set";
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

export default function UserDocs({educationDocs,experienceDocs}: {educationDocs: IEducationDoc[],experienceDocs:IExperienceDoc[]}) {
    const {user} = useUserData();
    console.log("edu data",educationDocs)

  const verifiedCount = useMemo(() => educationDocs?.reduce((sum, u) => (sum + (u.status==="verified"?1:0)), 0), [educationDocs]);
  const totalCerts = useMemo(() => educationDocs?.reduce((sum) => sum + 1, 0), [educationDocs]);

  function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  }



  return (
    <div className="min-h-screen w-full" style={{ background: "#f7f8fb" }}>

      {/* Users list */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">
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
            <BadgeCheck className="h-4 w-4 text-green-500" />
            <span>{verifiedCount}/{totalCerts} verified</span>
          </div>
            </div>

            {/* Smooth expandable section with ORIGINAL certificate card design */}
            <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden max-h-[1200px]`}>
              <div className="px-4 sm:px-6 pb-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 mt-2">
                  <FileText className="h-5 w-5" /> Uploaded Certificates
                </h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {educationDocs?.map((cert) => (
                    <button
                      key={cert?.eduDocId}
                      className="group bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
                      aria-label={`Open ${cert.level}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm text-gray-500">{cert.institutionName || "Issuer —"}</div>
                          <div className="mt-0.5 text-base font-semibold text-gray-900">{cert.level}</div>
                        </div>
                        <StatusBadge status={cert?.status||"pending"} />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <MethodChip method={cert?.verifiedThrough||"email"}/>
                        <div className="text-xs text-gray-500">{formatDate(cert?.createdAt)}</div>
                      </div>
                      <a href={`http://localhost:8000/api/dl/view-doc?uri=${cert.docUri}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                        View details <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </button>
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
                        <StatusBadge status={cert?.status||"pending"} />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <MethodChip method={cert?.verifiedThrough||"email"}/>
                        <div className="text-xs text-gray-500">{formatDate(cert?.createdAt)}</div>
                      </div>
                      <a href={`http://localhost:8000/api/dl/view-doc?uri=${cert.docUri}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                        View details <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      </main>

    </div>
  );
}
