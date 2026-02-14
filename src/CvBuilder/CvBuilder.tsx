import { useState } from "react";
import { PersonalDetails } from "./PersonalDetails";
import { EducationDetails } from "./EducationDetails";
import { ExperienceDetails } from "./ExperienceDetails";
import { SkillDetails } from "./SkillsDetails";
import { ProjectDetails } from "./ProjectsDetails";
import { AwardDetails } from "./AwardDetails";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@mui/material";
import NewCV from "./NewCV";
import { UploadIcon } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
// import { EducationFormValues, ExperienceFormValues } from "./cvSchema";
//import { dummyCvData } from "./cvDummyData";

// --- Helpers ---
const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const docId = () => uuidv4();

export interface ICvData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    linkedin: string;
    github: string;
    summary: string;
    imgUrl: string;
    profession: string;
  };
  educations: [];
  experiences: [];
  skills: [];
  projects: [];
  awards: [];
}

// --- Main Component ---
export default function CVBuilder() {
  const [step, setStep] = useState<number>(1); // which accordion is open
  const [previewCV, setPreviewCV] = useState<boolean>(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [showParsedModel, setShowParsedModel] = useState<boolean>(false);
  const [cvData, setCvData] = useState<any>({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      linkedin: "",
      github: "",
      summary: "",
      imgUrl: "",
    },
    educations: [],
    experiences: [],
    skills: [],
    projects: [],
    awards: [],
  });

  console.log("cvData", cvData);

  const parseCV = async () => {
    const formData = new FormData();
    formData.append("file", cvFile as File);
    if (!cvFile) {
      toast.error("Please Upload a CV file");
      return;
    }
    try {
      setIsParsing(true);
      const response = await api.post("/cv/cv-parse", formData);
      if (response.data.success) {
        localStorage.setItem("cvData", JSON.stringify(response.data.data));
        localStorage.setItem(
          "educations",
          JSON.stringify(response.data.data.educations),
        );
        localStorage.setItem(
          "experiences",
          JSON.stringify(response.data.data.experiences),
        );
        localStorage.setItem(
          "projects",
          JSON.stringify(response.data.data.projects),
        );
        localStorage.setItem(
          "awards",
          JSON.stringify(response.data.data.awards),
        );
        localStorage.setItem(
          "skills",
          JSON.stringify(response.data.data.skills),
        );
        setShowParsedModel(false);
      }
      console.log("response", response);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to parse CV");
    } finally {
      setIsParsing(false);
    }
  };

  const clearParsedCV = () => {
    localStorage.removeItem("cvData");
    localStorage.removeItem("educations");
    localStorage.removeItem("experiences");
    localStorage.removeItem("projects");
    localStorage.removeItem("awards");
    localStorage.removeItem("skills");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1">
          <div className="col-span-7 p-2 sm:p-6 bg-slate-50 space-y-3">
            <div className="flex justify-between items-center">
              <button
                className="bg-[#008888] text-white px-3 py-1 rounded border shadow-lg"
                onClick={() => setPreviewCV(true)}
              >
                Preview CV
              </button>
              {previewCV && (
                <NewCV cvData={cvData} setPreviewCV={setPreviewCV} />
              )}
              {/* <div className="flex gap-1">
              {dummyCvData.map((cvData,i)=>{
                return(
                  <button key={i} onClick={()=>{setCvData(cvData);setPreviewCV(true)}} className="bg-[#008888] text-white px-3 py-1 rounded border shadow-lg">{cvData.personal.fullName}</button>
                )
              })}
            </div> */}
              {localStorage.getItem("cvData")?
              <div className="flex gap-1">
              <p className="border-dashed border-2 border-gray-300 px-2 py-1 rounded">CV Parsed</p>
              <button onClick={clearParsedCV} className="bg-red-500 text-white px-2 py-1 rounded">Clear Parsed CV</button>
              </div>
              :<button
                className="bg-[#03257e] text-white px-2 py-1 rounded"
                onClick={() => setShowParsedModel(true)}
                disabled={isParsing}
              >
                Import Your CV
              </button>}
              {showParsedModel && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
                  {/* Modal Card */}
                  <div className="bg-white w-[90%] max-w-md rounded-xl shadow-2xl p-6 relative">
                    {/* Close Button (optional) */}
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-black"
                      onClick={() => setShowParsedModel(false)}
                    >
                      ✕
                    </button>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
                      Upload your CV to make it auto-fill in each below section
                    </h2>

                    {/* Hidden File Input */}
                    <input
                      className="hidden"
                      type="file"
                      id="cv-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    />

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Upload Button */}
                      {!cvFile && (
                        <label
                          htmlFor="cv-upload"
                          className="flex items-center gap-2 bg-[#006666] text-white px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition"
                        >
                          <UploadIcon />
                          Upload CV
                        </label>
                      )}

                      {/* Selected File */}
                      {cvFile && (
                        <div className="w-full text-center text-sm text-gray-600 border rounded-md px-3 py-2">
                          {cvFile.name}
                        </div>
                      )}

                      {/* Parse Button */}
                      <button
                        onClick={parseCV}
                        disabled={isParsing || !cvFile}
                        className="bg-[#03257e] text-white px-6 py-2 rounded-lg w-full
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-[#021d5f] transition"
                      >
                        {isParsing ? "Parsing..." : "Parse CV"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* <p className="text-xs text-[#f14419]"><strong>Note: </strong>You can edit your educational (if not verified through DigiLocker), experience, course certificates details only up to three times in case they are rejected by the issuer. Please enter your information carefully. For any queries or issues, reach out to us at <a href="mailto:support@edubuk.com" className="text-[#006666] underline">support@edubuk.com</a> or <a href="mailto:support@edubukeseal.org" className="text-[#006666] underline">support@edubukeseal.org</a></p> */}
            {/* Step 1 */}

            <PersonalDetails
              step={step}
              setStep={setStep}
              uid={uid}
              docId={docId}
              setCvData={setCvData}
              cvData={cvData}
            />
            {/* Step 2 */}
            <EducationDetails
              step={step}
              setStep={setStep}
              uid={uid}
              docId={docId}
              setCvData={setCvData}
              cvData={cvData}
            />

            <ExperienceDetails
              step={step}
              setStep={setStep}
              uid={uid}
              docId={docId}
              setCvData={setCvData}
              cvData={cvData}
            />

            <SkillDetails
              step={step}
              setStep={setStep}
              uid={uid}
              docId={docId}
              setCvData={setCvData}
              cvData={cvData}
            />

            <ProjectDetails
              step={step}
              setStep={setStep}
              uid={uid}
              docId={docId}
              setCvData={setCvData}
              cvData={cvData}
            />

            <AwardDetails
              step={step}
              setStep={setStep}
              uid={uid}
              docId={docId}
              setCvData={setCvData}
              cvData={cvData}
            />

            {/* <ProfileSummary step={step} setStep={setStep} uid={uid} docId = {docId}/> */}

            <div className="pt-4 border-t mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                {step ? `Open: Step ${step} of 7` : "No step open"}
              </div>
              <div className="flex gap-2">
                <Button
                  disabled={step === 1}
                  onClick={() => setStep((s) => Math.max(1, (s || 1) - 1))}
                  className="px-3 py-1 rounded border"
                >
                  Prev Step
                </Button>
                <Button
                  disabled={step === 6}
                  onClick={() => setStep((s) => Math.min(6, (s || 1) + 1))}
                  className="px-3 py-1 rounded bg-[#03257e] text-white"
                >
                  Next Step
                </Button>
                <button
                  className="bg-[#008888] text-white px-3 py-1 rounded border shadow-lg"
                  onClick={() => setPreviewCV(true)}
                >
                  Preview CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
