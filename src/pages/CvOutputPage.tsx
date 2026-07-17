import { Link, useParams } from "react-router-dom";
import { SiHyperskill } from "react-icons/si";
import { FaBriefcase, FaCopy, FaGithub } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import { BiSolidBriefcase } from "react-icons/bi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileSearch, Plus } from "lucide-react";
import QRCode from "qrcode";
import {
  CheckCircle,
  CircleUser,
  FolderOpen,
  GraduationCap,
  Link2,
  Linkedin,
  Mail,
  MapPinned,
  Phone,
} from "lucide-react";
//import { useReactToPrint } from "react-to-print";

import ShowVerifications from "@/components/ShowVerifications";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";

import {
  TypeAward,
  TypeEducation,
  TypeExperience,
  TypeProject,
  TypeSkill,
} from "@/CvBuilder/cvSchema";
import { MdSchool } from "react-icons/md";
import StatusBadge from "@/CvBuilder/StatusBadge";
import { EdubukQR } from "@/components/QrCode";
import { CvPdfDocument } from "@/components/PDFDownloader/CvPdfDocument";
import { useCvData } from "@/hooks/useCvData";
import { CvSkeleton } from "@/components/SkeletonLoader/CvSkeleton";

  const COLOR_TEAL = "#006666";
export const formatDate = (dateString: string) => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);

  // Check if year is 1970, return "Present"
  if (date.getFullYear() === 1970) {
    return "Present";
  }
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  if (month === "undefined" || day === "NaN") return "Present";
  return `${day} ${month} ${year}`;
};

const CvOutputPage = ({userId}:{userId?:string}) => {
  const { id } = useParams();

  const [copied, setCopied] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const {isCvLoading, searchCvData,cvData,searchFullCvData } = useCvData();

  // const handlePrint = useReactToPrint({
  //   contentRef: pdfRef,
  //   documentTitle: "My CV",
  //   pageStyle, // inject the styles into print document
  // });

  const [qrDataUrl, setQrDataUrl] = useState<string>("");
//   const handlePrint = useReactToPrint({
//   contentRef: pdfRef,
//   documentTitle: "My CV",
//   pageStyle: `
//     @page {
//       size: A4;
//       margin: 10mm;
//     }
//     @media print {
//       .print-no-break {
//   break-inside: auto;
//   page-break-inside: auto;
// }
//       .print-section {
//         break-before: auto;
//         page-break-before: auto;
//       }
//       body {
//         -webkit-print-color-adjust: exact;
//         print-color-adjust: exact;
//       }
//     }
//   `,
// });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    console.log("date", dateString);
    const formatedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    console.log("formated date", formatedDate);
    if (formatedDate == "Invalid Date" || formatedDate == "1 Jan 1970") {
      return "Present";
    }
    return formatedDate;
  };

  useEffect(() => {
    if(id){
      searchCvData(id);
    }else if(userId)
    {
      searchFullCvData();
    }
    console.log("cvdata", cvData);
  }, []);

  useEffect(() => {

  QRCode.toDataURL(`https://edubuktrucv.com/cv/${id??userId}`, {
    width: 80,
    margin: 1,
    color: { dark: "#03257e", light: "#ffffff" },
  }).then(setQrDataUrl);
}, [id||userId]);

  if (isCvLoading) {
    return (
      <CvSkeleton />
    );
  }

  if (!cvData) {
    return (

<div className="flex flex-col items-center justify-center py-16 px-6 text-center">
  <div className="relative mb-6">
    <div className="w-24 h-24 rounded-2xl bg-[#006666]/10 flex items-center justify-center">
      <FileSearch className="w-10 h-10 text-[#006666]" strokeWidth={1.5} />
    </div>
    {/* subtle ring */}
    <div className="absolute inset-0 rounded-2xl ring-1 ring-[#006666]/20" />
  </div>

  <h2 className="text-2xl font-semibold text-gray-800 mb-2">No CV Found</h2>
  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
    You haven't built your CV yet. Create one to showcase your verified skills
    and credentials on the blockchain.
  </p>

  <Link to="/create-cv" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006666] text-white text-sm font-medium hover:bg-[#005555] transition-colors">
    <Plus className="w-4 h-4" />
    Build your CV
  </Link>
</div>
    );
  }

  const copyResumeLink = async (link: string) => {
    await navigator.clipboard
      .writeText(link)
      .then(() => setCopied(true))
      .catch((err) => {
        toast.error("something went wrong", err.message);
      });
    //console.log("Link copied to clipboard");
  };

  return (
    <div className="px-1 mt-5 md:mt-0 md:px-10 mb-10 overflow-x auto ">
       <div className="flex items-center justify-center gap-3 mt-4">
          {/* Copy Link */}
          <button
            onClick={() =>
              copyResumeLink(`https://edubuktrucv.com/cv/${id?id:userId}`)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#03257e]/30 text-[#03257e] hover:bg-[#03257e] hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <FaCopy size={13} />
            <span>{copied ? "Copied!" : "Copy CV Link"}</span>
          </button>

          {/* Download PDF */}
          <PDFDownloadLink
            document={
              <CvPdfDocument
                cvData={cvData}
                qrDataUrl={qrDataUrl}
                userId={id!=undefined?id:userId!}
              />
            }
            fileName={`TruCV-${cvData.personal.fullName || id}.pdf`}
          >
            {({ loading }) => (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#006666] text-white hover:bg-[#006666]/85 transition-all duration-200 text-sm font-semibold disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Preparing PDF..." : "Download as PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      <div className="flex flex-col items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div>
        <p className="lg:hidden text-sm text-[#F1441C] flex items-center gap-1.5 font-medium">
          <span>👉</span>
          <span>Swipe left/right to view the full CV</span>
        </p>
      </div>
      <div  className=" mt-2 max-w-6xl mx-auto w-full overflow-x-scroll">
        {/* main */}

        <div ref={pdfRef} className="flex flex-col gap-3 md:gap-7 w-[1100px]">
        <h1
          className="text-xl md:text-2xl font-bold text-center ml-[300px]"
          style={{
            background: "linear-gradient(90deg, #03257e, #006666, #f14419)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Verified Curriculum Vitae (CV) on the Blockchain
        </h1>

        <div className="flex justify-center items-center flex-col ml-[300px]">
          <EdubukQR url={`https://edubuktrucv.com/cv/${id}`} />
          <div className="flex flex-col gap-0.5 justify-center items-center">
            <p className="text-lg text-[#03257e] tracking-wide">
              <span className="font-bold">TruCV</span> powered by
              <span
                className="text-xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(90deg, #03257e, #006666, #f14419)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {" "}
                Edubuk
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 md:gap-7 w-[1100px] border  border-t ">
          {/* left sidebar */}
          <div
            className="w-72 bg-[#006666] px-4 md:px-5 text-white py-6 flex flex-col gap-8"
            style={{ minHeight: "100%" }}
          >
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-2 mt-2">
              {cvData.personal.imgUrl ? (
                <img
                  src={cvData.personal.imgUrl}
                  alt="profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#449298] object-cover"
                />
              ) : (
                <CircleUser className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#449298] text-white/60" />
              )}
              {/* <ShowVerifications
                isAttested={true}
                className="flex justify-center"
                onlySelfAttest
                textClass="text-white"
                fillCheck
                fillcheckClass="mt-1"
              /> */}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/20" />

            {/* Education */}
            {cvData.educations.length > 0 && (
              <div className="flex flex-col gap-4">
                {/* Section Header */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-[#FB980E] rounded-full flex items-center justify-center shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <h2 className="text-base md:text-lg font-semibold tracking-wider uppercase">
                    Education
                  </h2>
                </div>

                {/* Education Cards */}
                <div className="relative pl-5 border-l-2 border-[#FB980E]/60 flex flex-col gap-5">
                  {cvData.educations.map(
                    (education: TypeEducation, index: number) => (
                      <div key={index} className="relative flex flex-col gap-1">
                        {/* Timeline dot */}
                        <div className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#FB980E] ring-2 ring-[#006666]" />

                        {/* Level + doc link */}
                        <h3 className="font-semibold text-sm md:text-base text-white flex items-center gap-1 leading-tight">
                          {education.level}
                          {education.docUri && (
                            <a
                              href={education.docUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FB980E] hover:opacity-75 transition-opacity"
                            >
                              <Link2 size={13} />
                            </a>
                          )}
                        </h3>

                        {/* Institution | Degree */}
                        <p className="text-xs text-white/80 leading-snug">
                          {education.institutionName}
                        </p>
                        <p className="text-xs text-white/60">
                          {education.boardNameOrDegree}
                        </p>

                        {/* GPA / Percentage */}
                        <p className="text-xs font-semibold text-[#FB980E]">
                          {Number(education.gpa) > 10
                            ? `${education.gpa}%`
                            : `GPA: ${education.gpa}`}
                        </p>

                        {/* Duration */}
                        <p className="text-xs text-white/60 italic">
                          {formatDate(education.duration?.from!)}
                          {education.duration?.to
                            ? ` – ${formatDate(education.duration.to!)}`
                            : ""}
                        </p>

                        {/* Status Badge */}
                        <div className="bg-white rounded-full w-fit mt-0.5">
                          <StatusBadge status={education.status} />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* right bar */}
          <div className="flex-1">
            <div className="mt-5 px-2 flex flex-col gap-3 ">
              {/* Name + Single Centered Self-Attest Badge */}
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-4xl text-[#333B4D] tracking-wide capitalize max-w-[500px] lg:max-w-[600px] line-clamp-1 text-center">
                  {cvData.personal.fullName}
                </h1>
                <ShowVerifications
                  isAttested={true}
                  onlySelfAttest
                  className="flex justify-center"
                />
              </div>

              {/* Personal Details Grid */}
              <div className="bg-[#006666] rounded-xl text-white px-6 py-4 md:max-w-3xl w-full shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email */}
                  {cvData.personal.email && <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                      <Mail size={15} />
                    </span>
                    <span className="text-sm flex items-center gap-1 tracking-wide truncate">
                      {cvData.personal.email}
                      <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                    </span>
                  </div>}

                  {/* Phone */}
                 {cvData.personal.phoneNumber && <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                      <Phone size={15} />
                    </span>
                    <span className="text-sm flex items-center gap-1 tracking-wide">
                      {cvData.personal.phoneNumber}
                      <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                    </span>
                  </div>}

                  {/* Location */}
                  {cvData.personal.city && <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                      <MapPinned size={15} />
                    </span>
                    <span className="text-sm flex items-center gap-1 tracking-wide">
                      {cvData.personal.city}
                      <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                    </span>
                  </div>}

                  {/* Profession */}
                  {cvData.personal.profession && (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                        {cvData.personal.profession === "student" ? (
                          <MdSchool size={15} />
                        ) : (
                          <FaBriefcase size={15} />
                        )}
                      </span>
                      <span className="text-sm flex items-center gap-1 tracking-wide capitalize text-white">
                        {cvData.personal.profession}
                        <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                      </span>
                    </div>
                  )}

                  {/* GitHub */}
                  {cvData.personal.githubUrl && (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                        <FaGithub size={15} />
                      </span>
                      <a
                        href={cvData.personal.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-1 tracking-wide underline underline-offset-2 hover:text-[#FB980E] transition-colors"
                      >
                        GitHub
                        <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                      </a>
                    </div>
                  )}

                  {/* LinkedIn */}
                  {cvData.personal.linkedInUrl && (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                        <Linkedin size={15} />
                      </span>
                      <a
                        href={cvData.personal.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-1 tracking-wide underline underline-offset-2 hover:text-[#FB980E] transition-colors"
                      >
                        LinkedIn
                        <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* profile summary */}
              {cvData.personal?.summary && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm md:text-base font-semibold leading-relaxed">
                    {cvData.personal?.summary}
                  </p>
                  <ShowVerifications
                    isAttested={true}
                    className="self-start"
                    onlySelfAttest
                  />
                </div>
              )}

              {/* skill section */}
              {/* skills */}
              <div className="mt-2">
                {cvData.skills.length > 0 && (
                  <>
                    {/* Section Header */}
                    <h1 className="text-xl flex items-center gap-2 font-heading font-semibold tracking-wider uppercase border-b border-black mb-2">
                      <SiHyperskill size={20} color="#FB980E" /> Skills
                    </h1>

                    {/* Skills Grid */}
                    <div className="flex font-body flex-wrap gap-2">
                      {cvData.skills.map((skill: TypeSkill) => (
                        <div
                          key={skill.skillName}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#006666]/10 border border-[#006666]/20 text-[#006666]"
                        >
                          <span className="text-sm font-medium">
                            {skill.skillName}
                          </span>
                          {skill.endoresBy && (
                            <span
                              className="inline-flex items-center gap-1 pl-2 border-l border-[#006666]/20 text-xs font-medium"
                              style={{ color: COLOR_TEAL }}
                            >
                              <CheckCircle className="h-3 w-3" />
                              {skill?.endorserProfile??skill.endoresBy}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* experience */}
              <div className="mt-5 print-section">
                {cvData.experiences.length > 0 && (
                  <>
                    {/* Section Header */}
                    <h1 className="text-xl flex items-center gap-2 font-heading font-semibold tracking-wider uppercase border-b border-black mb-2">
                      <BiSolidBriefcase size={18} color="#FB980E" /> Work
                      Experience
                    </h1>

                    {/* Timeline */}
                    <div className="relative font-body pl-6 border-l-2 border-[#FB980E] flex flex-col gap-6">
                      {cvData.experiences.map((exp: TypeExperience, index) => {
                        return (
                          <div key={index} className="relative print-no-break">
                            {/* Timeline dot */}
                            <div className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-[#FB980E] ring-2 ring-white" />

                            {/* Card */}
                            <div className="flex flex-col gap-1">
                              {/* Row 1: Job Role + Duration */}
                              <div className="flex items-start justify-between gap-3">
                                <h1 className="text-base md:text-xl font-semibold tracking-tight line-clamp-1">
                                  {exp.jobRole}
                                </h1>
                                <p className="text-[#006666] italic text-xs md:text-sm text-nowrap shrink-0">
                                  {formatDate(exp.duration.from)} –{" "}
                                  {formatDate(exp.duration.to)}
                                </p>
                              </div>

                              {/* Row 2: Company + doc link */}
                              <div className="flex items-center gap-2">
                                <p className="text-sm md:text-base capitalize text-gray-600 line-clamp-1">
                                  {exp.companyName}
                                </p>
                                {exp.docUri && (
                                  <a
                                    href={exp.docUri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FB980E] hover:opacity-75 transition-opacity"
                                  >
                                    <Link2 size={15} />
                                  </a>
                                )}
                              </div>

                              {/* Row 3: Verification + Status */}
                              <div className="flex items-center gap-2">
                                <StatusBadge
                                  status={exp.status}
                                  isEmailSend={exp.isEmailSend}
                                />
                              </div>

                              {/* Row 4: Description */}
                              {exp.description && (
                                <ul className="mt-1 flex flex-col gap-1">
                                  {exp.description
                                    .split(".")
                                    .filter((s) => s.trim())
                                    .map((point, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-gray-600"
                                      >
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                                        <span className="leading-relaxed">
                                          {point.trim()}
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              )}

                              {/* Row 5: Skills */}
                              {exp.skills && (
                                <p className="text-sm mt-1">
                                  <span className="font-bold text-[#006666]">
                                    Skills:
                                  </span>{" "}
                                  <span className="font-semibold text-gray-600">
                                    {exp.skills}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {cvData.projects.length > 0 && (
                <div>
                  <h2 className="text-xl flex items-center gap-2 font-heading font-semibold text-black mb-3 mt-3 border-b-[1px] border-black">
                    <FolderOpen size={20} color="#FB980E" /> Projects
                  </h2>

                  <div className="relative font-body pl-6 border-l-2 border-[#FB980E] flex flex-col gap-6">
                    {cvData.projects.map((project: TypeProject, index) => {
                      return (
                        <div key={index} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-[#FB980E] ring-2 ring-white" />

                          <div className="flex flex-col gap-1">
                            {/* Row 1: Project name + duration */}
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-base md:text-xl font-semibold tracking-tight line-clamp-1 flex items-center gap-1">
                                {project.projectName}
                                {project.projectUrl && (
                                  <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FB980E] hover:opacity-75 transition-opacity"
                                  >
                                    <Link2 size={15} />
                                  </a>
                                )}
                              </h3>
                              <p className="text-[#006666] italic text-xs md:text-sm text-nowrap shrink-0">
                                {formatDate(project.duration.from)} –{" "}
                                {formatDate(project.duration.to)}
                              </p>
                            </div>

                            {/* Row 2: Verification */}
                            <div className="flex items-center gap-2">
                              <StatusBadge
                                status="selfAttested"
                                isEmailSend={false}
                              />
                            </div>

                            {/* Row 3: Description */}
                            {project.description && (
                              <ul className="mt-1 flex flex-col gap-1">
                                {project.description
                                  .split(".")
                                  .filter((s) => s.trim())
                                  .map((point, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm text-gray-600"
                                    >
                                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                                      <span className="leading-relaxed">
                                        {point.trim()}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                            )}

                            {/* Row 4: Skills */}
                            {project.skills && (
                              <p className="text-sm mt-1">
                                <span className="font-bold text-[#006666]">
                                  Skills:
                                </span>{" "}
                                <span className="font-semibold text-gray-600">
                                  {project.skills}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {(cvData.awards.length > 0 || cvData.projects.length > 0) && (
                <div className="my-10 space-y-8">
                  {/* <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-[#FB980E] rounded-full text-white flex items-center justify-center shrink-0">
                      <GiAchievement size={18} />
                    </div>
                    <h1 className="text-xl font-heading font-semibold tracking-wider uppercase">
                      Achievements & Certifications
                    </h1>
                  </div> */}

                  {/* Awards */}
                  {cvData.awards.length > 0 && (
                    <div>
                      <h2 className="text-xl flex items-center gap-2 font-heading font-semibold text-black mb-3 border-b border-black">
                        <GiAchievement size={20} color="#FB980E" /> Achievements
                        & Certifications
                      </h2>

                      <div className="relative font-body pl-6 border-l-2 border-[#FB980E] flex flex-col gap-6">
                        {cvData.awards.map((award: TypeAward, index) => {
                          return (
                            <div key={index} className="relative">
                              {/* Timeline dot */}
                              <div className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-[#FB980E] ring-2 ring-white" />

                              <div className="flex flex-col gap-1">
                                {/* Row 1: Award name + duration */}
                                <div className="flex items-start justify-between gap-3">
                                  <h3 className="text-base md:text-xl font-semibold tracking-tight line-clamp-1 flex items-center gap-1">
                                    {award.name}
                                    {award.docUri && (
                                      <a
                                        href={award.docUri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#FB980E] hover:opacity-75 transition-opacity"
                                      >
                                        <Link2 size={15} />
                                      </a>
                                    )}
                                  </h3>
                                  <p className="text-[#006666] italic text-xs md:text-sm text-nowrap shrink-0">
                                    {formatDate(award.duration?.from!)}
                                    {award.duration?.to
                                      ? ` – ${formatDate(award.duration.to!)}`
                                      : ""}
                                  </p>
                                </div>

                                {/* Row 2: Organisation */}
                                <p className="text-sm md:text-base capitalize text-gray-600 line-clamp-1">
                                  {award.organisation}
                                </p>

                                {/* Row 3: Verification + Status */}
                                <div className="flex items-center gap-2">
                                  <StatusBadge
                                    status={award.status}
                                    isEmailSend={award.isEmailSend}
                                  />
                                </div>

                                {/* Row 4: Description */}
                                {award.description && (
                                  <ul className="mt-1 flex flex-col gap-1">
                                    {award.description
                                      .split(".")
                                      .filter((s) => s.trim())
                                      .map((point, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-2 text-sm text-gray-600"
                                        >
                                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                                          <span className="leading-relaxed">
                                            {point.trim()}
                                          </span>
                                        </li>
                                      ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

               <p className="text-sm text-[#6B7280] text-center my-2">This is the PDF version of a Digital TruCV Profile of the Candidate. For Verification please click here: <br />
                <a href={`https://edubuktrucv.com/cv/${id?id:userId}`}
                className="text-[#03257e] underline"
                >{`https://edubuktrucv.com/cv/${id?id:userId}`}</a>
                </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CvOutputPage;
