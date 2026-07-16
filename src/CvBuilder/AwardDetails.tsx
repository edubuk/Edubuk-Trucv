import { useEffect, useState } from "react";
import { StepCard } from "./StepCard";
import {
  Award,
  Badge,
  Building2,
  Calendar,
  Delete,
  FileText,
  PlusCircle,
  Replace,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AwardFormValues, AwardSchema } from "./cvSchema";

import { IStepCard } from "./PersonalDetails";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SelfAttestButton from "@/components/Buttons/SelfAttest";
import toast from "react-hot-toast";
//import { useUserData } from "@/context/AuthContext";
import LoadingButton from "@/components/LoadingButton";
import { isMongoId } from "@/lib/utils";
import api from "@/lib/api";
import StatusBadge from "./StatusBadge";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";
// import { useContract } from "@/Blockchain/hooks/useMyContract";
// import { useAccount } from "wagmi";
// import { parseContractError } from "@/Blockchain/utils/error";

export const AwardDetails = ({
  step,
  setStep,
  uid,
  cvData,
}: IStepCard) => {
  const [idx,setIdx] = useState<number>();
  const [loadingState,setLoadingState] = useState<"Updating"|"Deleting"|"Submitting" | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  //const {submitDocument} = useContract();
  //const {address} = useAccount();
  // const { user } = useUserData();
  const form = useForm<AwardFormValues>({
    resolver: zodResolver(AwardSchema),
    defaultValues: {
      awards: [
        {
          id: uid("awd"),
          level: "Award",
          name: "",
          organisation: "",
          duration: { from: "", to: "" },
          description: "",
          selfAttested: false,
          isEmailSend: false,
          verified: false,
          status: "pending",
          verifiedThrough: "",
        },
      ],
    },
  });
  const { control, setValue,getValues } = form;
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "awards",
    keyName: "rhfKey", // so we can use fields.map safely
  });
  function addAward(e: React.MouseEvent) {
    e.preventDefault();
    append({
      id: uid("awd"),
      level: "Award",
      name: "",
      organisation: "",
      duration: { from: "", to: "" },
      description: "",
      isEmailSend: false,
      selfAttested: false,
      verified: false,
      status: "pending",
      verifiedThrough: "",
    });
    setExpandedCard(fields.length);
  }

  const removeAward = (index: number) => remove(index);

  const handleSelfAttest = (index: number) => {
    setValue(`awards.${index}.selfAttested`, true);
  };

  const submitFormHandler = async (index:number) => {
    const isValid = await form.trigger(`awards.${index}`);
    if (!isValid) return;
    //console.log("error", errors);
    console.log("form submit", getValues(`awards.${index}`));
    const payload = getValues(`awards.${index}`);
    try {
      setIdx(index);
      setLoadingState("Submitting");
      // step-1 submitting on blockchain 
      // if (payload.docHash) {
      //   const id = toast.loading("Submitting on chain...");
      //   try {
      //     await submitDocument({
      //       name       : payload.name,
      //       hashString : `0x${payload.docHash}` as `0x${string}`,
      //       docType    : "award",
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

      const { data } = await api.post(`/doc/save-awards`, { data: payload });

      if (!data.success) {
        toast.error(data.message);
        return;
      }
  
      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message ?? error ?? "Something went wrong");
    } finally {
      setLoadingState(null);
    }
  };

  const fetchAwdDocs = async () => {
    try {
      const data = await api.get(`/doc/award-docs`);
      const res = await data.data;
      console.log("data", res);
      if (res.success) {
        const awards = res.awards.map((doc: any) => ({
          id: doc._id ?? uid("awd"), // ensure unique id for RHF key
          awardDocId: doc.awardDocId ?? "",
          level: doc.level,
          name: doc.name ?? "",
          organisation: doc.organisation ?? "",
          duration: {
            from: doc.duration?.from ?? "",
            to: doc.duration?.to ?? "",
          },
          description: doc.description ?? "",
          selfAttested: doc.selfAttested ?? false,
          issuerEmailId: doc.issuerEmailId ?? undefined,
          docUri:doc.docUri??"",
          isEmailSend: doc.isEmailSend ?? false,
          verified: doc.verified ?? false,
          status: doc.status ?? "pending",
        }));
        cvData.awards=awards;
        // Update form values
        form.reset({ awards });
      }
    } catch (error) {
      toast.error("something went wrong");
    }finally{
      setRefresh(false);
    }
  };

  useEffect(() => {
    fetchAwdDocs();
  }, [refresh]);

  const updateHandler = async (index: number) => {
    try {
      const isValid = await form.trigger(`awards.${index}`);
      if (!isValid) return;
      setLoadingState("Updating");
      setIdx(index);
      const payload = getValues(`awards.${index}`);
      console.log("payload", payload);
      const data = await api.put(`/doc/update-awardDoc/${payload.id}`,
        {
          data:payload
        }
      );
      const res = await data.data;
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("something went wrong");
    }finally{setLoadingState(null)}
  };

  const deleteHandler = async (index: number) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this document?");
      if (!confirm) return;
      setLoadingState("Deleting");
      setIdx(index);
      const payload = getValues(`awards.${index}`);
      const res = await api.delete(`/doc/delete-awardDoc/${payload.id}`);
      console.log("res",res)
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      setRefresh((prev) => !prev);
    } catch (error: any) {
      toast.error(error.data.message || error.message || error || "something went wrong");
    }finally{
      setLoadingState(null);
    }
  };



  return (
    <Form {...form}>
      <form >
        <StepCard
          index={7}
          title="Certificates/Courses/Awards"
          icon={Award}
          open={step === 7}
          onToggle={() => setStep(step === 7 ? 0 : 7)}
        >
          <p className="text-sm text-slate-500">
            Add projects. Make them stand out with URL and short description.
            Each item can be removed.
          </p>
          {refresh?<ThreeDotLoader w={3} h={3} yPos="center"/>:
          <div className="mt-4 space-y-4">
            {fields.map((a, index) => (
              <>
                  <div key={a.rhfKey} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${isMongoId(a.id) ? "border-slate-200" : "border-[#008888]/50 ring-2 ring-[#008888]/10"}`}>
                  <div className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 hover:bg-slate-50/70 md:px-5" onClick={() => setExpandedCard(expandedCard === index ? null : index)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setExpandedCard(expandedCard === index ? null : index); }}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950"><Award size={16} className="text-[#006666]" /><span className="truncate">{a.name || `Untitled ${a.level.toLowerCase()}`}</span><span className={`rounded-full px-2 py-0.5 text-[11px] ${isMongoId(a.id) ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>{isMongoId(a.id) ? "Added" : "New draft"}</span></div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <span className="truncate">{a.organisation || "Organisation not added yet"}</span>
                        {isMongoId(a.id) &&
                        <StatusBadge status={a.status} isEmailSend={a.isEmailSend}/>
                        }
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[#006666]/40 hover:text-[#006666]"><Pencil size={14} />{expandedCard === index ? "Close" : "Edit"}{expandedCard === index ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
                  </div>
                  {expandedCard === index && <>
                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
                      <FormField
                        control={control}
                        name={`awards.${index}.selfAttested`}
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <SelfAttestButton
                                isAttested={
                                  form.watch(
                                    `awards.${index}.selfAttested`
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
                        {!isMongoId(a.id) && (
                          <button
                            type="button"
                            onClick={() => removeAward(index)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Discard draft
                          </button>
                        )}
                        {isMongoId(a.id) && (
                          <Button
                            disabled={a.verified || loadingState==="Deleting"}
                            type="button"
                            onClick={() => deleteHandler(index)}
                            className="h-9 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50"
                          >
                            <Delete size={18} />
                            {loadingState === "Deleting" && idx === index
                              ? "Deleting..."
                              : "Delete item"}
                          </Button>
                        )}
                      </div>
                    </div>
                  <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-5">
                    <div>
                      <label className="">Select your relevant field*</label>
                      <select
                      disabled={a.verified}
                        value={a.level}
                        onChange={(e) =>
                          update(index, {
                            ...a,
                            level: e.target.value as
                              | "Award"
                              | "Certificate"
                              | "Course",
                          })
                        }
                        className="border text-[#03257e] bg-gray-100 h-9 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#006666]"
                      >
                        <option value="Award">Award</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Course">Course</option>
                      </select>
                    </div>
                    <FormField
                      control={form.control}
                      name={`awards.${index}.name`}
                      render={({ field}) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Badge className="text-[#006666] size-4" />
                              {a.level}*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              className={`w-full ${isMongoId(a.id) && field.value === "" ? "border-red-500" : ""}`}
                              disabled={a.verified}
                              placeholder={`${a.level} name`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`awards.${index}.organisation`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Building2 className="text-[#006666] size-4" />
                              Organisation*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={`w-full ${isMongoId(a.id) && field.value === "" ? "border-red-500" : ""}`}
                              disabled={a.verified}
                              placeholder="Organisation"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`awards.${index}.duration.from`}
                      render={({ field}) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Calendar className="text-[#006666] size-4" />
                              {a.level === "Course" ? "From" : "Date of achievement"} <span className="font-normal text-slate-400">(optional)</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              className="w-full"
                              disabled={a.verified}
                              type="date" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {a.level === "Course" && (
                      <FormField
                        control={control}
                        name={`awards.${index}.duration.to`}
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
                                disabled={a.verified}
                                type="date" 
                                {...innerField} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={control}
                      name={`awards.${index}.description`}
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
                              className={`w-full ${isMongoId(a.id) && field.value === "" ? "border-red-500" : ""}`}
                              disabled={a.verified}
                              placeholder="Description(write as paragraph format)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isMongoId(a.id) ? (
                    <Button
                      type="button"
                      disabled={a.verified || loadingState === "Updating"}
                      onClick={() => updateHandler(index)}
                      className="mt-2 w-full bg-[#006666] text-white transition hover:bg-[#005555]"
                    >
                      <Replace size={16} className="mr-2" />
                      {loadingState === "Updating" && idx === index ? "Updating..." : "Update details"}
                    </Button>
                  ) : loadingState === "Submitting" && index === idx ? (
                    <LoadingButton className="mt-2 w-full bg-[#008888] hover:bg-[#006666]" />
                  ) : (
                    <Button
                      type="button"
                      onClick={() => submitFormHandler(index)}
                      className="mt-2 w-full bg-[#008888] text-white transition hover:bg-[#006666]"
                    >
                      Save
                    </Button>
                  )}
                  </>}
                </div>
              </>
            ))}

            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
              <button
                onClick={addAward}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#03257e]/20 bg-[#03257e]/5 px-4 py-2.5 text-sm font-medium text-[#03257e] shadow-sm transition hover:bg-[#03257e]/10 sm:w-auto"
              >
                <PlusCircle size={16} /> Add Award/Certificate
              </button>
            </div>
          </div>
         }
        </StepCard>
      </form>
    </Form>
  );
};
