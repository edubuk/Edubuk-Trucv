import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Delete, Trash2 } from "lucide-react";
import { StepCard } from "./StepCard";
import { IStepCard } from "./PersonalDetails";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SkillFormValues, SkillSchema} from "./cvSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SelfAttestButton from "@/components/Buttons/SelfAttest";
import toast from "react-hot-toast";
import { isMongoId } from "@/lib/utils";
import LoadingButton from "@/components/LoadingButton";
import SkillVerificationModel from "./SkillVerificationModel";
import api from "@/lib/api";

export const SkillDetails = ({
  step,
  setStep,
  uid,
  setCvData,
  cvData,
}: IStepCard) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenModel,setOpenModel] = useState<boolean>(false);
  const [refresh,setRefresh] = useState<boolean>(false);
  const [idx,setIdx]= useState<number>();
  const [selectedSkill,setSelectedSkill] = useState<any>({
    skills:[]
  });
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      skills: [], // start empty; user adds via common input
    },
  });

  const { control, setValue, handleSubmit, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
    keyName: "rhfKey",
  });

  // Common input state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<
    "beginner" | "intermediate" | "advanced" | "expert"
  >("beginner");

  const levelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  const handleAddSkill = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) return;

    append({
      id: uid("skill"),
      skillName: trimmed,
      level: newSkillLevel,
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    });

    setNewSkillName("");
    setNewSkillLevel("beginner");
  };

  const removeSkill = (index: number) => {
    remove(index);
  };

  const handleSelfAttest = (index: number) => {
    setValue(`skills.${index}.selfAttested`, true, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const formSubmitHandler = async (data: SkillFormValues) => {
    console.log("form values", data);
    try {
      setLoading(true);
      const doc = await api.post(`/doc/save-skills`, {
        data: data
      });
      const response = await doc.data;
      console.log("data", response);
      if (!response.success) {
        return toast.error(response.message || "Something went wrong");
      }
      toast.success(response.message);
      setRefresh((prev) => !prev);
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.response.data.message || error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const docs = await api.get(`/doc/skill-docs`);
      const response = await docs.data;
      console.log("data", response.skills);
      if (response.success) {
        const skills = response?.skills.map((doc: any) => ({
          id: doc._id ?? uid("skill"),
          skillName: doc?.skillName ?? "",
          level: doc?.level ?? "beginner",
          selfAttested: doc?.selfAttested ?? false,
          endoresBy: doc?.endoresBy ?? "",
          endoresThrough: doc?.endoresThrough ?? "",
        }));
        form.reset({ skills });
      }
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.message || error || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [step === 4,refresh]);

  const includedIds = useMemo(
    () => new Set(cvData.skills.map((e: any) => e.id)),
    [cvData]
  );
  const includedSkillIds = useMemo(
    () => new Set(selectedSkill?.skills?.map((e: any) => e.id)),
    [selectedSkill]
  );

  function buildEducationPayload(index: number) {
    // grab the whole education row from RHF form values
    const row = getValues(`skills.${index}`) || {};
    // ensure a stable id — prefer existing ID from the form if present
    const id = row.id || uid("edu");
    return { ...row, id };
  }

  function handleToggleInclude(index: number) {
    const payload = buildEducationPayload(index);

    setCvData((prev: any) => {
      const exists = prev.skills.some((e: any) => e.id === payload.id);
      if (exists) {
        // remove
        return {
          ...prev,
          skills: prev.skills.filter((e: any) => e.id !== payload.id),
        };
      } else {
        // add (append)
        return { ...prev, skills: [...prev.skills, payload] };
      }
    });
  }

  const deleteHandler = async (index: number) => {
        try {
          const confirm = window.confirm("Are you sure you want to delete this document?");
          if (!confirm) return;
          setLoading(true);
          setIdx(index);
          const payload = getValues(`skills.${index}`);
          const res = await api.delete(`/doc/delete-skillDoc/${payload.id}`);
          console.log("res",res)
          if (!res.data.success) {
            toast.error(res.data.message);
            return;
          }
          toast.success(res.data.message);
          setRefresh((prev) => !prev);
        } catch (error: any) {
          toast.error(error.data.message || error.message || error || "something went wrong");
        }finally{setLoading(false)}
      };

  function handleSkillInclude(index: number) {
    const payload = buildEducationPayload(index);

    setSelectedSkill((prev: any) => {
      const exists = prev.skills.some((e: any) => e.id === payload.id);
      if (exists) {
        // remove
        return {
          ...prev,
          skills: prev.skills.filter((e: any) => e.id !== payload.id),
        };
      } else {
        // add (append)
        return { ...prev, skills: [...prev.skills, payload] };
      }
        });
              console.log("skills",selectedSkill);

  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <StepCard
          index={4}
          title="Skills"
          icon={CheckCircle}
          open={step === 4}
          onToggle={() => setStep(step === 4 ? 0 : 4)}
        >
          <p className="text-sm text-slate-500">
            Add skills manually. Each skill supports self-attestation and can be
            included in your resume.
          </p>

          <div className="mt-4 space-y-4">
            {/* Common input row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="flex-1">
                <Input
                  placeholder="Enter a skill (e.g. React, Node.js)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="w-full sm:w-48">
                <select
                  value={newSkillLevel}
                  onChange={(e) =>
                    setNewSkillLevel(e.target.value as typeof newSkillLevel)
                  }
                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006666] focus:border-[#006666]"
                >
                  {levelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
        
              <Button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-[#006666] text-white hover:bg-[#008888] transition"
              >
                Add Skill
              </Button> 
            </div>
            <div className="flex justify-end items-center w-full">
            <Button 
            title="Select internal checkbox to include the skill in verification list"
            type="button" 
            className="px-4 py-2 bg-[#03257e] text-white active:scale-[0.99] transition items-align-right" 
            disabled={selectedSkill?.skills?.length===0}
            onClick={() => setOpenModel(true)}>Verify Below Listed Skills</Button>
            </div>
            {/* Skills list */}
            <div className="mt-3 space-y-3">
              {fields.map((s, index) => {
                return (
                  <React.Fragment key={s.rhfKey}>
                    {/* Include checkbox */}
                    <div className="flex justify-start items-center gap-2">
                      {isMongoId(s.id) && (
                        <div className="flex justify-start items-center gap-2">
                          <input
                            type="checkbox"
                            className="border-[#008888] h-4 w-4"
                            // checked if this row's id exists in cvData.educations
                            checked={
                              includedIds.has(s.id) ||
                              cvData.skills.some(
                                (e: any) =>
                                  e.id ===
                                  (form.getValues(`skills.${index}.id`) || s.id)
                              )
                            }
                            onChange={() => handleToggleInclude(index)}
                            aria-label={`Include skills ${index + 1} in CV`}
                          />
                          <p className="text-[#008888]">
                            Select to include this data in your resume
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bar row: name + level dropdown + self-attest + remove */}
                    <div className="flex flex-wrap items-center gap-3 border p-3 rounded bg-white">
                      {/* Skill name (editable inline if you want) */}
                        {isMongoId(s.id) && s.endoresBy?<CheckCircle className="text-[#006666]"/>: <input
                            type="checkbox"
                            disabled={s.endoresBy?true:false}
                            className="border-[#008888] h-4 w-4"
                            // checked if this row's id exists in cvData.educations
                            checked={
                              includedSkillIds.has(s.id) ||
                              selectedSkill.skills.some(
                                (e: any) =>
                                  e.id ===
                                  (form.getValues(`skills.${index}.id`) || s.id)
                              )
                            }
                            onChange={() => handleSkillInclude(index)}
                            aria-label={`Include skills ${index + 1} in CV`}
                          />}
                      <div className="flex-1 text-sm font-medium text-slate-800">
                        <FormField
                          control={control}
                          name={`skills.${index}.skillName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  disabled
                                  {...field}
                                  className="w-full"
                                  placeholder="Skill name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Level dropdown (per skill) */}
                      <div className="w-full sm:w-40">
                        <FormField
                          control={control}
                          name={`skills.${index}.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <select
                                  disabled
                                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006666] focus:border-[#006666]"
                                  {...field}
                                >
                                  {levelOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Self-attest + remove */}
                      <div className="flex items-center gap-2">
                        <FormField
                          control={control}
                          name={`skills.${index}.selfAttested`}
                          render={() => (
                            <FormItem>
                              <FormControl>
                                <SelfAttestButton
                                  className="py-2 mb-2"
                                  isAttested={
                                    form.watch(
                                      `skills.${index}.selfAttested`
                                    ) as boolean
                                  }
                                  onClick={() => handleSelfAttest(index)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isMongoId(s.id)? 
                          <button
                            type="button"
                            onClick={() => deleteHandler(index)}
                            className=" px-2 py-1 rounded border shadow-lg border-red-600 bg-transparent text-red-600 text-sm flex font-semibold items-center gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                          >
                            <Delete size={18} />
                            {loading&&idx===index?"Deleting...":"Delete"}
                          </button>
                        :<button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className=" px-2 py-1 rounded border shadow-lg border-red-600 bg-transparent text-red-600 text-sm flex font-semibold items-center gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                          >
                            <Trash2 size={18} />
                            Remove
                          </button>}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            {fields.length > 0 &&
              (loading ? (
                <LoadingButton className="w-full bg-[#006666] hover:bg-[#008888] active:scale-[0.99] transition" />
              ) : (
                <>
                <Button className="w-full bg-[#006666] hover:bg-[#008888] active:scale-[0.99] transition">
                  Save
                </Button>
                </>
              ))}
          </div>
        </StepCard>
        <SkillVerificationModel isOpenModel={isOpenModel} setOpenModel={setOpenModel} selectedSkill={selectedSkill}/>
      </form>
    </Form>
  );
};
