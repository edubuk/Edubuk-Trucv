import React, { useEffect, useRef, useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaCopy,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";
//import { PDFDownloadLink } from "@react-pdf/renderer";
//import { CVDocument } from "@/components/PDFDownloader/ReactPDF";
import { useReactToPrint } from "react-to-print";
// import { SiHyperskill } from "react-icons/si";
// import { FaBriefcase } from "react-icons/fa";
// import { GiAchievement } from "react-icons/gi";
// import { BiSolidBriefcase } from "react-icons/bi";
// import { GraduationCap, Mail, MapPinned, Phone } from "lucide-react";
// import { MdSchool } from "react-icons/md";
// import HyperText from "@/components/ui/AnimateHypertext";
// import ShowVerifications from "@/components/ShowVerifications";
// import { ShowAnimatedVerifications } from "@/components/ShowAnimatedVerifications";

import toast from "react-hot-toast";
import { useUserData } from "@/context/AuthContext";
import api from "@/lib/api";
import { ICvData } from "@/CvBuilder/CvBuilder";
import { TypeAward, TypeEducation, TypeExperience, TypeProject, TypeSkill } from "@/CvBuilder/cvSchema";
//import PdfDownloader from "@/components/PDFDownloader/PdfDownloader";

const Resume: React.FC = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const { user } = useUserData();
  const [cvData,setCvData] = useState<ICvData>({
      personal:{
        fullName:"",
        email:"",
        phone:"",
        city:"",
        linkedin:"",
        github:"",
        summary:"",
      },
      educations:[],
      experiences:[],
      skills:[],
      projects:[],
      awards:[],
    })

      const pageStyle = `
    @media all {
  .page-break {
    display: none;
  }
}

@media print {
  html, body {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
  }
}

@media print {
  .page-break {
    margin-top: 1rem;
    display: block;
    page-break-before: auto;
  }
}

@page {
  size: auto;
  margin: 20mm;
}
  `;

  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: "My CV",
    pageStyle, // inject the styles into print document
  });
  
  const [loading,setLoading] = useState(false);
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
  const userCv = async()=>{
        try {
          setLoading(true);
          const res:any = await api.get(`/cv/user-cv/${id}`);
          if(res.data.success)
          {
            setCvData({personal:res.data.data.personal,educations:res.data.data.educations,experiences:res.data.data.experiences,skills:res.data.data.skills,projects:res.data.data.projects,awards:res.data.data.awards});
          }
          console.log("data",res.data)
        } catch (error) {
          toast.error("something went wrong");
             console.log("error while fetching docs",error)
        }finally{
          setLoading(false);
        }
       }

  useEffect(()=>{
    userCv();
  },[])
  
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
    <div className="flex flex-col gap-4">
      {user && (
        <div className="flex justify-end p-4 gap-2">
          <div>
            <button onClick={handlePrint}
            className="rounded bg-green-600 px-3 py-2 text-white cursor-pointer"
            >Print</button>
          </div>
          <div
            className="flex items-center gap-2 border-2 border-[#03257e] px-2 py-1 rounded cursor-pointer text-[#03257e] hover:text-[#006666]"
            onClick={() =>
              copyResumeLink(`https://www.edubuktrucv.com/new-cv/${id}`)
            }
          >
            <FaCopy />
            <span className="font-medium">
              {copied ? "Copied" : "Copy Template Link"}
            </span>
          </div>
          {/* <PDFDownloadLink
            document={<CVDocument cvData={cvData} id={id} />}
            fileName={`${user.name}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                "Preparing document..."
              ) : (
                <button className="flex items-center bg-[#006666] text-white px-4 py-2 rounded">
                  <FaDownload className="mr-2" />
                  Download as PDF
                </button>
              )
            }
          </PDFDownloadLink> */}
        </div>
      )}
      <div
        className="font-family min-h-screen flex justify-center px-4 py-3 overflow-hidden w-full shadow border-t"
      >
        <div
          className="bg-white rounded-lg overflow-auto max-h-[90vh] no-scrollbar print-area shadow-lg w-full md:w-[800px]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div ref={pdfRef} id="cv-preview-wrapper" className="px-6 py-5 font-family">
            <div>
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
                {cvData?.educations?.map((edu: TypeEducation) => (
                  <div
                    className="mt-2 space-y-1"
                    key={edu.id ?? edu.institutionName}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-[#000000] ">
                          {edu.institutionName}
                        </h3>
                        <i className="text-[#000000] font-serif">
                          {edu.boardNameOrDegree}
                        </i>
                      </div>
                      <div className="text-right">
                        <p className="text-[#000000] font-serif">
                          {edu.duration?.from} - {edu.duration?.to}
                        </p>
                        <p className="text-[#000000] font-semibold font-serif">
                          GPA: {edu.gpa}/10
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            {cvData?.skills.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                  Skills
                </h2>
                <div className="flex justify-start items-center gap-1 mt-2">
                  {cvData?.skills?.map((skill: TypeSkill, i) => (
                    <p
                      key={i}
                      className="border px-2 py-1 font-bold rounded-full "
                    >
                      {skill?.skillName}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {cvData?.experiences?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                  Experience
                </h2>
                {cvData.experiences.map((exp: TypeExperience, index) => (
                  <div className="mt-2" key={index}>
                    <div className="flex justify-between items-center">
                      <div className="flex justify-center flex-col items-start gap-1">
                        <h3 className="font-bold text-[#000000]">
                          {exp.companyName}
                        </h3>
                        <i>{exp.jobRole}</i>
                      </div>
                      <p className="text-[#000000] text-right">
                        {exp.duration.from} - {exp.duration.to}
                      </p>
                    </div>
                    <ul className="list-disc list-inside text-[#000000] mt-2 pl-6">
                      {exp.description !== "" &&
                        exp.description
                          .split(".")
                          .filter((point) => point.trim() !== "")
                          .map((point, i) => (
                            <li key={i}>
                              {point.endsWith(".") ? point : `${point}.`}
                            </li>
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
                {cvData.projects.map((project: TypeProject, i) => (
                  <div key={i} className="mt-2 space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[#000000]">
                          {project.projectName}
                        </h3>
                        <p className="text-[#000000] text-right">
                          {project.duration.from} - {project.duration.to}
                        </p>
                      </div>
                      <ul className="list-disc list-inside text-[#000000] mt-2 pl-6">
                        {project?.description !== "" &&
                          project?.description
                            ?.split(".")
                            .filter((point) => point.trim() !== "")
                            .map((point, i) => (
                              <li key={i}>
                                {point.endsWith(".") ? point : `${point}.`}
                              </li>
                            ))}
                            <li >Skills: <strong>{project.skills}</strong></li>
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
                  Awards/Certificates
                </h2>
                {cvData.awards.map(
                  (award: TypeAward, i) =>
                    (award.level === "Award" ||
                      award.level === "Certificate") && (
                      <div key={i} className="mt-2 space-y-4">
                        <div>
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-[#000000]">
                              {award.name}
                            </h3>
                            <p className="text-[#000000] text-right">
                              {award.duration.from} - {award.duration.to}
                            </p>
                          </div>
                          <ul className="list-disc list-inside text-[#000000] mt-2 pl-6">
                            {award.description
                              .split(".")
                              .filter((point) => point.trim() !== "")
                              .map((point, i) => (
                                <li key={i}>
                                  {point.endsWith(".") ? point : `${point}.`}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )
                )}
              </section>
            )}
            {/* Awards */}
            {cvData?.awards?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xl font-semibold text-[#000000] border-b border-black pb-2">
                  Courses
                </h2>
                {cvData.awards.map(
                  (award: TypeAward, i) =>
                    award.level === "Course" && (
                      <div key={i} className="mt-2 space-y-4">
                        <div>
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-[#000000]">
                              {award.name}
                            </h3>
                            <p className="text-[#000000] text-right">
                              {award.duration.from} - {award.duration.to}
                            </p>
                          </div>
                          <ul className="list-disc list-inside text-[#000000] mt-2 pl-6">
                            {award.description
                              .split(".")
                              .filter((point) => point.trim() !== "")
                              .map((point, i) => (
                                <li key={i}>
                                  {point.endsWith(".") ? point : `${point}.`}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )
                )}
              </section>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
