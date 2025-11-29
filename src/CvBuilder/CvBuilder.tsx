import { useState } from "react";
import { PersonalDetails } from "./PersonalDetails";
import { EducationDetails } from "./EducationDetails";
import { ExperienceDetails } from "./ExperienceDetails";
import { SkillDetails } from "./SkillsDetails";
import { ProjectDetails } from "./ProjectsDetails";
import { AwardDetails } from "./AwardDetails";
import { v4 as uuidv4 } from "uuid";
import Resume from "./ResumeTem";
// import { EducationFormValues, ExperienceFormValues } from "./cvSchema";


// --- Helpers ---
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const docId = ()=>uuidv4();

export interface ICvData{
      personal:{
      fullName:string,
      email:string,
      phone:string,
      city:string,
      linkedin:string,
      github:string,
      summary:string,
    },
    educations:[],
    experiences:[],
    skills:[],
    projects:[],
    awards:[],
}

// function StepCard({
//   index,
//   title,
//   icon: Icon,
//   open,
//   onToggle,
//   children,
// }: {
//   index: number;
//   title: string;
//   icon: any;
//   open: boolean;
//   onToggle: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
//       <button
//         type="button"
//         onClick={onToggle}
//         className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
//         aria-expanded={open}
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-full bg-[#03257e] text-white flex items-center justify-center text-sm font-bold">
//             {index}
//           </div>
//           <div className="flex items-center gap-2 text-[#03257e] font-semibold">
//             <Icon size={18} />
//             <span>{title}</span>
//           </div>
//         </div>
//         {open ? <ChevronDown size={18} className="text-slate-500"/> : <ChevronRight size={18} className="text-slate-500"/>}
//       </button>
//       <div
//         className={`transition-[grid-template-rows] duration-300 ease-in-out grid ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
//       >
//         <div className="overflow-hidden">
//           <div className="px-4 pb-4 border-t border-slate-100">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// --- Main Component ---
export default function CVBuilder() {
  const [step, setStep] = useState<number>(1); // which accordion is open
  const [previewCV,setPreviewCV] = useState<boolean>(false);
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

  console.log("cvData",cvData);


  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1">
          <div className="col-span-7 p-2 sm:p-6 bg-slate-50 space-y-3">
            <button className="bg-[#008888] text-white px-3 py-1 rounded border shadow-lg" onClick={()=>setPreviewCV(true)}>Preview CV</button>
            {previewCV&&<Resume cvData={cvData} setPreviewCV={setPreviewCV}/>}
            <p className="text-xs text-[#f14419]"><strong>Note: </strong>You can edit your educational (if not verified through DigiLocker), experience, course certificates details only up to three times in case they are rejected by the issuer. Please enter your information carefully. For any queries or issues, reach out to us at <a href="mailto:support@edubuk.com" className="text-[#006666] underline">support@edubuk.com</a> or <a href="mailto:support@edubukeseal.org" className="text-[#006666] underline">support@edubukeseal.org</a></p>
            {/* Step 1 */}
            
            <PersonalDetails step={step} setStep={setStep} uid={uid} docId={docId} setCvData = {setCvData} cvData={cvData}/>
            {/* Step 2 */}
            <EducationDetails step={step} setStep={setStep} uid={uid} docId={docId} setCvData = {setCvData} cvData={cvData}/>
            
            <ExperienceDetails step={step} setStep={setStep} uid={uid} docId = {docId} setCvData = {setCvData} cvData={cvData}/>
            
            <SkillDetails step={step} setStep={setStep} uid={uid} docId = {docId} setCvData = {setCvData} cvData={cvData}/>
            
            <ProjectDetails step={step} setStep={setStep} uid={uid} docId = {docId} setCvData = {setCvData} cvData={cvData}/>
            
            <AwardDetails step={step} setStep={setStep} uid={uid} docId = {docId} setCvData = {setCvData} cvData={cvData}/>
           
            {/* <ProfileSummary step={step} setStep={setStep} uid={uid} docId = {docId}/> */}
           
            <div className="pt-4 border-t mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-500">{step ? `Open: Step ${step} of 7` : "No step open"}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep((s) => Math.max(1, (s || 1) - 1))}
                  className="px-3 py-1 rounded border"
                >
                  Prev
                </button>
                <button
                  onClick={() => setStep((s) => Math.min(7, (s || 1) + 1))}
                  className="px-3 py-1 rounded bg-[#03257e] text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
