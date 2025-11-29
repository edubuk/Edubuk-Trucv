import { StepCard } from "./StepCard";
import {
  Calendar,
  FileText,
  FolderOpenIcon,
  Link,
  PlusCircle,
  Replace,
  Trash2,
} from "lucide-react";
import { ProjectFormValues, ProjectSchema } from "./cvSchema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { IStepCard } from "./PersonalDetails";
import { Button } from "@/components/ui/button";
import SelfAttestButton from "@/components/Buttons/SelfAttest";
import { API_BASE_URL } from "@/main";
import toast from "react-hot-toast";
import { useEffect, useState,useMemo } from "react";
import { isMongoId } from "@/lib/utils";

export const ProjectDetails = ({
  step,
  setStep,
  uid,
  setCvData,
  cvData,
}: IStepCard) => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      projects: [
        {
          id: uid("prj"),
          projectName: "",
          projectUrl: "",
          duration: { from: "", to: "" },
          skills: "",
          description: "",
          selfAttested: false,
        },
      ],
    },
  });
  const { control, setValue, handleSubmit, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
    keyName: "rhfKey", // so we can use fields.map safely
  });

  function addProject(e: React.MouseEvent) {
    e.preventDefault();
    append({
      id: uid("prj"),
      projectName: "",
      projectUrl: "",
      duration: { from: "", to: "" },
      skills: "",
      description: "",
      selfAttested: false,
    });
  }

  const removeProject = (index: number) => remove(index);

  function handleSelfAttest(index: number) {
    setValue(`projects.${index}.selfAttested`, true, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  const projectSubmitHandler = async (data: ProjectFormValues) => {
    console.log("project form values", data);
    try {
      const payload = data.projects;
      const res = await fetch(`${API_BASE_URL}/doc/save-projects`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ data: payload }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setRefresh((prev) => !prev);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const fetchProjDocs = async () => {
    try {
      const data = await fetch(`${API_BASE_URL}/doc/projects-docs`, {
        method: "GET",
        credentials: "include",
      });
      const res = await data.json();
      console.log("data", res);
      if (res.success) {
        const projects = res.projects.map((doc: any) => ({
          id: doc._id ?? uid("prj"),
          projectName: doc.projectName ?? "",
          projectUrl: doc.projectUrl ?? "",
          duration: {
            from: doc.duration?.from ?? "",
            to: doc.duration?.to ?? "",
          },
          skills: doc.skills ?? "",
          description: doc.description ?? "",
          selfAttested: doc.selfAttested ?? false,
        }));

        // Update form values
        form.reset({ projects });
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  const updateHandler = async (index: number) => {
    try {
      const payload = getValues(`projects.${index}`);
      console.log("payload", payload);
      const data = await fetch(
        `${API_BASE_URL}/doc/update-projDoc/${payload.id}`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({ data: payload }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await data.json();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("something went wrong");
    }
  };
  useEffect(() => {
    fetchProjDocs();
  }, [step === 5, refresh]);

  const includedIds = useMemo(
              () => new Set(cvData.projects.map((e: any) => e.id)),
              [cvData]
            );
          
            function buildEducationPayload(index: number) {
              // grab the whole education row from RHF form values
              const row = getValues(`projects.${index}`) || {};
              // ensure a stable id — prefer existing ID from the form if present
              const id = row.id || uid("prj");
              return { ...row, id };
            }
          
            function handleToggleInclude(index: number) {
              const payload = buildEducationPayload(index);
          
              setCvData((prev: any) => {
                const exists = prev.projects.some((e: any) => e.id === payload.id);
                if (exists) {
                  // remove
                  return {
                    ...prev,
                    projects: prev.projects.filter((e: any) => e.id !== payload.id),
                  };
                } else {
                  // add (append)
                  return { ...prev, projects: [...prev.projects, payload] };
                }
              });
            }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(projectSubmitHandler)}>
        <StepCard
          index={5}
          title="Personal Projects"
          icon={FileText}
          open={step === 5}
          onToggle={() => setStep(step === 5 ? 0 : 5)}
        >
          <p className="text-sm text-slate-500">
            Add projects. Make them stand out with URL and short description.
            Each item can be removed.
          </p>
          <div className="mt-4 space-y-4">
            {fields.map((p, index) => (
              <>
                {isMongoId(p.id) && (
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      className="border-[#008888] h-4 w-4"
                      // checked if this row's id exists in cvData.educations
                      checked={
                        includedIds.has(p.id) ||
                        cvData.projects.some(
                          (e: any) =>
                            e.id ===
                            (form.getValues(`projects.${index}.id`) ||
                              p.id)
                        )
                      }
                      onChange={() => handleToggleInclude(index)}
                      aria-label={`Include education ${index + 1} in CV`}
                    />
                    <p className="text-[#008888]">
                      Select to include this data in your resume
                    </p>
                  </div>
                )}
                <div key={p.id} className="border p-4 rounded bg-white">
                  <div className="flex justify-between flex-wrap items-center mb-2">
                  <div className="text-sm font-medium text-[#03257e]">
                    Project {p.id}
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <FormField
                      control={control}
                      name={`projects.${index}.selfAttested`}
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <SelfAttestButton
                              isAttested={
                                form.watch(
                                  `projects.${index}.selfAttested`
                                ) as boolean
                              }
                              onClick={() => handleSelfAttest(index)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isMongoId(p.id) ? (
                      <button
                        type="button"
                        onClick={() => updateHandler(index)}
                        className="mt-2 px-3 py-1 rounded bg-[#f14419] border border-[#f14419] text-white flex items-center shadow-lg gap-2 hover:bg-[#f14419]/90 active:scale-[0.99] transition"
                      >
                        <Replace size={14} /> Update
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="mt-2 px-3 py-1 rounded border border-red-600 text-red-600 flex items-center shadow-lg gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <FormField
                      control={control}
                      name={`projects.${index}.projectName`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <FolderOpenIcon className="text-[#006666] size-4" />
                              Project Name*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Company Name"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`projects.${index}.projectUrl`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Link className="text-[#006666] size-4" />
                              Project Url
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Project Url"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`projects.${index}.duration.from`}
                      render={({ field: innerField }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Calendar className="text-[#006666] size-4" />
                              From (eg. 10/11/2015)*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...innerField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`projects.${index}.duration.to`}
                      render={({ field: innerField }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Calendar className="text-[#006666] size-4" />
                              To (eg. 10/11/2018)*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...innerField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.skills`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <FileText className="text-[#006666] size-4" />
                              Skills*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your used skills in this project. e.g.(ReactJs,Java,NodeJs)"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <FileText className="text-[#006666] size-4" />
                              Description*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description(write as paragraph format)"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            ))}

            <div>
              <button
                onClick={addProject}
                className="flex items-center shadow-lg border-[#03257e] text-[#03257e] gap-2 px-3 py-1 rounded border"
              >
                <PlusCircle size={16} /> Add Project
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition"
            >
              Save
            </Button>
          </div>
        </StepCard>
      </form>
    </Form>
  );
};
