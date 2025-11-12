import { CheckCircle, Trash2 } from "lucide-react"
import { StepCard } from "./StepCard"
import { useState } from "react";
import { IStepCard } from "./PersonalDetails";
import { Button } from "@/components/ui/button";
export const SkillDetails = ({ step, setStep }: IStepCard) => {
    const [skills, setSkills] = useState<{ name: string; selfAttested?: boolean; proof?: File | null }[]>([]);
    const [skillInput, setSkillInput] = useState("");
    function addSkill(name?: string) {
        if (!name) name = skillInput.trim();
        if (!name) return;
        setSkills((s) => [...s, { name, selfAttested: false, proof: null }]);
        setSkillInput("");
    }

    function removeSkill(index: number) {
        setSkills((s) => s.filter((_, i) => i !== index));
    }
    return (
        <StepCard index={4} title="Skills" icon={CheckCircle} open={step === 4} onToggle={() => setStep(step === 4 ? 0 : 4)}>
            <p className="text-sm text-slate-500">Add skills manually or choose from suggested list. Each skill supports self-attestation and proof upload.</p>

            <div className="mt-4">
                <div className="flex gap-2">
                    <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" className="p-2 border rounded flex-1" />
                    <button onClick={() => addSkill()} className="px-3 py-1 rounded bg-[#006666] text-white">Add</button>
                </div>

                <div className="mt-3 space-y-3">
                    {skills.map((s, i) => (
                        <>
                            <div className="flex justify-start items-center gap-2"><input type="checkbox" className="border-[#008888]"/><p className="text-[#008888]">Select to include this data in your resume</p></div>
                            <div key={i} className="flex items-center gap-3 border p-3 rounded bg-white">
                                <div className="flex-1">{s.name}</div>
                                <div className="flex items-center gap-2">
                                    {/* <input type="file" onChange={(e) => setSkills((prev) => prev.map((it, idx) => (idx === i ? { ...it, proof: e.target.files ? e.target.files[0] : null } : it)))} /> */}
                                    <button onClick={() => setSkills((prev) => prev.map((it, idx) => (idx === i ? { ...it, selfAttested: !it.selfAttested } : it)))} className="px-2 py-1 rounded border shadow-lg border-[#FB980E] text-[#FB980E] flex items-center gap-2"><CheckCircle size={14} />{s.selfAttested ? "Attested" : "Self attest"}</button>
                                    <button onClick={() => removeSkill(i)} className="px-2 py-1 rounded border shadow-lg border-red-600 text-red-600 flex items-center gap-2 hover:bg-red-50 active:scale-[0.99] transition"><Trash2 size={14} />Remove</button>
                                </div>
                            </div>
                        </>
                    ))}
                </div>

                <div className="mt-3">
                    <div className="text-xs text-slate-500">Suggested: JavaScript, TypeScript, React, Node.js, Python</div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {["JavaScript", "TypeScript", "React", "Node.js", "Python"].map((s) => (
                            <button key={s} onClick={() => addSkill(s)} className="px-2 py-1 border border-[#03257e] shadow-lg rounded text-[#03257e] flex items-center gap-2 p-2">{s}</button>
                        ))}
                    </div>
                </div>
                {skills.length>0&&<Button type="submit" className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition">Save</Button>}

            </div>
        </StepCard>
    )
}