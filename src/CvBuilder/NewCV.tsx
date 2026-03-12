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
import { ShowAnimatedVerifications } from "@/components/ShowAnimatedVerifications";
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

    const uniqueFields = [...new Set(
        errorsOnly.split(", ").map(err => {
            const field = err.split(": ")[0].trim();         // "educations.0.boardNameOrDegree"
            const parts = field.split(".");                   // ["educations", "0", "boardNameOrDegree"]
            return parts[parts.length - 1];                  // "boardNameOrDegree" ← last part only
        })
    )];

    return uniqueFields;
}


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
    } catch (error:any) {
      console.log("error from creating cv",error)
      const errors = `Please fill the required field in the form: ${getFieldNames(error.response.data.message as string)}. You may have parsed your existing cv or imported through LinkedIn`;
      toast.error(errors);
    } finally {
      setLoading(false);
    }
  };

  // const downloadPdfHandler = async()=>{
  //   try {
  //     setLoading(true);
  //     const response = await fetch(`http://localhost:8000/cv/pdfmaker`,{
  //       method:"POST",
  //       headers:{
  //         "Content-Type":"application/json",
  //         "Authorization": `Bearer ${localStorage.getItem("googleIdToken")}`
  //       },
  //       body:JSON.stringify({url:`http://:5173/new-cv/${id}`,selector:"#cv-preview-wrapper",loginMailId:localStorage.getItem("email")})
  //     })
  //     if(!response.ok){
  //       throw new Error("Failed to generate PDF");
  //     }
  //     const blob = await response.blob();
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${cvData.personalDetails.name}.pdf`;
  //     link.click();
  //     URL.revokeObjectURL(url);
  //     toast.success("PDF downloaded successfully");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to download PDF");
  //   }finally{
  //     setLoading(false);
  //   }
  // }

  // const copyResumeLink = async (link: string) => {
  //   await navigator.clipboard
  //     .writeText(link)
  //     .then(() => setCopied(true))
  //     .catch((err) => {
  //       toast.error("something went wrong", err.message);
  //     });
  //   //console.log("Link copied to clipboard");
  // };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      onClick={(prev) => setPreviewCV(!prev)} // click outside to close
    >
      {/* modal dialog — stop propagation so clicks inside won't close */}
      <div
        className="relative w-full max-w-[1100px] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={(prev) => setPreviewCV(!prev)}
          className="absolute -top-3 -right-3 z-60 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 hover:scale-95 transition"
          aria-label="Close preview"
        >
          ✕
        </button>
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="animate-spin text-[#006666]" />
          ) : (
            <button
              onClick={createCv}
              className="bg-green-600 px-3 py-2 mb-2 text-white text-center rounded"
            >
              Create CV
            </button>
          )}
          <input
            type="text"
            placeholder="Enter resume title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded px-3 py-2 mb-2 md:w-[200px]"
          ></input>
        </div>
        {/* modal content — make scrollable and nicely padded */}
        <div
          ref={pdfRef}
          className="bg-white rounded-lg overflow-x-scroll max-h-[90vh] print-area"
          style={{ WebkitOverflowScrolling: "touch" }}
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
            <div className="flex gap-3 md:gap-7 w-[1100px]">
              {/* left sidebar */}
              <div className="w-72  h-auto  bg-[#006666] rounded-ss-2xl px-2 md:px-5 text-white py-2 space-y-20 md:space-y-10">
                {/* image */}
                {cvData.personal.imgUrl ? (
                  <div className="mt-5">
                    <img
                      src={cvData.personal.imgUrl}
                      alt="image"
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 mx-auto border-[#449298] object-cover"
                    />
                    <ShowVerifications
                      isAttested={true}
                      className="flex justify-center mt-2"
                      onlySelfAttest
                      textClass="text-white"
                      fillCheck
                      fillcheckClass="mt-1"
                    />
                  </div>
                ) : (
                  <div className="mt-5">
                    <CircleUser
                      size={24}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 mx-auto border-[#449298] object-cover"
                    />
                  </div>
                )}

                {/* Education */}
                <div>
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center">
                      <GraduationCap size={20} />
                    </div>
                    <h1 className="text-black-500 text-sm md:text-xl lg:text-2xl font-semibold tracking-tight uppercase">
                      Education
                    </h1>
                  </div>

                  {/* showcasing education higher to lower*/}
                  <div className="flex flex-col gap-10 md:gap-5 mt-3">
                    {cvData.educations.length > 0 &&
                      cvData.educations.map(
                        (education: TypeEducation, index: number) => {
                          return (
                            <div
                              className="flex flex-col p-4 md:p-5 rounded-lg shadow-sm"
                              key={index + 1}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <h1 className="flex items-center gap-1 font-semibold text-sm md:text-base text-white">
                                    {education.level}
                                    {education.docUri && (
                                      <a
                                        href={education.docUri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Open document for ${education.level}`}
                                        className="inline-flex items-center justify-center ml-1 p-1 rounded-md text-[#FB980E] hover:bg-[#FB980E]/10 transition"
                                      >
                                        <Link2 />
                                      </a>
                                    )}
                                  </h1>
                                </div>
                              </div>
                              <div className="bg-white rounded-full w-fit">
                                <StatusBadge
                                  status={education.status}
                                  isEmailSend={education.isEmailSend}
                                />
                              </div>
                              {/* meta row: degree, gpa and duration */}
                              <div className="mt-2 flex flex-col gap-2">
                                <div className="text-sm flex flex-col justify-start text-white dark:text-gray-300">
                                  <span className="font-medium text-white">
                                    {education.institutionName} |{" "}
                                    {education.boardNameOrDegree}
                                  </span>
                                  {Number(education.gpa) > 10 ? (
                                    <span className="font-bold text-white">
                                      Percentage: {education.gpa}%
                                    </span>
                                  ) : (
                                    <span className="font-bold text-white">
                                      GPA: {education.gpa}
                                    </span>
                                  )}
                                  {/* <span className="font-normal ml-0 md:ml-2">
                                  GPA: {education.gpa ?? "—"}
                                </span>{" "} */}
                                </div>

                                {/* optional duration on the right for larger screens */}
                                <div className="text-sm text-white">
                                  {formatDate(education.duration?.from!)}{" "}
                                  {education.duration?.to
                                    ? `— ${formatDate(education.duration.to!)}`
                                    : ""}
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                  </div>
                  {/*  */}
                </div>
              </div>

              {/* right bar */}
              <div className="flex-1">
                <div className="mt-5 px-2 flex flex-col gap-3">
                  <div className="flex items-center gap-5">
                    <h1
                      className="text-4xl text-[#333B4D] tracking-wide capitalize 
                max-w-[500px] lg:max-w-[600px]  line-clamp-1 "
                    >
                      {cvData.personal.fullName}
                    </h1>

                    <ShowVerifications isAttested={true} onlySelfAttest />
                  </div>
                  {/* personal details */}
                  <div className="bg-[#006666]  grid-cols-2 rounded-md text-white px-5 py-1 flex md:max-w-3xl w-full gap-3">
                    {/* email and location */}
                    <div className="w-full">
                      <div className="flex flex-col gap-2">
                        {/* email */}
                        <div className="flex items-center gap-3">
                          <div className="self-start">
                            <Mail
                              size={26}
                              className="h-4 w-4 md:h-5 md:w-5 mt-1"
                            />
                          </div>
                          <h1 className="text-sm md:text-base tracking-wider font-normal">
                            {cvData.personal.email}
                          </h1>
                          <ShowVerifications
                            isAttested={true}
                            className="self-start"
                            onlySelfAttest
                            textClass="text-white"
                            badge
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="self-start">
                            <MapPinned
                              size={26}
                              className="h-4 w-4 md:h-5 md:w-5 mt-1"
                            />
                          </div>
                          <h1 className="text-sm md:text-base tracking-wider font-normal">
                            {cvData.personal.city}
                          </h1>
                          <ShowVerifications
                            isAttested={true}
                            className="self-start mt-2"
                            onlySelfAttest
                            textClass="text-white"
                            badge
                          />
                        </div>
                      </div>
                    </div>
                    {/* phoneNumber and profesion */}
                    <div className="w-full ml-3">
                      <div className="flex flex-col gap-2">
                        {/* email */}
                        <div className="flex items-center gap-3">
                          <div className="self-start">
                            <Phone
                              size={24}
                              className="h-4 w-4 md:h-5 md:w-5 mt-1"
                            />
                          </div>
                          <h1 className="text-sm md:text-base tracking-wider font-normal">
                            {cvData.personal.phone}
                          </h1>
                          <ShowVerifications
                            isAttested={true}
                            // className="self-start mt-2"
                            onlySelfAttest
                            textClass="text-white"
                            badge
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="self-start">
                            {cvData.personal.profession === "student" ? (
                              <span className="flex item-center gap-1">
                                <MdSchool
                                  size={26}
                                  className="h-4 w-4 md:h-5 md:w-5 mt-1"
                                />
                                Student{" "}
                              </span>
                            ) : (
                              <span className="flex item-center gap-1">
                                {" "}
                                <FaBriefcase
                                  size={26}
                                  className="h-4 w-4 md:h-5 md:w-5 mt-1"
                                />
                                Employee
                              </span>
                            )}
                          </div>
                          <h1 className="text-sm md:text-base tracking-wider font-normal">
                            {cvData.personal.profession}
                          </h1>
                          <ShowVerifications
                            isAttested={true}
                            // className="self-start mt-2"
                            onlySelfAttest
                            textClass="text-white"
                            badge
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex gap-2">
                        {/* email */}
                        {cvData.personal.github && (
                          <div className="flex items-center gap-3">
                            <div className="self-start">
                              <FaGithub
                                size={24}
                                className="h-4 w-4 md:h-5 md:w-5 mt-1"
                              />
                            </div>
                            <a
                              href={cvData.personal.github}
                              target="_blank"
                              className="text-sm md:text-base tracking-wider font-normal underline"
                            >
                              Github
                            </a>
                            <ShowVerifications
                              isAttested={true}
                              // className="self-start mt-2"
                              onlySelfAttest
                              textClass="text-white"
                              badge
                            />
                          </div>
                        )}
                        {cvData.personal.linkedin && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                              <div className="self-start">
                                <Linkedin
                                  size={24}
                                  className="h-4 w-4 md:h-5 md:w-5 mt-1"
                                />
                              </div>
                              <a
                                href={cvData.personal.linkedin}
                                target="_blank"
                                className="text-sm md:text-base tracking-wider font-normal underline"
                              >
                                LinkedIn
                              </a>
                              <ShowVerifications
                                isAttested={true}
                                // className="self-start mt-2"
                                onlySelfAttest
                                textClass="text-white"
                                badge
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* profile summary */}
                  <div className="flex gap-5 items-center  overflow-hidden">
                    <p className="text-sm md:text-base font-semibold ">
                      {cvData.personal?.summary}
                    </p>
                    <ShowVerifications
                      // isAttested={
                      //   cvData.profileSummaryVerification.profile_summary
                      //     .isSelfAttested
                      // }
                      isAttested={true}
                      className="self-start mt-2 w-[450px]"
                      onlySelfAttest
                      // textClass="text-white"
                    />
                  </div>

                  {/* skill section */}
                  {/* skills */}
                  <div className="mt-2">
                    {cvData.skills.length > 0 && (
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center">
                          <SiHyperskill size={20} />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-wider uppercase">
                          Skills
                        </h1>
                      </div>
                    )}

                    {/* showcasing skills */}
                    <div className="">
                      <div className="flex flex-col  mt-2 gap-5 md:gap-3 ">
                        {cvData.skills.length > 0 &&
                          cvData.skills.map((skill: TypeSkill) => {
                            // const isSelfAttested =
                            //   cvData.skillsVerifications[skill.skillName]
                            //     .isSelfAttested || false;
                            const isSelfAttested = true;
                            const mailStatus = skill.endoresBy;
                            return (
                              <div>
                                {/* <div
                          key={index}
                          className="px-2 py-1  text-sm tracking-wide font-semibold rounded-sm bg-[#006666] text-white w-fit"
                        >
                          {skill}
                        </div> */}
                                <div className="flex gap-1 items-center w-fit">
                                  <ShowAnimatedVerifications
                                    firstButtonText={skill.skillName}
                                    // buttonClass="text-sm lg:text-base"
                                    isSelfAttested={isSelfAttested}
                                    mailStatus={mailStatus}
                                    hash=""
                                  />
                                  {skill.endoresBy && (
                                    <span>
                                      Endorsed by
                                      <span
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
                                        style={{
                                          backgroundColor: COLOR_TEAL + "1a",
                                          color: COLOR_TEAL,
                                        }}
                                      >
                                        <CheckCircle className="h-3.5 w-3.5" />{" "}
                                        {skill.endoresBy.slice(0, 2)}...
                                        {skill.endoresBy.slice(-4)}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* experience */}
                  <div className="mt-5">
                    {/* title */}
                    {cvData.experiences.length > 0 && (
                      <div className="flex items-center gap-5">
                        <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center">
                          <BiSolidBriefcase size={20} />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-wider uppercase">
                          Work Experience
                        </h1>
                      </div>
                    )}

                    {/* experience cards */}
                    <div className="relative">
                      <div className="absolute inset-y-2  h-auto w-[3px]  bg-[#FB980E] rounded-full"></div>

                      {cvData.experiences.map((exp: TypeExperience, index) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col mt-3  px-3 ml-1"
                          >
                            <div className="flex justify-between">
                              {/* job role,company name  */}
                              <div className="max-w-xl w-full relative">
                                {/* bulletdot */}
                                <div
                                  className={`absolute bg-[#FB980E] h-3 w-3 rounded-full top-2 -left-[21px]`}
                                ></div>
                                <h1 className="text-md md:text-xl font-semibold tracking-tight line-clamp-1">
                                  {exp.jobRole}
                                </h1>
                                <div className="flex flex-col">
                                  <p className="flex gap-1 items-center text-sm md:text-lg capitalize line-clamp-1">
                                    {exp.companyName}{" "}
                                    {exp.docUri && (
                                      <a
                                        href={exp.docUri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#FB980E] font-semibold text-sm"
                                      >
                                        <Link2 />
                                      </a>
                                    )}
                                  </p>{" "}
                                  <div className="flex gap-1 w-fit">
                                    <StatusBadge
                                      status={exp.status}
                                      isEmailSend={exp.isEmailSend}
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* duration */}
                              {/* yash */}
                              <div className="">
                                <p className="text-[#006666] italic text-xs md:text-base text-nowrap">
                                  <>
                                    {/* {exp.duration.from} - {exp.duration.to} */}
                                    {formatDate(exp.duration.from)} -{" "}
                                    {formatDate(exp.duration.to)}
                                  </>
                                </p>
                              </div>
                            </div>
                            {/* description of work */}
                            <div className="mt-3">
                              <p>{exp.description}</p>
                              <p>
                                <strong>Skills:</strong> {exp.skills}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Achievements */}
                  {(cvData.awards.length > 0 || cvData.projects.length > 0) && (
                    <div className="my-10 space-y-5">
                      {/* title */}
                      <div className="flex items-center gap-5">
                        <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center">
                          <GiAchievement size={27} />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-wider uppercase">
                          Achievements and Certifications
                        </h1>
                      </div>

                      {/* Awards */}
                      {cvData.awards.length > 0 && (
                        // award container
                        <div className="px-3 mt-2">
                          <h1 className="text-xl font-semibold text-[#44949C] mb-2">
                            Awards
                          </h1>
                          {/* award cards */}
                          <div className="flex flex-col gap-3  relative">
                            <div className="absolute inset-y-2  h-auto w-[3px]  bg-[#FB980E] rounded-full"></div>
                            {cvData.awards.map((award: TypeAward, index) => {
                              return (
                                <div key={index} className="flex flex-col ml-3">
                                  <div className="flex justify-between">
                                    {/* job role,company name  */}
                                    <div className="max-w-xl w-full relative">
                                      {/* bulletdot */}
                                      <div
                                        className={`absolute bg-[#FB980E] h-3 w-3 rounded-full top-2 left-[-17px]`}
                                      ></div>
                                      <h1 className="text-md flex items-center gap-1 md:text-xl font-semibold tracking-tight line-clamp-1">
                                        {award.name}{" "}
                                        {award.docUri && (
                                          <a
                                            href={award.docUri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FB980E] font-semibold text-sm"
                                          >
                                            <Link2 />
                                          </a>
                                        )}
                                      </h1>
                                      <div className="flex flex-col">
                                        <p className="text-sm md:text-lg capitalize line-clamp-1 mb-1">
                                          {award.organisation}
                                        </p>
                                        <div className="flex gap-1 w-fit ">
                                          <StatusBadge
                                            status={award.status}
                                            isEmailSend={award.isEmailSend}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* duration */}
                                    <div className="">
                                      <p className="text-[#006666] italic text-xs md:text-base">
                                        {formatDate(award.duration?.from!)}{" "}
                                        {award.duration?.to
                                          ? `-${formatDate(award.duration.to!)}`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                  {/* description of work */}
                                  <div className="mt-1">
                                    <p className="text-base">
                                      {award.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {cvData.projects.length > 0 && (
                        // award container
                        <div className="px-3 mt-2">
                          <h1 className="text-xl font-semibold text-[#44949C] mb-3">
                            Projects
                          </h1>
                          {/* project cards */}
                          <div className="flex flex-col gap-3  relative">
                            <div className="absolute inset-y-2  h-auto w-[3px]  bg-[#FB980E] rounded-full"></div>
                            {cvData.projects.map(
                              (project: TypeProject, index) => {
                                //const verificationKey = project.project_name;
                                return (
                                  <div
                                    key={index}
                                    className="flex flex-col ml-3"
                                  >
                                    <div className="flex justify-between">
                                      {/* job role,company name  */}
                                      <div className="max-w-xl w-full flex flex-col md:flex-row md:gap-10 md:items-center relative">
                                        {/* bulletdot */}
                                        <div
                                          className={`absolute bg-[#FB980E] h-3 w-3 rounded-full top-2 -left-[17px]`}
                                        ></div>
                                        <div className="flex flex-col">
                                          <h1 className="flex gap-1 text-center items-center text-md md:text-xl font-semibold tracking-tight line-clamp-2">
                                            {project.projectName}{" "}
                                            {project.projectUrl && (
                                              <a
                                                href={project.projectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#FB980E] font-semibold text-sm"
                                              >
                                                <Link2 />
                                              </a>
                                            )}
                                          </h1>
                                         <StatusBadge status="selfAttested"/>
                                        </div>
                                      </div>
                                      {/* duration */}
                                      <div className="">
                                        <p className="text-[#006666] italic text-xs md:text-base text-nowrap">
                                          {
                                            <>
                                              {formatDate(
                                                project.duration.from,
                                              )}{" "}
                                              -{" "}
                                              {formatDate(project.duration.to)}
                                            </>
                                          }
                                        </p>
                                      </div>
                                    </div>
                                    {/* description of work */}
                                    <div className="mt-1">
                                      <p className="text-base">
                                        {project.description}
                                      </p>
                                      <p>
                                        <strong>Skills:</strong>{" "}
                                        {project.skills}
                                      </p>
                                    </div>
                                  </div>
                                );
                              },
                            )}
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
