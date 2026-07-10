import { useEffect, useState, useMemo } from "react";
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
  setCvData,
  cvData,
}: IStepCard) => {
  const [refresh, setRefresh] = useState<boolean>(true);
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


  const includedIds = useMemo(
    () => new Set(cvData.educations.map((e: any) => e.id)),
    [cvData]
  );

  function buildEducationPayload(index: number) {
    // grab the whole education row from RHF form values
    const row = getValues(`experiences.${index}`) || {};
    // ensure a stable id — prefer existing ID from the form if present
    const id = row.id || uid("edu");
    return { ...row, id };
  }

  function handleToggleInclude(index: number) {
    const payload = buildEducationPayload(index);

    setCvData((prev: any) => {
      const exists = prev.experiences.some((e: any) => e.id === payload.id);
      if (exists) {
        // remove
        return {
          ...prev,
          experiences: prev.experiences.filter((e: any) => e.id !== payload.id),
        };
      } else {
        // add (append)
        return { ...prev, experiences: [...prev.experiences, payload] };
      }
    });
  }


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
          <p className="text-sm text-slate-500">
            Add professional experiences. Each entry supports proof upload and
            self-attestation.
          </p>
          {refresh?<ThreeDotLoader w={3} h={3} yPos="center"/>:
          <div className="mt-4 space-y-4">
            {fields.map((field, index) => (
              <>
              {!isMongoId(field.id) &&<div className="flex items-center justify-center border-dashed border-[#03257e] border-b">
                <span className="relative top-4 bg-white p-1 text-md text-center text-[#03257e]">Save New Document</span>
              </div>}
                {isMongoId(field.id) && (
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      className="border-[#008888] h-4 w-4"
                      // checked if this row's id exists in cvData.educations
                      checked={
                        includedIds.has(field.id) ||
                        cvData.experiences.some(
                          (e: any) =>
                            e.id ===
                            (form.getValues(`experiences.${index}.id`) ||
                              field.id)
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
                <div key={field.rhfKey} className="border p-4 rounded bg-white">
                  <div className="flex justify-between flex-wrap items-center mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                      <div className="text-sm font-medium">Organisation</div>
                      <div className="text-xs flex gap-1 items-center text-slate-500 break-all">
                        {field.id}
                        {isMongoId(field.id) &&
                        <StatusBadge status={field.status} isEmailSend={field.isEmailSend}/>
                          }
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <FormField
                        control={control}
                        name={`experiences.${index}.selfAttested`}
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <SelfAttestButton
                                isAttested={
                                  form.watch(
                                    `experiences.${index}.selfAttested`
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
                        {isMongoId(field.id) ? (
                          <Button
                            type="button"
                            disabled={field.verified}
                            onClick={() => updateHandler(index)}
                            className="mt-2 px-3 py-1 rounded border bg-[#006666] border-[#006666] text-white flex items-center shadow-lg gap-2 hover:bg-[#006666]/90 active:scale-[0.99] transition"
                          >
                            <Replace size={18} />{" "}
                            {loadingState === "Updating" && idx === index
                              ? "Updating..."
                              : "Update"}
                          </Button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="mt-2 px-1 sm:py-1 sm:px-3 rounded border border-red-600 text-red-600 flex items-center shadow-lg gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        )}
                        {isMongoId(field.id) && (
                          <Button
                            disabled={field.verified}
                            type="button"
                            onClick={() => deleteHandler(index)}
                            className="mt-2 px-1 sm:py-1 sm:px-3 rounded border bg-[#f14419] border-[#f14419] text-white flex items-center shadow-lg gap-2 hover:bg-[#f14419]/80 active:scale-[0.99] transition"
                          >
                            <Delete size={18} /> 
                            {loadingState === "Deleting" && idx === index
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <input
                      type="checkbox"
                      onChange={() => checkboxHandler(index)}
                      checked={workingState[index]}
                    />
                    <p className="text-[#03257e]">
                      Are you currently working here ?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
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
                  {loadingState==="Submitting"
                    ? index === idx && (
                        <LoadingButton className="w-full bg-[#008888] mt-2 hover:bg-[#006666]" />
                      )
                    : !isMongoId(field.id) && (
                        <Button
                          onClick={() => submitFormHandler(index)}
                          type="button"
                          className="w-full text-white bg-[#008888] mt-2 hover:bg-[#006666] transition"
                        >
                          Save
                        </Button>
                      )}
                </div>
              </>
            ))}

            <div className="flex justify-start items-center gap-2">
              <button
                onClick={addExperience}
                className="flex items-center shadow-lg border-[#03257e] text-[#03257e] gap-2 px-3 py-1 rounded border"
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
