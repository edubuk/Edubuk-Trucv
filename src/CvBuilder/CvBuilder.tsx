import { useState } from "react";
import { PersonalDetails } from "./PersonalDetails";
import { EducationDetails } from "./EducationDetails";
import { ExperienceDetails } from "./ExperienceDetails";
import { SkillDetails } from "./SkillsDetails";
import { ProjectDetails } from "./ProjectsDetails";
import { AwardDetails } from "./AwardDetails";
import { ProfileSummary } from "./ProfileSummary";
import { v4 as uuidv4 } from "uuid";


// --- Helpers ---
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const docId = ()=>uuidv4();

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


  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1">
          {/* Left: CV Preview */}
          {/* <div className="col-span-5 p-6 border-r border-gray-200 bg-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#03257e] text-white">
                <User size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#03257e]">{personal.fullName || "Your Name"}</h2>
                <div className="text-sm text-slate-600">{personal.email} {personal.phone ? ` • ${personal.phone}` : ""}</div>
                <div className="text-xs text-slate-500">{personal.city}</div>
                <div className="mt-2 flex gap-2 text-xs text-slate-600">
                  {personal.linkedin && <span>LinkedIn: {personal.linkedin}</span>}
                  {personal.github && <span>Github: {personal.github}</span>}
                </div>
              </div>
            </div>

            <section className="mb-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#006666]"><Briefcase size={16} />Profile</h3>
              <p className="text-sm text-slate-600 mt-2">{summary || "Your professional summary will appear here..."}</p>
            </section>

            <section className="mb-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#006666]"><BookOpen size={16} />Education</h3>
              <div className="mt-2">
                {educations.map((e) => (
                  <div key={e.id} className="mb-2">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-slate-700">{e.level === "school" ? e.schoolName || "School name" : e.collegeName || "College name"}</div>
                      <div className="text-xs text-slate-500">{e.duration}</div>
                    </div>
                    <div className="text-xs text-slate-500">{e.level === "school" ? `${e.board || "Board"} • ${e.percentage || "%"}` : `${e.degree || "Degree"} • ${e.gpa || "GPA"}`}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#006666]"><Briefcase size={16} />Experience</h3>
              <div className="mt-2 space-y-2 text-sm text-slate-600">
                {experiences.length === 0 && <div className="text-xs text-slate-500">No experience added yet</div>}
                {experiences.map((ex) => (
                  <div key={ex.id}>
                    <div className="font-medium text-slate-700">{ex.position || "Position"} — {ex.company || "Company"}</div>
                    <div className="text-xs text-slate-500">{ex.duration}</div>
                    <div className="text-xs mt-1">{ex.description}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#006666]"><FileText size={16} />Projects</h3>
              <div className="mt-2 text-sm text-slate-600 space-y-2">
                {projects.length === 0 && <div className="text-xs text-slate-500">No projects added</div>}
                {projects.map((p) => (
                  <div key={p.id}>
                    <div className="font-medium text-slate-700">{p.name || "Project name"}</div>
                    {p.url && <div className="text-xs text-slate-500">{p.url}</div>}
                    <div className="text-xs">{p.description}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#006666]"><Award size={16} />Awards</h3>
              <div className="mt-2 text-sm text-slate-600 space-y-2">
                {awards.length === 0 && <div className="text-xs text-slate-500">No awards added</div>}
                {awards.map((a) => (
                  <div key={a.id}>
                    <div className="font-medium text-slate-700">{a.name || "Award"}</div>
                    <div className="text-xs text-slate-500">{a.organisation} • {a.date}</div>
                  </div>
                ))}
              </div>
            </section>
          </div> */}

          {/* Right: Vertical Step Cards */}
          <div className="col-span-7 p-2 sm:p-6 bg-slate-50 space-y-3">
            <button className="bg-[#008888] text-white px-3 py-1 rounded border shadow-lg">Preview CV</button>
            <p className="text-xs text-[#f14419]"><strong>Note: </strong>You can edit your educational (if not verified through DigiLocker), experience, course certificates details only up to three times in case they are rejected by the issuer. Please enter your information carefully. For any queries or issues, reach out to us at <a href="mailto:support@edubukeseal.org" className="text-[#006666] underline">support@edubukeseal.org</a>.</p>
            {/* Step 1 */}
            
            <PersonalDetails step={step} setStep={setStep} uid={uid} docId={docId}/>
            {/* Step 2 */}
            <EducationDetails step={step} setStep={setStep} uid={uid} docId={docId}/>
            
            <ExperienceDetails step={step} setStep={setStep} uid={uid} docId = {docId}/>
            
            <SkillDetails step={step} setStep={setStep} uid={uid} docId = {docId}/>
            
            <ProjectDetails step={step} setStep={setStep} uid={uid} docId = {docId}/>
            
            <AwardDetails step={step} setStep={setStep} uid={uid} docId = {docId}/>
           
            <ProfileSummary step={step} setStep={setStep} uid={uid} docId = {docId}/>
           
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
                <button onClick={() => { /* plug in draft save */ }} className="px-3 py-1 rounded border">Save Draft</button>
                <button onClick={() => alert("Export or Save - wire this up to create PDF or backend API") } className="px-4 py-1 rounded bg-[#f14419] text-white">Export CV</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
