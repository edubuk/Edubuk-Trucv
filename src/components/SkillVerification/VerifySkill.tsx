import { API_BASE_URL } from "@/main";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams} from "react-router-dom";

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
type Skill ={
    userId:string,
    skills:SkillItem[]
}
type SkillItem = {
  skillName: string;
  level: string;
};

const SkillVerification = () => {
  const [skill,setSkill]= useState<Skill>({
    userId:"",
    skills:[],
  });
  const {token} = useParams();
  console.log("token",token)
  const getRequestedSkills = async()=>{
    try {
      const data = await fetch(`${API_BASE_URL}/issuer/requested-skills/${token}`)
      const res = await data.json()
      if(res.success)
      {
        console.log("fetched data",res.data);
        setSkill(res.data)
        return;
      }
      toast.error(res.message);
    } catch (error:any) {
      toast.error(error.message||error||"something went wrong")
    }
  }
  const handleApprove = async()=>{
    try {
      const data = await fetch(`${API_BASE_URL}/issuer/approve-skills/${token}?userId=${skill.userId}`,{
        method:"PUT",
        body:JSON.stringify({data:skill}),
        headers:{
          "Content-Type":"application/json"
        },
      })
      const res = await data.json()
      if(res.success)
      {
        toast.success(`${res.message} Thank You !`);
        window.location.href="/";
      }
      toast.error(res.message);
    } catch (error:any) {
      toast.error(error.message||error||"something went wrong")
    }
  }

  useEffect(()=>{
    getRequestedSkills()
  },[]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#03257e]/10 text-[#03257e] text-lg">
                  ✓
                </span>
                Skill Verification
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Review and verify candidate skills below.
              </p>
            </div>
          </header>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 font-semibold text-slate-600 text-xs border-b border-slate-200 pb-2 mb-3">
            <div className="col-span-1"></div>
            <div className="col-span-6">Skill Name</div>
            <div className="col-span-5">Verified Level</div>
          </div>

          {/* Skill Rows */}
          <div className="space-y-2">
            {skill.skills.map((skill:SkillItem,i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 bg-slate-50/40 border border-slate-100 rounded-xl px-4 py-3"
              >
                {/* Checkbox */}
                <div className="col-span-1 flex justify-center items-center">
                  <input
                  disabled
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-[#006666] focus:ring-[#006666]"
                    // TODO: onChange={(e) => ... }
                  />
                </div>

                {/* Skill Name */}
                <div className="col-span-6 flex items-center text-sm font-medium text-slate-800">
                  {skill.skillName}
                </div>

                {/* Level Dropdown */}
                <div className="col-span-5">
                  {skill.level}
                  {/* <select
                  disabled
                    defaultValue={skill.level}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-[6px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006666] focus:border-[#006666] transition"
                    // TODO: onChange={(e) => ... }
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select> */}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="mt-7 border-t border-slate-100 pt-4 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              // onClick={handleReject}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition"
            >
              Decline All
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="rounded-lg bg-[#006666] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#005050] active:scale-[0.99] transition"
            >
              Confirm Verification
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400">
          <span>Secure skill verification link</span>
          <span>© {new Date().getFullYear()} Edubuk</span>
        </div>
      </div>
    </div>
  );
};

export default SkillVerification;
