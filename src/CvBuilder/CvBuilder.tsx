import { useState } from "react";
import { PersonalDetails } from "./PersonalDetails";
import { EducationDetails } from "./EducationDetails";
import { ExperienceDetails } from "./ExperienceDetails";
import { SkillDetails } from "./SkillsDetails";
import { ProjectDetails } from "./ProjectsDetails";
import { AwardDetails } from "./AwardDetails";
import { v4 as uuidv4 } from "uuid";
import api from "@/lib/api";
import toast from "react-hot-toast";
import HeaderButtons from "@/components/cvBuilder/HeaderButtonns";
//import NewCV from "./NewCV";
import { ArrowLeft, ArrowRight, EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";

//import { WalletSetupPopup } from "./WalletSetupGuide";
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
    phoneNumber: string;
    city: string;
    linkedInUrl: string;
    githubUrl: string;
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
   //const [showWalletSetup, setShowWalletSetup] = useState<boolean>(true);
  console.log("preview cv is", previewCV);
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
    console.log("cv file", cvFile);
    if (!cvFile) {
      toast.error("Please Upload a CV file");
      return false;
    }
    try {
      setIsParsing(true);
      const response = await api.post("/cv/cv-parse", formData);
      if (response.data.success) {
        localStorage.setItem("cvData", JSON.stringify(response.data.data));
        setShowParsedModel(false);
        return true;
      }
      return false;
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to parse CV");
      return false;
    } finally {
      setIsParsing(false);
    }
  };

  const clearParsedCV = () => {
    try {
      localStorage.removeItem("cvData");
      localStorage.removeItem("educations");
      localStorage.removeItem("experiences");
      localStorage.removeItem("projects");
      localStorage.removeItem("awards");
      localStorage.removeItem("skills");
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  // const onCloseWalletSetup = () => {
  //   setShowWalletSetup(false);
  //   localStorage.setItem("showWalletSetup", "false");
  // };

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1">
          <div className="col-span-7 p-2 sm:p-6 bg-slate-50 space-y-3">
            {/* {showWalletSetup && localStorage.getItem("showWalletSetup") !== "false" && <WalletSetupPopup onClose={onCloseWalletSetup} />} */}
            {/* {previewCV && <NewCV cvData={cvData} setPreviewCV={setPreviewCV} />} */}
            {/* <p className="text-xs text-[#f14419]"><strong>Note: </strong>You can edit your educational (if not verified through DigiLocker), experience, course certificates details only up to three times in case they are rejected by the issuer. Please enter your information carefully. For any queries or issues, reach out to us at <a href="mailto:support@edubuk.com" className="text-[#006666] underline">support@edubuk.com</a> or <a href="mailto:support@edubukeseal.org" className="text-[#006666] underline">support@edubukeseal.org</a></p> */}
            {/* Step 1 */}
            <div className="flex justify-between items-center">
             <Link
             to={`/dashboard?tab=cv`}
             className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 cursor-pointer transition-all duration-200 shadow-sm hover:border-[#036665] hover:text-[#036665] hover:-translate-y-px hover:shadow-md"
             ><EyeIcon size={16}/>Preview CV</Link>
             </div>
            <HeaderButtons
              step={step}
              setStep={setStep}
              clearParsedCV={clearParsedCV}
              cvData={cvData}
              cvFile={cvFile}
              isParsing={isParsing}
              parseCV={parseCV}
              previewCV={previewCV}
              setCvFile={setCvFile}
              setPreviewCV={setPreviewCV}
              setShowParsedModel={setShowParsedModel}
              showParsedModel={showParsedModel}
            />

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

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end">
                <button
                  type="button"
                  disabled={step <= 1}
                  onClick={() => setStep((s) => Math.max(1, (s || 1) - 1))}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-700 shadow-sm transition hover:border-[#006666] hover:text-[#006666] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none sm:w-auto sm:min-w-[130px] sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <ArrowLeft className="size-4 shrink-0" />
                  <span>Previous step</span>
                </button>

                <button
                  type="button"
                  disabled={step >= 7}
                  onClick={() => setStep((s) => Math.min(7, (s || 1) + 1))}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[#03257e] px-3 py-2 text-xs font-semibold leading-5 text-white shadow-sm transition hover:bg-[#006666] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto sm:min-w-[130px] sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <span>Next step</span>
                  <ArrowRight className="size-4 shrink-0" />
                </button>

                <Link
                  to="/dashboard?tab=cv"
                  className="col-span-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#00666]/20 bg-[#006666] px-4 py-2 text-xs font-semibold leading-5 text-white shadow-sm transition hover:border-[#006666] hover:bg-[#006666] hover:text-white sm:w-auto sm:text-sm"
                >
                  <span>Submit CV</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
