import { StepCard } from "./StepCard";
import {
  Calendar,
  Delete,
  FileText,
  FolderOpenIcon,
  Link,
  PlusCircle,
  Replace,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
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
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { isMongoId } from "@/lib/utils";
import api from "@/lib/api";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";

export const ProjectDetails = ({
  step,
  setStep,
  uid,
  cvData,
}: IStepCard) => {
  const [refresh, setRefresh] = useState<boolean>(true);
  const [loadingState,setLoadingState] = useState<"Updating"|"Deleting"|"Submitting" | null>(null);
  const [idx, setIdx] = useState<number>();
  const [parsedProjectData, setParsedProjectData] = useState<[]>();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const cvDataFromStorage = localStorage.getItem("projects");


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
  const { control, setValue, getValues } = form;
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
    setExpandedCard(fields.length);
  }

  const removeProject = (index: number) => {
    remove(index);
  }

  function handleSelfAttest(index: number) {
    setValue(`projects.${index}.selfAttested`, true, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  const projectSubmitHandler = async (data: ProjectFormValues) => {
    console.log("project form values", data);
    try {
      setLoadingState("Submitting")
      const payload = data.projects.filter((project) => !isMongoId(project.id));
      if (payload.length === 0) {
        toast.error("Add a new project before saving");
        return;
      }
      const res = await api.post(`/doc/save-projects`, {
        data: payload,
      });
      const result = await res.data;
      if (result.success) {
        toast.success(result.message);
        localStorage.removeItem("projects");
        setParsedProjectData([]);
        setExpandedCard(null);
        setRefresh(true);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingState(null)
    }
  };

  const fetchProjDocs = async () => {
    try {
      const data = await api.get(`/doc/projects-docs`);
      const res = await data.data;
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
        cvData.projects = projects;
        // Update form values
        form.reset({ projects });
      }
    } catch (error) {
      toast.error("something went wrong");
    }finally{
      setRefresh(false);
    }
  };

  const updateHandler = async (index: number) => {
    try {
      const isValid = await form.trigger(`projects.${index}`);
      if (!isValid) return;
      setLoadingState("Updating");
      setIdx(index);
      const payload = getValues(`projects.${index}`);
      console.log("payload", payload);
      const data = await api.put(`/doc/update-projDoc/${payload.id}`, {
        data: payload,
      });
      const res = await data.data;
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setLoadingState(null);
    }
  };

  const deleteHandler = async (index: number) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this project?");
      if (!confirm) return;
      setLoadingState("Deleting");
      setIdx(index);
      const payload = getValues(`projects.${index}`);
      const res = await api.delete(`/doc/delete-projDoc/${payload.id}`);
      console.log("res", res);
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      setRefresh((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message ?? error ?? "something went wrong");
    } finally {
      setLoadingState(null);
    }
  };

  useEffect(() => {
    fetchProjDocs();
    const cvDataFromStorageParsed = cvDataFromStorage ? JSON.parse(cvDataFromStorage) : null;
    if(cvDataFromStorageParsed){
      setParsedProjectData(cvDataFromStorageParsed);
    }
  }, [refresh]);

  const fillParsedProjectsDetails = ()=>{
   if(parsedProjectData)
   {
    parsedProjectData.map((doc:any)=>
    {
      append({
      id: uid("prj"),
      projectName:doc.projectName || "",
      projectUrl: doc.projectUrl || "",
      duration: { from: "", to: "" },
      skills:doc.skills || "",
      description: doc.description || "",
      selfAttested: false,
    })
    })
   }
  }

  const hasUnsavedProjects = fields.some((project) => !isMongoId(project.id));

  const saveNewProjects = async () => {
    const draftIndexes = fields
      .map((project, index) => (!isMongoId(project.id) ? index : -1))
      .filter((index) => index >= 0);

    if (draftIndexes.length === 0) {
      toast.error("Add a new project before saving");
      return;
    }

    const validationResults = await Promise.all(
      draftIndexes.map((index) => form.trigger(`projects.${index}`)),
    );

    if (validationResults.some((isValid) => !isValid)) {
      toast.error("Please complete the required project fields");
      return;
    }

    await projectSubmitHandler({
      projects: draftIndexes.map((index) => getValues(`projects.${index}`)),
    });
  };


  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void saveNewProjects();
        }}
      >
        <StepCard
          index={6}
          title="Personal Projects"
          icon={FileText}
          open={step === 6}
          onToggle={() => setStep(step === 6 ? 0 : 6)}
        >
          <p className="text-sm text-slate-500">
            Add projects. Make them stand out with URL and short description.
            Each item can be removed.
          </p>
          {refresh?<ThreeDotLoader w={3} h={3} yPos="center"/>:
          <div className="mt-4 space-y-4">
            {fields.map((p, index) => (
              <>
                <div key={p.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${isMongoId(p.id) ? "border-slate-200" : "border-[#008888]/50 ring-2 ring-[#008888]/10"}`}>
                  <div className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 hover:bg-slate-50/70 md:px-5" onClick={() => setExpandedCard(expandedCard === index ? null : index)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setExpandedCard(expandedCard === index ? null : index); }}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                        <FolderOpenIcon size={16} className="text-[#006666]" />
                        <span className="truncate">{p.projectName || "Untitled project"}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${isMongoId(p.id) ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>{isMongoId(p.id) ? "Added" : "New draft"}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{p.skills || "Skills and description not added yet"}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[#006666]/40 hover:text-[#006666]"><Pencil size={14} />{expandedCard === index ? "Close" : "Edit"}{expandedCard === index ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
                  </div>
                  {expandedCard === index && <>
                  <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
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
                    <div className="flex flex-wrap gap-2">
                      {!isMongoId(p.id) && (
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="inline-flex h-9 items-center rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Discard draft
                        </button>
                      )}
                      {isMongoId(p.id) && (
                        <Button
                          type="button"
                          disabled={loadingState==="Deleting"}
                          onClick={() => deleteHandler(index)}
                          className="inline-flex h-9 items-center rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50"
                        >
                          <Delete size={18} /> 
                          {loadingState==="Deleting" && idx === index ? "Deleting..." : "Delete project"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-5">
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
                              className={`w-full ${isMongoId(p.id) && field.value === "" ? "border-red-500" : ""}`}
                              placeholder="Project Name"
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
                              className="w-full"
                              placeholder="Project Url"
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
                              From <span className="font-normal text-slate-400">(optional)</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              className="w-full"
                              type="date" 
                              {...innerField} 
                            />
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
                              To <span className="font-normal text-slate-400">(optional)</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              className="w-full"
                              type="date" 
                              {...innerField} 
                            />
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
                            <Input
                              className={`w-full ${isMongoId(p.id) && field.value === "" ? "border-red-500" : ""}`}
                              placeholder="Write your used skills in this project. e.g.(ReactJs,Java,NodeJs)"
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
                              className={`w-full ${isMongoId(p.id) && field.value === "" ? "border-red-500" : ""}`}
                              placeholder="Description(write as paragraph format)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isMongoId(p.id) && (
                    <Button
                      disabled={loadingState === "Updating"}
                      type="button"
                      onClick={() => updateHandler(index)}
                      className="mt-2 w-full rounded-lg bg-[#006666] text-white transition hover:bg-[#005555]"
                    >
                      <Replace size={16} className="mr-2" />
                      {loadingState === "Updating" && idx === index ? "Updating..." : "Update project"}
                    </Button>
                  )}
                  </>}
                </div>
              </>
            ))}

            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
              <button
                onClick={addProject}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#03257e]/20 bg-[#03257e]/5 px-4 py-2.5 text-sm font-medium text-[#03257e] shadow-sm transition hover:bg-[#03257e]/10 sm:w-auto"
              >
                <PlusCircle size={16} /> {fields.length>0?"Add More Project":"Add Project"}
              </button>
              {parsedProjectData&&parsedProjectData.length>0&&<button
                type="button"
                onClick={fillParsedProjectsDetails}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#03257e] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#03257e]/90 sm:w-auto"
              >
                <PlusCircle size={16} /> Fill Parsed Projects
              </button>}
            </div>
            {loadingState==="Submitting"?
            <Button
              type="button"
              className="w-full text-white bg-[#008888] mt-2 hover:bg-[#006666] transition"
            >
              Saving...
            </Button>:
            <Button
            disabled={!hasUnsavedProjects}
              type="submit"
              className="w-full text-white bg-[#008888] mt-2 hover:bg-[#006666] transition"
            >
              {fields.length>0?"Save New Project":"Save Project"}
            </Button>
            }
          </div>
          }
        </StepCard>
      </form>
    </Form>
  );
};
