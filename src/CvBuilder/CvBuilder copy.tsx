import { useState } from "react";

// Tailwind + TypeScript + Vite component
// Uses lucid icons (lucide-react) for small UI flourishes

// To use: place this file under src/components/CVBuilder.tsx and import into your app.

import { PlusCircle, Trash2, FileText, CheckCircle, User, Briefcase, BookOpen, Award} from "lucide-react";

// --- Types ---
type EducationItem = {
  id: string;
  level: "school" | "college";
  board?: string; // for school
  schoolName?: string;
  collegeName?: string;
  degree?: string;
  percentage?: string;
  gpa?: string;
  duration?: string;
  proof?: File | null;
  selfAttested?: boolean;
};

type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  proof?: File | null;
  selfAttested?: boolean;
};

type ProjectItem = {
  id: string;
  name: string;
  url?: string;
  duration?: string;
  description?: string;
  selfAttested?: boolean;
};

type AwardItem = {
  id: string;
  name: string;
  organisation?: string;
  date?: string;
  description?: string;
  selfAttested?: boolean;
};

// --- Helpers ---
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

// --- Main Component ---
export default function CVBuilder() {
  const [step, setStep] = useState<number>(1);

  // Step 1: Personal
  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    linkedin: "",
    github: "",
  });

  // Step 2: Education
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: uid("edu"),
      level: "school",
      board: "",
      schoolName: "",
      percentage: "",
      duration: "",
      proof: null,
      selfAttested: false,
    },
  ]);

  // Step 3: Experience
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  // Step 4: Skills
  const [skills, setSkills] = useState<{ name: string; selfAttested?: boolean; proof?: File | null }[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Step 5: Projects
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // Step 6: Awards
  const [awards, setAwards] = useState<AwardItem[]>([]);

  // Step 7: Summary
  const [summary, setSummary] = useState<string>("");
  const [summaryAttested, setSummaryAttested] = useState(false);

  // --- Mutators ---
  function updatePersonal(field: string, value: string) {
    setPersonal((p) => ({ ...p, [field]: value }));
  }

  function addEducation(level: "school" | "college") {
    const e: EducationItem = {
      id: uid("edu"),
      level,
      board: "",
      schoolName: "",
      collegeName: "",
      degree: "",
      percentage: "",
      gpa: "",
      duration: "",
      proof: null,
      selfAttested: false,
    };
    setEducations((s) => [...s, e]);
  }

  function removeEducation(id: string) {
    setEducations((s) => s.filter((x) => x.id !== id));
  }

  function updateEducation(id: string, patch: Partial<EducationItem>) {
    setEducations((s) => s.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addExperience() {
    setExperiences((s) => [
      ...s,
      { id: uid("exp"), company: "", position: "", duration: "", description: "", proof: null, selfAttested: false },
    ]);
  }

  function removeExperience(id: string) {
    setExperiences((s) => s.filter((x) => x.id !== id));
  }

  function updateExperience(id: string, patch: Partial<ExperienceItem>) {
    setExperiences((s) => s.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addSkill(name?: string) {
    if (!name) name = skillInput.trim();
    if (!name) return;
    setSkills((s) => [...s, { name, selfAttested: false, proof: null }]);
    setSkillInput("");
  }

  function removeSkill(index: number) {
    setSkills((s) => s.filter((_, i) => i !== index));
  }

  function addProject() {
    setProjects((s) => [...s, { id: uid("prj"), name: "", url: "", duration: "", description: "", selfAttested: false }]);
  }

  function updateProject(id: string, patch: Partial<ProjectItem>) {
    setProjects((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removeProject(id: string) {
    setProjects((s) => s.filter((p) => p.id !== id));
  }

  function addAward() {
    setAwards((s) => [...s, { id: uid("awd"), name: "", organisation: "", date: "", description: "", selfAttested: false }]);
  }

  function updateAward(id: string, patch: Partial<AwardItem>) {
    setAwards((s) => s.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function removeAward(id: string) {
    setAwards((s) => s.filter((a) => a.id !== id));
  }

  // --- Render helpers ---
  const stepTitles = [
    "Personal Details",
    "Educational Details",
    "Experience Details",
    "Skills",
    "Personal Projects",
    "Awards & Certificates",
    "Profile Summary",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-12">
          {/* Left: CV Preview */}
          <div className="col-span-5 p-6 border-r border-gray-200 bg-white">
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
          </div>

          {/* Right: Form Steps */}
          <div className="col-span-7 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {stepTitles.map((t, i) => (
                  <div key={i} onClick={() => setStep(i + 1)} className={`cursor-pointer p-2 rounded-md ${step === i + 1 ? "bg-[#03257e] text-white" : "text-slate-600"}`}>
                    <div className="text-xs font-semibold">{`Step ${i + 1}`}</div>
                    <div className="text-[11px]">{t}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="px-3 py-1 rounded-md border">Prev</button>
                <button onClick={() => setStep((s) => Math.min(7, s + 1))} className="px-3 py-1 rounded-md bg-[#03257e] text-white">Next</button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#03257e]">Personal Details</h3>
                  <p className="text-sm text-slate-500 mt-1">Fill the information that will appear in your CV header.</p>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input value={personal.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} placeholder="Full name" className="p-3 border rounded" />
                    <input value={personal.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="Email" className="p-3 border rounded" />
                    <input value={personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="Phone" className="p-3 border rounded" />
                    <input value={personal.city} onChange={(e) => updatePersonal("city", e.target.value)} placeholder="City" className="p-3 border rounded" />
                    <input value={personal.linkedin} onChange={(e) => updatePersonal("linkedin", e.target.value)} placeholder="LinkedIn URL" className="col-span-1 p-3 border rounded" />
                    <input value={personal.github} onChange={(e) => updatePersonal("github", e.target.value)} placeholder="Github URL" className="col-span-1 p-3 border rounded" />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#03257e]">Educational Details</h3>
                  <p className="text-sm text-slate-500 mt-1">Add education entries. Choose school or college. Each entry can be self-attested and have proof uploaded.</p>

                  <div className="mt-4 space-y-4">
                    {educations.map((ed) => (
                      <div key={ed.id} className="border p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2 items-center">
                            <div className="text-sm font-medium">{ed.level === "school" ? "School" : "College"} entry</div>
                            <div className="text-xs text-slate-500">{ed.id}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => updateEducation(ed.id, { selfAttested: !ed.selfAttested })} className="px-2 py-1 rounded border flex items-center gap-2">
                              <CheckCircle size={14} /> {ed.selfAttested ? "Attested" : "Self attest"}
                            </button>
                            <button onClick={() => removeEducation(ed.id)} className="px-2 py-1 rounded border text-red-600 flex items-center gap-2"><Trash2 size={14} /> Remove</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <select value={ed.level} onChange={(e) => updateEducation(ed.id, { level: e.target.value as any })} className="p-2 border rounded">
                            <option value="school">School</option>
                            <option value="college">College</option>
                          </select>

                          <input value={ed.duration} onChange={(e) => updateEducation(ed.id, { duration: e.target.value })} placeholder="Duration (eg. 2015 - 2018)" className="p-2 border rounded" />

                          {ed.level === "school" ? (
                            <>
                              <input value={ed.board} onChange={(e) => updateEducation(ed.id, { board: e.target.value })} placeholder="Board name" className="p-2 border rounded" />
                              <input value={ed.schoolName} onChange={(e) => updateEducation(ed.id, { schoolName: e.target.value })} placeholder="School name" className="p-2 border rounded" />
                              <input value={ed.percentage} onChange={(e) => updateEducation(ed.id, { percentage: e.target.value })} placeholder="Percentage" className="p-2 border rounded col-span-2" />
                            </>
                          ) : (
                            <>
                              <input value={ed.collegeName} onChange={(e) => updateEducation(ed.id, { collegeName: e.target.value })} placeholder="College name" className="p-2 border rounded" />
                              <input value={ed.degree} onChange={(e) => updateEducation(ed.id, { degree: e.target.value })} placeholder="Degree" className="p-2 border rounded" />
                              <input value={ed.gpa} onChange={(e) => updateEducation(ed.id, { gpa: e.target.value })} placeholder="GPA" className="p-2 border rounded col-span-2" />
                            </>
                          )}

                          <div className="col-span-2 flex items-center gap-3">
                            <input type="file" onChange={(e) => updateEducation(ed.id, { proof: e.target.files ? e.target.files[0] : null })} />
                            <div className="text-xs text-slate-500">Upload proof</div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <button onClick={() => addEducation("school")} className="flex items-center gap-2 px-3 py-1 rounded border">
                        <PlusCircle size={16} /> Add School
                      </button>
                      <button onClick={() => addEducation("college")} className="flex items-center gap-2 px-3 py-1 rounded border">
                        <PlusCircle size={16} /> Add College
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#03257e]">Experience Details</h3>
                  <p className="text-sm text-slate-500 mt-1">Add professional experiences. Each entry supports proof upload and self-attestation.</p>

                  <div className="mt-4 space-y-4">
                    {experiences.map((ex) => (
                      <div key={ex.id} className="border p-4 rounded">
                        <div className="flex justify-between">
                          <div className="font-medium">{ex.company || "Company"}</div>
                          <div className="flex gap-2">
                            <button onClick={() => updateExperience(ex.id, { selfAttested: !ex.selfAttested })} className="px-2 py-1 rounded border flex items-center gap-2"><CheckCircle size={14} />{ex.selfAttested ? "Attested" : "Self attest"}</button>
                            <button onClick={() => removeExperience(ex.id)} className="px-2 py-1 rounded border text-red-600 flex items-center gap-2"><Trash2 size={14} /> Remove</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <input value={ex.company} onChange={(e) => updateExperience(ex.id, { company: e.target.value })} placeholder="Company name" className="p-2 border rounded" />
                          <input value={ex.position} onChange={(e) => updateExperience(ex.id, { position: e.target.value })} placeholder="Position" className="p-2 border rounded" />
                          <input value={ex.duration} onChange={(e) => updateExperience(ex.id, { duration: e.target.value })} placeholder="Duration" className="p-2 border rounded" />
                          <textarea value={ex.description} onChange={(e) => updateExperience(ex.id, { description: e.target.value })} placeholder="Description" className="p-2 border rounded col-span-2" />
                          <div className="col-span-2 flex items-center gap-3">
                            <input type="file" onChange={(e) => updateExperience(ex.id, { proof: e.target.files ? e.target.files[0] : null })} />
                            <div className="text-xs text-slate-500">Upload proof</div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div>
                      <button onClick={addExperience} className="flex items-center gap-2 px-3 py-1 rounded border"><PlusCircle size={16} /> Add Experience</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#03257e]">Skills</h3>
                  <p className="text-sm text-slate-500 mt-1">Add skills manually or choose from suggested list. Each skill supports self-attestation and proof upload.</p>

                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" className="p-2 border rounded flex-1" />
                      <button onClick={() => addSkill()} className="px-3 py-1 rounded bg-[#006666] text-white">Add</button>
                    </div>

                    <div className="mt-3 space-y-3">
                      {skills.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 border p-3 rounded">
                          <div className="flex-1">{s.name}</div>
                          <div className="flex items-center gap-2">
                            <input type="file" onChange={(e) => setSkills((prev) => prev.map((it, idx) => (idx === i ? { ...it, proof: e.target.files ? e.target.files[0] : null } : it)))} />
                            <button onClick={() => setSkills((prev) => prev.map((it, idx) => (idx === i ? { ...it, selfAttested: !it.selfAttested } : it)))} className="px-2 py-1 rounded border flex items-center gap-2"><CheckCircle size={14} />{s.selfAttested ? "Attested" : "Self attest"}</button>
                            <button onClick={() => removeSkill(i)} className="px-2 py-1 rounded border text-red-600"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <div className="text-xs text-slate-500">Suggested: JavaScript, TypeScript, React, Node.js, Python</div>
                      <div className="flex gap-2 mt-2">
                        {["JavaScript", "TypeScript", "React", "Node.js", "Python"].map((s) => (
                          <button key={s} onClick={() => addSkill(s)} className="px-2 py-1 border rounded text-sm">{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {step === 5 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#03257e]">Personal Projects</h3>
                  <p className="text-sm text-slate-500 mt-1">Add projects. Make them stand out with URL and short description. Each item can be removed.</p>

                  <div className="mt-4 space-y-4">
                    {projects.map((p) => (
                      <div key={p.id} className="border p-4 rounded">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{p.name || "Project"}</div>
                          <div className="flex gap-2">
                            <button onClick={() => updateProject(p.id, { selfAttested: !p.selfAttested })} className="px-2 py-1 rounded border flex items-center gap-2"><CheckCircle size={14} />{p.selfAttested ? "Attested" : "Self attest"}</button>
                            <button onClick={() => removeProject(p.id)} className="px-2 py-1 rounded border text-red-600 flex items-center gap-2"><Trash2 size={14} /> Remove</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <input value={p.name} onChange={(e) => updateProject(p.id, { name: e.target.value })} placeholder="Project name" className="p-2 border rounded" />
                          <input value={p.url} onChange={(e) => updateProject(p.id, { url: e.target.value })} placeholder="Project URL" className="p-2 border rounded" />
                          <input value={p.duration} onChange={(e) => updateProject(p.id, { duration: e.target.value })} placeholder="Duration" className="p-2 border rounded" />
                          <textarea value={p.description} onChange={(e) => updateProject(p.id, { description: e.target.value })} placeholder="Short description" className="p-2 border rounded col-span-2" />
                        </div>
                      </div>
                    ))}

                    <div>
                      <button onClick={addProject} className="flex items-center gap-2 px-3 py-1 rounded border"><PlusCircle size={16} /> Add Project</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6 */}
              {step === 6 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#03257e]">Awards & Certificates</h3>
                  <p className="text-sm text-slate-500 mt-1">Add awards and certificates. Each can be self-attested and removed.</p>

                  <div className="mt-4 space-y-4">
                    {awards.map((a) => (
                      <div key={a.id} className="border p-4 rounded">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{a.name || "Award name"}</div>
                          <div className="flex gap-2">
                            <button onClick={() => updateAward(a.id, { selfAttested: !a.selfAttested })} className="px-2 py-1 rounded border flex items-center gap-2"><CheckCircle size={14} />{a.selfAttested ? "Attested" : "Self attest"}</button>
                            <button onClick={() => removeAward(a.id)} className="px-2 py-1 rounded border text-red-600 flex items-center gap-2"><Trash2 size={14} /> Remove</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <input value={a.name} onChange={(e) => updateAward(a.id, { name: e.target.value })} placeholder="Award / Certificate name" className="p-2 border rounded" />
                          <input value={a.organisation} onChange={(e) => updateAward(a.id, { organisation: e.target.value })} placeholder="Organisation" className="p-2 border rounded" />
                          <input type="date" value={a.date} onChange={(e) => updateAward(a.id, { date: e.target.value })} className="p-2 border rounded" />
                          <textarea value={a.description} onChange={(e) => updateAward(a.id, { description: e.target.value })} placeholder="Short description" className="p-2 border rounded col-span-2" />
                        </div>
                      </div>
                    ))}

                    <div>
                      <button onClick={addAward} className="flex items-center gap-2 px-3 py-1 rounded border"><PlusCircle size={16} /> Add Award/Certificate</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7 */}
              {step === 7 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#03257e]">Profile Summary</h3>
                  <p className="text-sm text-slate-500 mt-1">Write a short profile summary that will appear at the top of your CV.</p>

                  <div className="mt-4">
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Write your profile summary..." className="w-full p-3 border rounded h-40" />
                    <div className="mt-3 flex gap-3 items-center">
                      <button onClick={() => setSummaryAttested((s) => !s)} className="px-3 py-1 rounded border flex items-center gap-2"><CheckCircle size={16} /> {summaryAttested ? "Attested" : "Self attest"}</button>
                      <div className="text-sm text-slate-500">You can use this to indicate that your summary is self-attested.</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-500">Step {step} of 7</div>
                <div className="flex gap-3">
                  <button onClick={() => { /* clear form example */ }} className="px-3 py-1 rounded border">Save Draft</button>
                  <button onClick={() => alert("Export or Save - you can wire this up to create PDF or backend API") } className="px-4 py-1 rounded bg-[#f14419] text-white">Export CV</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
