import React, { useState } from "react";
import {
  ExternalLink,
  ShieldCheck,
  FileText,
  UserCircle,
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight,
} from "lucide-react";

import { useUserData } from "@/context/AuthContext";
import StatusBadge from "@/CvBuilder/StatusBadge";
import ResendEmail from "../../pages/ResendEmail";
import UserDocsSkeleton from "./UserDocsSkeleton";
import { Link } from "react-router-dom";

const COLOR_PRIMARY = "#03257e";
const COLOR_ACCENT = "#008888";
const COLOR_WARNING = "#f14419";

export interface IUserDoc {
  _id: string;
  docType: string;
  title: string;
  organisation: string;
  docUrl: string;
  meta: object;
  status: VerificationStatus;
  createdAt: string;
  verified: boolean;
  verifiedThrough: VerificationMethod;
}

export interface IEducationDoc {
  _id: string;
  userId: string;
  eduDocId: string;
  level: string;
  boardNameOrDegree: string;
  institutionName: string;
  gpa: string;
  duration: { from: string; to: string };
  selfAttested: boolean;
  isEmailSend?: boolean;
  issuerEmailId?: string;
  verified?: boolean;
  status?: VerificationStatus;
  verifiedThrough?: VerificationMethod;
  docUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IExperienceDoc {
  _id: string;
  userId: string;
  expDocId: string;
  companyName: string;
  jobRole: string;
  duration: { from: string; to: string };
  skills: string;
  description: string;
  selfAttested: boolean;
  isEmailSend?: boolean;
  issuerEmailId?: string;
  verified?: boolean;
  status?: VerificationStatus;
  verifiedThrough?: VerificationMethod;
  docUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAwardDoc {
  _id: string;
  userId: string;
  awardDocId: string;
  name: string;
  awardDescription: string;
  organisation: string;
  selfAttested: boolean;
  isEmailSend?: boolean;
  issuerEmailId?: string;
  verified?: boolean;
  status?: VerificationStatus;
  verifiedThrough?: VerificationMethod;
  docUri?: string;
  createdAt: string;
  updatedAt: string;
}

export type VerificationStatus =
  | "verified"
  | "pending"
  | "rejected"
  | "inProgress";
export type VerificationMethod = "DigiLocker" | "Email" | "Third Party" | null;

const MethodChip: React.FC<{ method: VerificationMethod }> = ({ method }) => {
  const label =
    method === "DigiLocker"
      ? "DigiLocker"
      : method === "Email"
        ? "Email Verification"
        : method === "Third Party"
          ? "Third Party"
          : "Awaiting Verification";
  const color = method ? COLOR_PRIMARY : "#94a3b8";

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border bg-white"
      style={{ borderColor: color, color }}
    >
      <ShieldCheck className="h-3.5 w-3.5" /> {label}
    </span>
  );
};

const DocumentCard: React.FC<{
  id: string;
  title: string;
  subtitle: string;
  status?: VerificationStatus;
  verifiedThrough?: VerificationMethod;
  docUri?: string;
  createdAt: string;
  verified?: boolean;
  isEmailSend?: boolean;
  onVerify: () => void;
  icon: React.ReactNode;
}> = ({
  title,
  subtitle,
  status = "pending",
  verifiedThrough,
  docUri,
  createdAt,
  verified,
  isEmailSend,
  onVerify,
  icon,
}) => {
  function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center"
            style={{ color: COLOR_PRIMARY }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-600 mb-1 truncate">
              {subtitle}
            </div>
            <div className="text-base font-semibold text-gray-900 line-clamp-2">
              {title}
            </div>
          </div>
        </div>
        <StatusBadge status={status} isEmailSend={isEmailSend} />
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <MethodChip method={verifiedThrough!} />
        <div className="text-xs text-gray-500 font-medium">
          {formatDate(createdAt)}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        {!verified && (
          <button
            onClick={onVerify}
            className="text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: COLOR_ACCENT,
              color: "white",
            }}
          >
            Request Verification
          </button>
        )}
        {docUri && docUri.includes("https://") && (
          <a
            href={docUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-all"
            style={{ color: COLOR_PRIMARY }}
          >
            View Document
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default function UserDocs({
  educationDocs,
  experienceDocs,
  awardDocs,
  setRefreshKey,
  isFetching,
}: {
  educationDocs: IEducationDoc[];
  experienceDocs: IExperienceDoc[];
  awardDocs: IAwardDoc[];
  setRefreshKey: React.Dispatch<React.SetStateAction<boolean>>;
  isFetching: boolean;
}) {
  const [openModel, setOpenModel] = useState(false);
  const [docId, setDocId] = useState<string>("");
  const { user } = useUserData();
  const [info, setInfo] = useState({
    org: "",
    roleOrLevel: "",
    docType: "",
  });

  const modelHandler = (
    id: string,
    org: string,
    roleOrLevel: string,
    docType: string,
  ) => {
    setOpenModel(true);
    setDocId(id);
    setInfo({
      org,
      roleOrLevel,
      docType,
    });
  };

  if (isFetching) {
    return <UserDocsSkeleton />;
  }

  const hasEducationDocs = educationDocs?.length > 0;
  const hasExperienceDocs = experienceDocs?.length > 0;
  const hasAwardDocs = awardDocs?.length > 0;
  const hasAnyDocs = hasEducationDocs || hasExperienceDocs || hasAwardDocs;

  return (
    <div className="min-h-screen w-full" style={{ background: "#f7f8fb" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {user && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* User Profile Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-transparent">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <UserCircle
                    className="h-16 w-16 rounded-full shadow-md"
                    style={{ color: COLOR_PRIMARY }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span>{user.email}</span>
                    <span className="text-gray-400">•</span>
                    <span>{user.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText
                      className="h-6 w-6"
                      style={{ color: COLOR_PRIMARY }}
                    />
                    My Documents
                  </h3>
                  {hasAnyDocs && (
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 border border-blue-200"
                      style={{ color: COLOR_PRIMARY }}
                    >
                      {(educationDocs?.length || 0) +
                        (experienceDocs?.length || 0) +
                        (awardDocs?.length || 0)}{" "}
                      Total
                    </span>
                  )}
                </div>

                <Link
                  to="/user-verification"
                  className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    color: COLOR_PRIMARY,
                    borderColor: COLOR_PRIMARY,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLOR_PRIMARY;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = COLOR_PRIMARY;
                  }}
                >
                  <span>Verification Overview</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {!hasAnyDocs && (
                <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Documents Yet
                  </h4>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You haven't uploaded any documents. Start by adding your
                    education, experience, or award certificates.
                  </p>
                </div>
              )}

              {/* Education Documents */}
              {hasEducationDocs && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap
                      className="h-5 w-5"
                      style={{ color: COLOR_PRIMARY }}
                    />
                    <h4 className="text-lg font-semibold text-gray-900">
                      Education Documents
                    </h4>
                    <span className="text-sm text-gray-500">
                      ({educationDocs.length})
                    </span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
                    <p className="text-sm" style={{ color: COLOR_PRIMARY }}>
                      <span
                        style={{ color: COLOR_WARNING }}
                        className="font-semibold"
                      >
                        Important:
                      </span>{" "}
                      If any document was rejected, you can submit a corrected
                      version using the "Request Verification" button.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {educationDocs.map((cert) => (
                      <DocumentCard
                        key={cert.eduDocId}
                        id={cert._id}
                        title={cert.level}
                        subtitle={
                          cert.institutionName || "Institution Not Specified"
                        }
                        status={cert.status}
                        verifiedThrough={cert.verifiedThrough}
                        docUri={cert.docUri}
                        createdAt={cert.createdAt}
                        verified={cert.verified}
                        isEmailSend={cert.isEmailSend}
                        onVerify={() =>
                          modelHandler(
                            cert._id,
                            cert.boardNameOrDegree,
                            cert.level,
                            "education",
                          )
                        }
                        icon={<GraduationCap className="h-5 w-5" />}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Documents */}
              {hasExperienceDocs && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase
                      className="h-5 w-5"
                      style={{ color: COLOR_PRIMARY }}
                    />
                    <h4 className="text-lg font-semibold text-gray-900">
                      Experience Documents
                    </h4>
                    <span className="text-sm text-gray-500">
                      ({experienceDocs.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {experienceDocs.map((cert) => (
                      <DocumentCard
                        key={cert.expDocId}
                        id={cert._id}
                        title={cert.jobRole}
                        subtitle={cert.companyName || "Company Not Specified"}
                        status={cert.status}
                        verifiedThrough={cert.verifiedThrough}
                        docUri={cert.docUri}
                        createdAt={cert.createdAt}
                        verified={cert.verified}
                        isEmailSend={cert.isEmailSend}
                        onVerify={() =>
                          modelHandler(
                            cert._id,
                            cert.jobRole,
                            cert.companyName,
                            "experience",
                          )
                        }
                        icon={<Briefcase className="h-5 w-5" />}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Award Documents */}
              {hasAwardDocs && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award
                      className="h-5 w-5"
                      style={{ color: COLOR_PRIMARY }}
                    />
                    <h4 className="text-lg font-semibold text-gray-900">
                      Awards & Achievements
                    </h4>
                    <span className="text-sm text-gray-500">
                      ({awardDocs.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {awardDocs.map((cert) => (
                      <DocumentCard
                        key={cert.awardDocId}
                        id={cert._id}
                        title={cert.name}
                        subtitle={
                          cert.organisation || "Organization Not Specified"
                        }
                        status={cert.status}
                        verifiedThrough={cert.verifiedThrough}
                        docUri={cert.docUri}
                        createdAt={cert.createdAt}
                        verified={cert.verified}
                        isEmailSend={cert.isEmailSend}
                        onVerify={() =>
                          modelHandler(
                            cert._id,
                            cert.name,
                            cert.organisation,
                            "award",
                          )
                        }
                        icon={<Award className="h-5 w-5" />}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <ResendEmail
        openModel={openModel}
        setOpenModel={setOpenModel}
        docId={docId}
        setDocId={setDocId}
        info={info}
        setRefreshKey={setRefreshKey}
      />
    </div>
  );
}
