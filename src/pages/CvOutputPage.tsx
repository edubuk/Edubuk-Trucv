import { useParams } from "react-router-dom";
import { SiHyperskill } from "react-icons/si";
import { FaBriefcase, FaCopy } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import { BiSolidBriefcase } from "react-icons/bi";
import { CheckCircle, CircleUser, GraduationCap, Link2, Mail, MapPinned, Phone } from "lucide-react";
// import HyperText from "@/components/ui/AnimateHypertext";
import ShowVerifications from "@/components/ShowVerifications";
import { ShowAnimatedVerifications } from "@/components/ShowAnimatedVerifications";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";
import api from "@/lib/api";
//import { useUserData } from "@/context/AuthContext";
import { ICvData } from "@/CvBuilder/CvBuilder";
import {
  TypeAward,
  TypeEducation,
  TypeExperience,
  TypeProject,
  TypeSkill,
} from "@/CvBuilder/cvSchema";
import { MdSchool } from "react-icons/md";
import StatusBadge from "@/CvBuilder/StatusBadge";
const COLOR_TEAL = "#006666";
const formatDate = (dateString: string) => {
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

  return `${month} ${day} ${year}`;
};
const CvOutputPage = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  //const { user } = useUserData();
  const [cvData, setCvData] = useState<ICvData>({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      linkedin: "",
      github: "",
      summary: "",
      imgUrl: "",
      profession:"",
    },
    educations: [],
    experiences: [],
    skills: [],
    projects: [],
    awards: [],
  });

  // const handlePrint = useReactToPrint({
  //   contentRef: pdfRef,
  //   documentTitle: "My CV",
  //   pageStyle, // inject the styles into print document
  // });

  const [loading, setLoading] = useState(false);
  //   const handlePrint = useReactToPrint({
  //   contentRef: pdfRef,
  //   documentTitle: "My CV"
  // });
  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   console.log("date", dateString);
  //   const formatedDate = date.toLocaleDateString("en-GB", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   });
  //   console.log("formated date", formatedDate);
  //   if (formatedDate == "Invalid Date" || formatedDate == "1 Jan 1970") {
  //     return "Present";
  //   }
  //   return formatedDate;
  // };
  const userCv = async () => {
    try {
      setLoading(true);
      const res: any = await api.get(`/cv/user-cv/${id}`);
      if (res.data.success) {
        setCvData({
          personal: res.data.data.personal,
          educations: res.data.data.educations,
          experiences: res.data.data.experiences,
          skills: res.data.data.skills,
          projects: res.data.data.projects,
          awards: res.data.data.awards,
        });
      }
      console.log("data", res.data);
    } catch (error) {
      toast.error("something went wrong");
      console.log("error while fetching docs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userCv();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <h1 className="text-4xl font-bold text-[#03257e]">
          <ThreeDotLoader w={4} h={4} yPos={"center"} />
        </h1>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-4xl font-bold text-[#006666]">No CV Found</h1>
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
    <div className="px-1 mt-5 md:mt-0 md:px-10 mb-10 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 px-4 py-4">
        <h1 className="text-xl md:text-2xl text-center font-bold text-[#006666]">
          Verified Curriculum Vitae (CV) on the Blockchain
        </h1>

        <Link
          to={`/new-cv/${id}`}
          className="px-4 py-2 border-2 border-[#f14419] text-[#f14419] font-semibold rounded-lg hover:bg-[#f14419] hover:text-white transition duration-200"
        >
          View Other Template
        </Link>

        <div
          className="flex items-center gap-2 cursor-pointer text-[#03257e] hover:text-[#006666]"
          onClick={() => copyResumeLink(`https://www.edubuktrucv.com/cv/${id}`)}
        >
          <FaCopy />
          <span className="font-medium">
            {copied ? "Copied" : "Copy CV Link"}
          </span>
        </div>
      </div>
      <div className="w-full text-center text-[#F1441C] text-lg mt-2 lg:hidden">
        👉 Swipe left/right to view the full CV
      </div>
      <div
        ref={pdfRef}
        className=" mt-2 max-w-6xl mx-auto w-full border  border-l-0 shadow-lg   rounded-md overflow-x-scroll xl:overflow-x-clip"
      >
        {/* main */}
        <div className="flex gap-3 md:gap-7">
          {/* left sidebar */}
          <div className="w-72  h-auto  bg-[#006666] rounded-ss-2xl px-2 md:px-5 text-white py-2 space-y-20 md:space-y-10">
            {/* image */}
          {cvData.personal.imgUrl?<div className="mt-5">
            <img
              src={cvData.personal.imgUrl}
              alt="image"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 mx-auto border-[#449298] object-cover"
            />
            <ShowVerifications
              isAttested={
                true
              }
              className="flex justify-center mt-2"
              onlySelfAttest
              textClass="text-white"
              fillCheck
              fillcheckClass="mt-1"
            />
          </div>:<div className="mt-5">
            <CircleUser size={24} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 mx-auto border-[#449298] object-cover"
            />
          </div>}

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
                            <StatusBadge status={education.status} isEmailSend={education.isEmailSend}/>
                            </div>
                            {/* meta row: degree, gpa and duration */}
                            <div className="mt-2 flex flex-col gap-2">
                              <div className="text-sm flex flex-col justify-start text-white dark:text-gray-300">
                                <span className="font-medium text-white">
                                  {education.boardNameOrDegree || "—"}
                                </span>
                                <span className="font-normal ml-0 md:ml-2">
                                  GPA: {education.gpa ?? "—"}
                                </span>{" "}
                              </div>

                              {/* optional duration on the right for larger screens */}
                              <div className="text-sm text-white">
                                {education.duration?.from || "—"}{" "}
                                {education.duration?.to
                                  ? `— ${education.duration.to}`
                                  : ""}
                              </div>
                            </div>
                          </div>
                        );
                      }
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

                <ShowVerifications
                  isAttested={
                    true
                  }
                  onlySelfAttest
                />
              </div>
              {/* personal details */}
              <div className="bg-[#006666] rounded-md text-white px-5 py-1 flex md:max-w-3xl w-full gap-2">
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
                        isAttested={
                          true
                        }
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
                        isAttested={
                          true
                        }
                        className="self-start mt-2"
                        onlySelfAttest
                        textClass="text-white"
                        badge
                      />
                    </div>
                  </div>
                </div>
                {/* phoneNumber and profesion */}
                <div className="w-full">
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
                          <span className="flex item-center gap-1"><MdSchool
                            size={26}
                            className="h-4 w-4 md:h-5 md:w-5 mt-1"
                          />Student </span> 
                        ) : (
                          <span className="flex item-center gap-1"> <FaBriefcase
                            size={26}
                            className="h-4 w-4 md:h-5 md:w-5 mt-1"
                          />Employee</span>
                        )}
                      </div>
                      <h1 className="text-sm md:text-base tracking-wider font-normal">
                        {cvData.personal.profession}
                      </h1>
                      <ShowVerifications
                        isAttested={
                          true
                        }
                        // className="self-start mt-2"
                        onlySelfAttest
                        textClass="text-white"
                        badge
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* profile summary */}
              <div className="flex gap-5 items-center  overflow-hidden">
                <p className="text-sm md:text-base font-semibold  max-w-md lg:max-w-2xl">
                  {cvData.personal?.summary}
                </p>
                <ShowVerifications
                  // isAttested={
                  //   cvData.profileSummaryVerification.profile_summary
                  //     .isSelfAttested
                  // }
                  isAttested={true}
                  className="self-start mt-2"
                  onlySelfAttest
                  // textClass="text-white"
                />
              </div>

              {/* skill section */}
              {/* skills */}
              <div className="mt-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center">
                    <SiHyperskill size={20} />
                  </div>
                  <h1 className="text-2xl font-semibold tracking-wider uppercase">
                    Skills
                  </h1>
                </div>

                {/* showcasing skills */}
                <div className="">
                  <div className="flex flex-col  mt-2 gap-5 md:gap-3 ">
                    {cvData.skills.length > 0 &&
                      cvData.skills.map((skill:TypeSkill) => {
                        // const isSelfAttested =
                        //   cvData.skillsVerifications[skill.skillName]
                        //     .isSelfAttested || false;
                        const isSelfAttested = true;
                        const mailStatus = skill.endoresBy
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
                            {skill.endoresBy&&<span>Endorsed by 
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
                              style={{ backgroundColor: COLOR_TEAL + "1a", color: COLOR_TEAL }}
                            >
                            <CheckCircle className="h-3.5 w-3.5" /> {skill.endoresBy.slice(0,2)}...{skill.endoresBy.slice(-4)}
                            </span>
                              </span>}
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

                  {cvData.experiences.map((exp:TypeExperience, index) => {
                    //const verificationKey = exp.c;
                    // const isSeflAtetsted =
                    //   cvData.experienceVerifications[verificationKey]
                    //     .isSelfAttested || false;
                    const isSeflAtetsted = true;
                    const mailStatus = exp.status
                    const hash = exp.docHash;
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
                              <ShowVerifications
                                isAttested={isSeflAtetsted}
                                mailStatus={mailStatus}
                                hash={hash}
                                className="ml-5 mt-1"
                              />
                              <StatusBadge status={exp.status} isEmailSend={exp.isEmailSend}/>
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievements */}
              {((cvData.awards.length>0 || cvData.projects.length>0) && (
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
                          {cvData.awards.map((award:TypeAward, index) => {
                            //const verificationKey = award.award_name;
                            const isSelfAttetsted = true;
                            const hash = award.docUri;
                            const mailStatus = award.status
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
                                      <ShowVerifications
                                        isAttested={isSelfAttetsted}
                                        mailStatus={mailStatus}
                                        hash={hash}
                                        className="ml-5 mt-1"
                                      />
                                      <StatusBadge status={award.status} isEmailSend={award.isEmailSend}/>
                                      </div>
                                    </div>
                                  </div>
                                  {/* duration */}
                                  <div className="">
                                    <p className="text-[#006666] italic text-xs md:text-base">
                                      {award.duration.from}
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
                            (project:TypeProject, index) => {
                              //const verificationKey = project.project_name;
                              const isSelfAttested = true;
                              return (
                                <div key={index} className="flex flex-col ml-3">
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
                                        <ShowVerifications
                                          isAttested={isSelfAttested}
                                          className="ml-5 mt-1"
                                        />
                                      </div>
                                    </div>
                                    {/* duration */}
                                    <div className="">
                                      <p className="text-[#006666] italic text-xs md:text-base text-nowrap">
                                        {
                                          <>
                                            {project.duration.from} -{" "}
                                            {project.duration.to}
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
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvOutputPage;
