import { useEffect, useState } from "react";
import { StepCard } from "./StepCard";
import {
  Briefcase,
  BriefcaseBusiness,
  Building,
  Calendar,
  Delete,
  FileText,
  PlusCircle,
  Replace,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ExperienceSchema, ExperienceFormValues } from "./cvSchema";
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
import LoadingButton from "@/components/LoadingButton";
import { isMongoId } from "@/lib/utils";
import api from "@/lib/api";
import StatusBadge from "./StatusBadge";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";
//import { useContract } from "@/Blockchain/hooks/useMyContract";
//import { useAccount } from "wagmi";
//import { parseContractError } from "@/Blockchain/utils/error";
//import { useUserData } from "@/context/AuthContext";

export const ExperienceDetails = ({
  step,
  setStep,
  uid,
  docId,
  cvData,
}: IStepCard) => {
  const [refresh, setRefresh] = useState<boolean>(true);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  //const {submitDocument} = useContract();
  //const {address} = useAccount();
  

  // const {user} = useUserData();
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(ExperienceSchema),
    defaultValues: {
      experiences: [
        {
          id: uid("exp"),
          expDocId: docId(),
          companyName: "",
          jobRole: "",
          duration: {
            from: "",
            to: "",
          },
          description: "",
          selfAttested: false,
          isEmailSend: false,
          verified: false,
          status: "pending",
        },
      ],
    },
  });
  const { control, setValue, getValues, formState } = form;
  const { errors } = formState;
  const [workingState, setWorkingState] = useState<boolean[]>([]);
  const [idx, setIdx] = useState<number>();
  const [loadingState,setLoadingState] = useState<"Updating"|"Deleting"|"Submitting" | null>(null);
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
    keyName: "rhfKey", // so we can use fields.map safely
  });

  const addExperience = (e: React.MouseEvent) => {
    e.preventDefault();
    append({
      id: uid("exp"),
      expDocId: docId(),
      companyName: "",
      jobRole: "",
      duration: { from: "", to: "" },
      skills: "",
      description: "",
      selfAttested: false,
      isEmailSend: false,
      verified: false,
      status: "pending",
    });
    setExpandedCard(fields.length);
  };

  const removeExperience = (index: number) => remove(index);

  const checkboxHandler = (index: number) => {
    setWorkingState((prev)=>{
      const updated = [...prev];
      updated[index]=!updated[index];
      return updated
    })
    setValue(`experiences.${index}.duration.to`, "present");
  };

  const handleSelfAttest = (index: number) => {
    setValue(`experiences.${index}.selfAttested`, true, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };


  const submitFormHandler = async (index: number) => {
  const isValid = await form.trigger(`experiences.${index}`);
  if (!isValid) return;

  const payload = getValues(`experiences.${index}`);
  console.log("payload", payload);
  try {
    setLoadingState("Submitting");
    setIdx(index);
    // ── Step 1: Blockchain Registration
    // if (payload.docHash) {
    //   const id = toast.loading("Submitting on chain...");
    //   try {
    //     await submitDocument({
    //       name       : payload.jobRole,
    //       hashString : `0x${payload.docHash}` as `0x${string}`,
    //       docType    : "experience",
    //       tokenUri   : "",
    //       currAddress: address as `0x${string}`,
    //     });
    //     toast.dismiss(id);
    //   } catch (txError) {
    //     const errMsg = parseContractError(txError);

    //     if (errMsg === "This document has already been submitted.") {
    //       // Already on chain — skip and proceed to DB save
    //       toast.dismiss(id);
    //       toast.custom(() => (
    //         <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
    //           <p>Document already on chain. Retrying database save...</p>
    //         </div>
    //       ));
    //     } else {
    //       // Any other chain error — stop everything
    //       toast.dismiss(id);
    //       throw txError;
    //     }
    //   }
    // }

    // ── Step 2: Database Save
    const { data } = await api.post(`/doc/save-expDoc`, { data: payload });

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
    setRefresh((prev) => !prev);

  } catch (error) {
    //toast.error(parseContractError(error));
    toast.error("Failed to submit experience details"+(error as Error)?.message);
  } finally {
    setLoadingState(null);
  }
};

  const fetchExpDocs = async () => {
    try {
      const data = await api.get(`/doc/experience-docs`);
      const res = await data.data;
      console.log("data", res);
      if (res.success) {
        const experiences = res.documents.map((doc: any) => ({
          id: doc._id ?? uid("exp"), // ensure unique id for RHF key
          expDocId: doc.expDocId ?? "",
          companyName: doc.companyName ?? "",
          jobRole: doc.jobRole ?? "",
          duration: {
            from: doc.duration?.from ?? "",
            to: doc.duration?.to ?? "",
          },
          skills: doc.skills ?? "",
          description: doc.description ?? "",
          selfAttested: doc.selfAttested ?? false,
          isEmailSend: doc.isEmailSend ?? false,
          docUri: doc.docUri ?? "",
          issuerEmailId: doc.issuerEmailId ?? undefined,
          verified: doc.verified ?? false,
          status: doc.status ?? "pending",
        }));
        cvData.experiences=experiences;
        setWorkingState((prev)=>{
          const updated = [...prev];
          res.documents.map((doc:any,idx:number)=>{
            updated[idx] = doc.duration.to==="present"?true:false;
          })
          return updated;
        })
        // Update form values
        form.reset({ experiences });
      }
    } catch (error) {
      toast.error("something went wrong");
    }finally{
      setRefresh(false);
    }
  };

  useEffect(() => {
    fetchExpDocs();
  }, [refresh]);

  const updateHandler = async (index: number) => {
    try {
      console.log("hitting");
      console.log("errors", errors);

      const isValid = await form.trigger(`experiences.${index}`);
      if (!isValid) return;
      console.log("hitting");
      setLoadingState("Updating");
      const payload = getValues(`experiences.${index}`);
      console.log("payload", payload);
      const data = await api.put(`/doc/update-expDoc/${payload.id}`, {
        data: payload,
      });
      const res = await data.data;
      if (!res.success) {
        toast.error(res.message);
        setLoadingState(null);
        return;
      }
      toast.success(res.message);
      setLoadingState(null);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("something went wrong");
      setLoadingState(null);
    }
  };

  const deleteHandler = async (index: number) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this experience document?");
      if (!confirm) return;
      setLoadingState("Deleting");
      setIdx(index);
      const payload = getValues(`experiences.${index}`);
      const res = await api.delete(`/doc/delete-expDoc/${payload.id}`);
      console.log("res", res);
      if (!res.data.success) {
        toast.error(res.data.message);
        setLoadingState(null);
        return;
      }
      toast.success(res.data.message);
      setLoadingState(null);
      setRefresh((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message ?? error ?? "something went wrong");
      setLoadingState(null);
    }
  };



  return (
    <Form {...form}>
      <form>
        <StepCard
          index={4}
          title="Experience Details"
          icon={Briefcase}
          open={step === 4}
          onToggle={() => setStep(step === 4 ? 0 : 4)}
        >
          <p className="text-sm leading-6 text-slate-500">
            Manage professional experience records with clearer actions for
            saving new roles, updating saved data, selecting resume entries, and
            deleting outdated documents.
          </p>
          {refresh?<ThreeDotLoader w={3} h={3} yPos="center"/>:
          <div className="mt-4 space-y-4">
            {fields.map((field, index) => (
              <>
                <div key={field.rhfKey} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${isMongoId(field.id) ? "border-slate-200" : "border-[#008888]/50 ring-2 ring-[#008888]/10"}`}>
                  <div
                    className="flex cursor-pointer justify-between flex-wrap items-center gap-3 bg-white px-4 py-3.5 md:px-5 hover:bg-slate-50/70 transition-colors"
                    onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setExpandedCard(expandedCard === index ? null : index);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#006666]/10 text-[#006666]"><Briefcase size={17} /></span>
                        {field.jobRole || "Experience entry"}
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${isMongoId(field.id) ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {isMongoId(field.id) ? "Added" : "New draft"}
                        </span>
                      </div>
                      <div className="text-xs flex gap-1 items-center text-slate-500">
                        {field.companyName || "Company details not added yet"}
                        {isMongoId(field.id) &&
                        <StatusBadge status={field.status} isEmailSend={field.isEmailSend}/>
                          }
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[#006666]/40 hover:text-[#006666]" aria-label={expandedCard === index ? "Hide details" : "Edit experience details"}>
                        <Replace size={14} /> {expandedCard === index ? "Close" : "Edit"} {expandedCard === index ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </span>
                    </div>
                  </div>
                  {expandedCard === index && <>
                  <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
                    <FormField control={control} name={`experiences.${index}.selfAttested`} render={() => <FormItem><FormControl><SelfAttestButton isAttested={form.watch(`experiences.${index}.selfAttested`) as boolean} onClick={() => handleSelfAttest(index)} /></FormControl><FormMessage /></FormItem>} />
                    <div className="flex flex-wrap gap-2">
                      {isMongoId(field.id) ? (
                        <Button disabled={field.verified || loadingState === "Deleting"} type="button" onClick={() => deleteHandler(index)} className="h-9 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50"><Delete size={15} className="mr-1.5" />{loadingState === "Deleting" && idx === index ? "Deleting..." : "Delete"}</Button>
                      ) : <button type="button" onClick={() => removeExperience(index)} className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50"><Trash2 size={16} className="mr-1.5" />Discard new draft</button>}
                    </div>
                  </div>
                  <div className="mx-4 mt-4 flex justify-start items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 md:mx-5">
                    <input
                      type="checkbox"
                      onChange={() => checkboxHandler(index)}
                      checked={workingState[index]}
                      className="h-4 w-4 accent-[#008888]"
                    />
                    <p>
                      Are you currently working here ?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 md:p-5">
                    <FormField
                      control={control}
                      name={`experiences.${index}.companyName`}
                      render={({field:innerField}) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Building className="text-[#006666] size-4" />
                              Company Name*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={`w-full ${isMongoId(field.id) && innerField.value === "" ? "border-red-500" : ""}`}
                              disabled={field.verified}
                              placeholder="Company Name"
                              {...innerField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.jobRole`}
                      render={({ field: innerField }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <BriefcaseBusiness className="text-[#006666] size-4" />
                              Position*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={`w-full ${isMongoId(field.id) && innerField.value === "" ? "border-red-500" : ""}`}
                              disabled={field.verified}
                              placeholder="eg. Software Engineer"
                              {...innerField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.duration.from`}
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
                              className={`w-full ${isMongoId(field.id) && innerField.value === "" ? "border-red-500" : ""}`}
                              disabled={field.verified}
                              type="date" {...innerField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.duration.to`}
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
                              className={`w-full ${isMongoId(field.id) && innerField.value === "" ? "border-red-500" : ""}`}
                              type="date"
                              {...innerField}
                              disabled={workingState[index]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.skills`}
                      render={({field:innerField}) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <FileText className="text-[#006666] size-4" />
                              Skills*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={`w-full ${isMongoId(field.id) && innerField.value === "" ? "border-red-500" : ""}`}
                              disabled={field.verified}
                              placeholder="Write your skills"
                              {...innerField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.description`}
                      render={({ field:innerField }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <FileText className="text-[#006666] size-4" />
                              Description*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={`w-full ${isMongoId(field.id) && innerField.value === "" ? "border-red-500" : ""}`}
                              disabled={field.verified}
                              placeholder="Description(write as paragraph format)"
                              {...innerField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isMongoId(field.id) ? (
                    <Button
                      type="button"
                      disabled={field.verified || loadingState === "Updating"}
                      onClick={() => updateHandler(index)}
                      className="mt-2 w-full rounded-lg bg-[#006666] text-white transition hover:bg-[#005555]"
                    >
                      <Replace size={16} className="mr-2" />
                      {loadingState === "Updating" && idx === index ? "Updating..." : "Update experience"}
                    </Button>
                  ) : loadingState === "Submitting" && index === idx ? (
                    <LoadingButton className="mt-2 w-full bg-[#008888] hover:bg-[#006666]" />
                  ) : (
                    <Button
                      onClick={() => submitFormHandler(index)}
                      type="button"
                      className="mt-2 w-full rounded-lg bg-[#008888] text-white transition hover:bg-[#006666]"
                    >
                      Save new experience
                    </Button>
                  )}
                  </>}
                </div>
              </>
            ))}

            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
              <button
                onClick={addExperience}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#03257e]/20 bg-[#03257e]/5 px-4 py-2.5 text-sm font-medium text-[#03257e] shadow-sm transition hover:bg-[#03257e]/10 sm:w-auto"
              >
                <PlusCircle size={16} /> Add Experience
              </button>
            </div>
          </div>
          }
        </StepCard>
      </form>
    </Form>
  );
};
