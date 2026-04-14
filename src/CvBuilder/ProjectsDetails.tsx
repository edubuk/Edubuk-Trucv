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
import { useEffect, useState, useMemo } from "react";
import { isMongoId } from "@/lib/utils";
import api from "@/lib/api";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";

export const ProjectDetails = ({
  step,
  setStep,
  uid,
  setCvData,
  cvData,
}: IStepCard) => {
  const [refresh, setRefresh] = useState<boolean>(true);
  const [loadingState,setLoadingState] = useState<"Updating"|"Deleting"|"Submitting" | null>(null);
  const [count,setCount] = useState<number>(0);
  const [idx, setIdx] = useState<number>();
  const [parsedProjectData, setParsedProjectData] = useState<[]>();
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
  const { control, setValue, handleSubmit, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
    keyName: "rhfKey", // so we can use fields.map safely
  });

  function addProject(e: React.MouseEvent) {
    e.preventDefault();
    setCount((prev)=>prev+1);
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

  const removeProject = (index: number) => {
    remove(index);
    setCount((prev)=>prev-1);
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
      const payload = data.projects;
      const res = await api.post(`/doc/save-projects`, {
        data: payload,
      });
      const result = await res.data;
      if (result.success) {
        toast.success(result.message);
        setCount(0);
        localStorage.removeItem("projects");
        setParsedProjectData([]);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingState(null)
      setRefresh(false);
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

  const fillParsedProjectsDetails = ()=>{
   if(parsedProjectData)
   {
    parsedProjectData.map((doc:any)=>
    {
      setCount((prev)=>prev+1)
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


  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(projectSubmitHandler)}>
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
                            (form.getValues(`projects.${index}.id`) || p.id)
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
                  <div className="flex justify-between flex-wrap items-center mb-2 w-full">
                    <div className="text-sm font-medium text-black">
                      Project <span className="text-xs text-gray-500">{p.id}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end items-center gap-2">
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
                    <div className="flex items-center gap-1">
                      {isMongoId(p.id) ? (
                        <button
                          disabled={loadingState==="Updating"}
                          type="button"
                          onClick={() => updateHandler(index)}
                          className="mt-2 px-3 py-1 rounded bg-[#006666] border border-[#006666] text-white flex items-center shadow-lg gap-2 hover:bg-[#006666]/90 active:scale-[0.99] transition"
                        >
                          <Replace size={14} />{" "}
                          {loadingState==="Updating" && idx === index ? "Updating..." : "Update"}
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
                      {isMongoId(p.id) && (
                        <Button
                          type="button"
                          disabled={loadingState==="Deleting"}
                          onClick={() => deleteHandler(index)}
                          className="mt-2 px-3 py-1 rounded border bg-[#f14419] border-[#f14419] text-white flex items-center shadow-lg gap-2 hover:bg-[#f14419]/80 active:scale-[0.99] transition"
                        >
                          <Delete size={18} /> 
                          {loadingState==="Deleting" && idx === index ? "Deleting..." : "Delete"}
                        </Button>
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
                              From (eg. 10/11/2015)*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              className={`w-full ${isMongoId(p.id) && innerField.value === "" ? "border-red-500" : ""}`}
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
                              To (eg. 10/11/2018)*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              className={`w-full ${isMongoId(p.id) && innerField.value === "" ? "border-red-500" : ""}`}
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
                </div>
              </>
            ))}

            <div className="flex justify-start items-center gap-2">
              <button
                onClick={addProject}
                className="flex items-center shadow-lg border-[#03257e] text-[#03257e] gap-2 px-3 py-1 rounded border"
              >
                <PlusCircle size={16} /> {fields.length>0?"Add More Project":"Add Project"}
              </button>
              {parsedProjectData&&parsedProjectData.length>0&&<button
                type="button"
                onClick={fillParsedProjectsDetails}
                className="flex items-center shadow-lg border-[#03257e] text-white bg-[#03257e] gap-2 px-3 py-1 rounded border"
              >
                <PlusCircle size={16} /> Fill Parsed Projects
              </button>}
            </div>
            {loadingState==="Submitting"?
            <Button
              type="button"
              className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition"
            >
              Saving...
            </Button>:
            <Button
            disabled={count===0}
              type="submit"
              className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition"
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
