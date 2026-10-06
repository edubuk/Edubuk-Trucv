import { X } from "lucide-react";
import React, { useState } from "react";
import { TypeSkill } from "./cvSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { emailValidator } from "@/lib/emailValidator";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/main";
import LoadingButton from "@/components/LoadingButton";

//const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];

type SkillVerificationProps = {
  selectedSkill: any;
  isOpenModel: boolean;
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>;
};

const SkillVerificationModel: React.FC<SkillVerificationProps> = ({
  selectedSkill,
  isOpenModel,
  setOpenModel,
}) => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  console.log("selected skills are",selectedSkill)
  const emailHandler = async () => {
    try {
      setLoading(true);
      const isOrgEmailId = emailValidator(emailId);
      if (!isOrgEmailId) {
        return setErrorMsg("Institutional/oraganizational email id is required");
      }
      const response = await fetch(
        `${API_BASE_URL}/api/v1/issuer/send-email-forSkills/${emailId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: selectedSkill }),
        }
      );
      const res = await response.json();
      if (res.success) {
        toast.success(res.message);
        setOpenModel(false);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || error || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpenModel && (
        <div className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm">
          <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]" />

              <div className="p-6 sm:p-8">
                {/* Header */}
                <header className="flex flex-col ">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#03257e]/10 text-[#03257e] text-lg">
                        ✓
                      </span>
                      Skill Verification
                    </h1>
                    <X
                      size={20}
                      onClick={() => setOpenModel(false)}
                      className="text-[#f14419] cursor-pointer rounded-full"
                    />
                  </div>
                  <p className="text-sm text-slate-500 mt-1 mb-2">
                    Review your listed skills below and get them endorsed to
                    enhance your professional credibility.
                    <br />
                    <span className="text-[#006666] font-semibold">
                      Note:
                    </span>{" "}
                    Only list skills that can be verified by an authorized
                    endorser.
                    <br />
                    <span className="text-[#006666] font-semibold">
                      Who can endorse:
                    </span>{" "}
                    e.g., a manager, team lead, or any authorized representative
                    from your organization.
                  </p>
                </header>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 font-semibold text-slate-600 text-xs border-b border-slate-200 pb-2 mb-3">
                  <div className="col-span-1"></div>
                  <div className="col-span-6">Skill Name</div>
                  <div className="col-span-5">Verified Level</div>
                </div>

                {/* Skill Rows */}
                <div className="space-y-2">
                  {selectedSkill?.skills.map((skill: TypeSkill) => (
                    <div
                      key={skill.id}
                      className="grid grid-cols-12 gap-2 bg-slate-50/40 border border-slate-100 rounded-xl px-4 py-3"
                    >
                      {/* Checkbox */}
                      <div className="col-span-1 flex justify-center items-center">
                        <input
                          checked={true}
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
                <div className="mt-7 border-t border-slate-100 pt-4 flex justify-end gap-3">
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-600"
                    >
                      Enter only organisation related email id. Don't use
                      personal email id here
                    </label>
                    <Input
                      placeholder="Enter verifier email id"
                      id="email"
                      onChange={(e) => {
                        setEmailId(e.target.value);
                        setErrorMsg("");
                      }}
                    />
                    {errorMsg && (
                      <p className="text-xs text-red-500">{errorMsg}</p>
                    )}
                  </div>
                  {loading ? (
                    <LoadingButton className="rounded-lg mt-5 bg-[#006666] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#005050] active:scale-[0.99] transition" />
                  ) : (
                    <Button
                      type="button"
                      onClick={emailHandler}
                      className="rounded-lg mt-5 bg-[#006666] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#005050] active:scale-[0.99] transition"
                    >
                      Send Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkillVerificationModel;
