import { useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";

//import { useReactToPrint } from "react-to-print";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";
import { SiHyperskill } from "react-icons/si";
import { FaBriefcase } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import { BiSolidBriefcase } from "react-icons/bi";
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
import { ICvData } from "./CvBuilder";
import {
  TypeAward,
  TypeEducation,
  TypeExperience,
  TypeProject,
  TypeSkill,
} from "./cvSchema";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ShowVerifications from "@/components/ShowVerifications";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/pages/CvOutputPage";
import { MdSchool } from "react-icons/md";
// import { ShowAnimatedVerifications } from "@/components/ShowAnimatedVerifications";
//import PdfDownloader from "@/components/PDFDownloader/PdfDownloader";
const COLOR_TEAL = "#006666";
const NewCV = ({
  cvData,
  setPreviewCV,
}: {
  cvData: ICvData;
  setPreviewCV: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [copied, setCopied] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  if (!cvData) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <h1 className="text-4xl font-bold text-[#03257e]">
          <ThreeDotLoader w={4} h={4} yPos={"center"} />
        </h1>
      </div>
    );
  }

  const getFieldNames = (errorMessage: string): string[] => {
    const prefix = errorMessage.indexOf(": ");
    const errorsOnly = errorMessage.substring(prefix + 2);

    const uniqueFields = [
      ...new Set(
        errorsOnly.split(", ").map((err) => {
          const field = err.split(": ")[0].trim(); // "educations.0.boardNameOrDegree"
          const parts = field.split("."); // ["educations", "0", "boardNameOrDegree"]
          return parts[parts.length - 1]; // "boardNameOrDegree" ← last part only
        }),
      ),
    ];

    return uniqueFields;
  };

  if (!cvData) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-4xl font-bold text-[#006666]">No CV Found</h1>
      </div>
    );
  }

  const createCv = async () => {
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/cv/create-cv", {
        data: cvData,
        title: title,
      });
      console.log(res);
      if (res.status === 200) {
        toast.success("CV Created Successfully");
        navigate(`/cv/${res.data.id}`);
      }
    } catch (error: any) {
      console.log("error from creating cv", error);
      const errors = `Please fill the required field in the form: ${getFieldNames(error.response.data.message as string)}. You may have parsed your existing cv or imported through LinkedIn`;
      toast.error(errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm p-4 h-auto"
      aria-modal="true"
      role="dialog"
      onClick={(prev) => setPreviewCV(!prev)} // click outside to close
    >
      {/* modal dialog — stop propagation so clicks inside won't close */}
      <div
        className="relative w-full max-w-[1100px] mx-auto mt-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={(prev) => setPreviewCV(!prev)}
          className="absolute -top-1 -right-3 z-60 inline-flex items-center justify-center py-2 px-3 rounded-lg bg-[#f14419] text-white shadow-md border border-gray-200 hover:scale-95 transition"
          aria-label="Close preview"
        >
          Close
        </button>
        <div className="flex flex-col items-start gap-4">
          {/* Title Input */}
          <div className="w-full">
            <input
              type="text"
              placeholder="Enter resume title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-[#006666] focus:outline-none focus:ring-2 focus:ring-[#006666]/20 md:w-[300px]"
            />
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#006666] focus:ring-2 focus:ring-[#006666]/20 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
              I want to share my certificates & TruCV with recruiters globally
              for potential placement opportunities in India and
              internationally, remote or in-person.
            </span>
          </label>

          {/* Create Button */}
          <div className="w-full md:w-auto">
            {loading ? (
              <div className="flex items-center justify-center px-6 py-2.5">
                <Loader2 className="h-5 w-5 animate-spin text-[#006666]" />
              </div>
            ) : (
              <button
                onClick={createCv}
                disabled={!title || !isChecked}
                className="w-full rounded-md bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-green-600 md:w-auto"
              >
                Create CV
              </button>
            )}
          </div>
        </div>
        {/* modal content — make scrollable and nicely padded */}
        <div
          ref={pdfRef}
          className="bg-white rounded-lg overflow-x-scroll max-h-[90vh] print-area"
          style={{ WebkitOverflowScrolling: "auto" }}
        >
          <div
            ref={pdfRef}
            className=" mt-2 max-w-6xl mx-auto w-full border  border-l-0 shadow-lg   rounded-md overflow-x-scroll xl:overflow-x-clip"
          >
            <p className="text-center text-[#f14419] mb-2">
              Scroll left-right to see full content
            </p>
            <p className="text-center text-[#03257e] mb-2">
              <span className="font-bold text-[#f14419]">Note: </span>Please
              check the box{" "}
              <span className="bg-black/20 p-1 rounded ">
                Select to include this data in your resume
              </span>{" "}
              from the form to reflect here that data
            </p>
            {/* main */}
            <div className="flex gap-3 md:gap-7 w-[1100px]  mb-20">
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
                          <div
                            key={index}
                            className="relative flex flex-col gap-1"
                          >
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
                              <StatusBadge
                                status={education.status}
                                isEmailSend={education.isEmailSend}
                              />
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
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                          <Mail size={15} />
                        </span>
                        <span className="text-sm flex items-center gap-1 tracking-wide truncate">
                          {cvData.personal.email}
                          <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                          <Phone size={15} />
                        </span>
                        <span className="text-sm flex items-center gap-1 tracking-wide">
                          {cvData.personal.phone}
                          <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                          <MapPinned size={15} />
                        </span>
                        <span className="text-sm flex items-center gap-1 tracking-wide">
                          {cvData.personal.city}
                          <CheckCircle className="h-4 w-4 text-white bg-white/15 rounded-full p-0.5" />
                        </span>
                      </div>

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
                      {cvData.personal.github && (
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                            <FaGithub size={15} />
                          </span>
                          <a
                            href={cvData.personal.github}
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
                      {cvData.personal.linkedin && (
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                            <Linkedin size={15} />
                          </span>
                          <a
                            href={cvData.personal.linkedin}
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
                                  {skill.endoresBy.slice(0, 2)}...
                                  {skill.endoresBy.slice(-4)}
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
                          {cvData.experiences.map(
                            (exp: TypeExperience, index) => {
                              return (
                                <div
                                  key={index}
                                  className="relative print-no-break"
                                >
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
                            },
                          )}
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
                            <GiAchievement size={20} color="#FB980E" />{" "}
                            Achievements & Certifications
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCV;
