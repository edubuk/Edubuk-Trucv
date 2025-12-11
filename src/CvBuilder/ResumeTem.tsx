import { useRef, useState} from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

//import { useReactToPrint } from "react-to-print";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";

// import { SiHyperskill } from "react-icons/si";
// import { FaBriefcase } from "react-icons/fa";
// import { GiAchievement } from "react-icons/gi";
// import { BiSolidBriefcase } from "react-icons/bi";
// import { GraduationCap, Mail, MapPinned, Phone } from "lucide-react";
// import { MdSchool } from "react-icons/md";
// import HyperText from "@/components/ui/AnimateHypertext";
// import ShowVerifications from "@/components/ShowVerifications";
// import { ShowAnimatedVerifications } from "@/components/ShowAnimatedVerifications";

import { ICvData } from "./CvBuilder";
import { TypeAward, TypeEducation, TypeExperience, TypeProject, TypeSkill } from "./cvSchema";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
//import PdfDownloader from "@/components/PDFDownloader/PdfDownloader";

const Resume = ({cvData,setPreviewCV}:{cvData:ICvData,setPreviewCV:React.Dispatch<React.SetStateAction<boolean>>}) => {
  // const [copied, setCopied] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [title,setTitle] = useState("")
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
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



  // const handlePrint = useReactToPrint({
  //   contentRef: pdfRef,
  //   documentTitle: "My CV"
  // });
  if (!cvData) {
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

    const createCv = async()=>{
      if(!title){
        toast.error("Please enter a title")
        return
      }
    try {
      setLoading(true);
      const res = await api.post("/cv/create-cv",{data:cvData,title:title})
      if(res.status === 200){
        toast.success("CV Created Successfully")
        navigate("/dashboard")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }finally{
      setLoading(false);
    }
  }

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
      onClick={(prev)=>setPreviewCV(!prev)} // click outside to close
    >
      {/* modal dialog — stop propagation so clicks inside won't close */}
      <div
        className="relative w-full max-w-[1100px] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={(prev)=>setPreviewCV(!prev)}
          className="absolute -top-3 -right-3 z-60 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 hover:scale-95 transition"
          aria-label="Close preview"
        >
          ✕
        </button>
        <div className="flex items-center gap-2">
       {loading?<Loader2 className="animate-spin text-[#006666]" />:<button 
       onClick={createCv} 
       className="bg-green-600 px-3 py-2 mb-2 text-white text-center rounded"
       >
        Create CV</button>
        }
       <input type="text" placeholder="Enter resume title"
       onChange={(e)=>setTitle(e.target.value)}
       className="w-full rounded px-3 py-2 mb-2 md:w-[200px]"
       ></input>
       </div>
          {/* modal content — make scrollable and nicely padded */}
        <div
          ref={pdfRef}
          className="bg-white rounded-lg overflow-auto max-h-[90vh] no-scrollbar print-area"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div id="cv-preview-wrapper" className="px-6 py-5 font-family">
            <header className="pb-4 mb-4 text-center">
              <h1 className="text-4xl font-semibold text-[#000000]">
                {cvData.personal.fullName}
              </h1>

              <div className="text-gray-600 mt-4 flex flex-col sm:flex-row sm:justify-center sm:flex-wrap gap-2">
                {/* Phone */}
                <div className="flex items-center space-x-2 px-2 leading-[1.25] align-middle">
                  <span className="inline-flex items-center align-middle">
                    <FaPhoneAlt className="text-sm text-[#000000]" />
                  </span>
                  <span className="text-gray-800 hover:text-[#000000] font-semibold inline-flex items-center align-middle">
                    {cvData.personal.phone}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-2 px-2 leading-[1.25] align-middle">
                  <span className="inline-flex items-center align-middle">
                    <FaEnvelope className="text-sm text-[#000000]" />
                  </span>
                  <a
                    href={`mailto:${cvData?.personal?.email}`}
                    className="text-gray-800 hover:text-[#000000] font-semibold inline-flex items-center align-middle"
                  >
                    {cvData?.personal?.email}
                  </a>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center space-x-2 px-2 leading-[1.25] align-middle">
                  <span className="inline-flex items-center align-middle">
                    <FaLinkedin className="text-sm text-[#000000]" />
                  </span>
                  <a
                    href={cvData?.personal?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-[#000000] font-semibold inline-flex items-center align-middle"
                  >
                    LinkedIn
                  </a>
                </div>

                {/* GitHub */}
                <div className="flex items-center space-x-2 px-2 leading-[1.25] align-middle">
                  <span className="inline-flex items-center align-middle">
                    <FaGithub className="text-sm text-[#000000]" />
                  </span>
                  <a
                    href={cvData?.personal?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-[#000000] font-semibold inline-flex items-center align-middle"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </header>

            {/* Education Section */}
            {cvData?.educations?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                  Education
                </h2>
                {cvData?.educations?.map((edu:TypeEducation) => (
                  <div className="mt-2 space-y-1" key={edu.id ?? edu.institutionName}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-[#000000] ">
                          {edu.institutionName}
                        </h3>
                        <i className="text-[#000000] font-serif">{edu.boardNameOrDegree}</i>
                      </div>
                      <div className="text-right">
                        <p className="text-[#000000] font-serif">
                          {edu.duration?.from} - {edu.duration?.to}
                        </p>
                        <p className="text-[#000000] font-semibold font-serif">GPA: {edu.gpa}/10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            {cvData?.skills.length>0 && <section className="mb-4">
              <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                Skills
              </h2>
              <div className="flex justify-start items-center gap-1 mt-2">
              {
                cvData?.skills?.map((skill:TypeSkill,i)=>(
                    <p key={i} className="border px-2 py-1 font-bold rounded-full ">{skill?.skillName}</p>
                ))
              }
               </div>
            </section>}

            {/* Experience */}
            {cvData?.experiences?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                  Experience
                </h2>
                {cvData.experiences.map((exp:TypeExperience, index) => (
                  <div className="mt-2" key={index}>
                    <div className="flex justify-between items-center">
                      <div className="flex justify-center flex-col items-start gap-1">
                        <h3 className="font-bold text-[#000000]">{exp.companyName}</h3>
                        <i>{exp.jobRole}</i>
                      </div>
                      <p className="text-[#000000] text-right">
                        {exp.duration.from}-{exp.duration.to}
                      </p>
                    </div>
                    <ul className="list-disc list-inside text-[#000000] mt-2 pl-6">
                      {exp.description !== "" &&
                        exp.description
                          .split(".")
                          .filter((point) => point.trim() !== "")
                          .map((point, i) => (
                            <li key={i}>{point.endsWith(".") ? point : `${point}.`}</li>
                          ))}
                      <li >Skills: <strong>{exp.skills}</strong></li>
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {/* projects */}
            {cvData?.projects?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                  Projects
                </h2>
                {cvData.projects.map((project:TypeProject, i) => (
                  <div key={i} className="mt-2 space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[#000000]">{project.projectName}</h3>
                        <p className="text-[#000000] text-right">
                          {project.duration.from} - {project.duration.to}
                        </p>
                      </div>
                      <ul className="list-disc list-inside text-[#000000] mt-2 pl-6">
                        {project?.description !== "" &&
                        project?.description?.split(".")
                          .filter((point) => point.trim() !== "")
                          .map((point, i) => (
                            <li key={i}>{point.endsWith(".") ? point : `${point}.`}</li>
                          ))}
                          <li >Skills: <strong>{project.skills}</strong></li>
                      </ul>
                    </div>
                  </div>
                ))}
              </section>
            )}
            {/* Awards */}
            {cvData?.awards?.length > 0 &&(
              <section className="mb-4">
                <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                  Awards/Certificates
                </h2>
                {cvData.awards.map((award:TypeAward, i) => (
                  (award.level==="Award"|| award.level==="Certificate")&&<div key={i} className="mt-2 space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[#000000]">{award.name}</h3>
                        <p className="text-[#000000] text-right">
                          {award.duration.from}
                        </p>
                      </div>
                      <ul className="list-disc list-inside text-[#000000] mt-2 pl-6">
                        {award.description
                          .split(".")
                          .filter((point) => point.trim() !== "")
                          .map((point, i) => (
                            <li key={i}>{point.endsWith(".") ? point : `${point}.`}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </section>
            )}
            {/* Awards */}
            {cvData?.awards?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                  Courses
                </h2>
                {cvData.awards.map((award:TypeAward, i) => (
                  (award.level==="Course")&&<div key={i} className="mt-2 space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[#000000]">{award.name}</h3>
                        <p className="text-[#000000] text-right">
                          {award.duration.from} - {award.duration.to}
                        </p>
                      </div>
                      <ul className="list-disc list-inside text-[#000000] mt-2 pl-6">
                        {award.description
                          .split(".")
                          .filter((point) => point.trim() !== "")
                          .map((point, i) => (
                            <li key={i}>{point.endsWith(".") ? point : `${point}.`}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
