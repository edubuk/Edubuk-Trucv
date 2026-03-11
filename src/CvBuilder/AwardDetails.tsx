import { useEffect, useState, useMemo } from "react";
import { StepCard } from "./StepCard";
import {
  Award,
  Badge,
  Building2,
  Calendar,
  Delete,
  ExternalLink,
  FileText,
  Paperclip,
  PlusCircle,
  Replace,
  Trash2,
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
import { handleProofUploaded } from "./uploadProof";
import toast from "react-hot-toast";
//import { useUserData } from "@/context/AuthContext";
import LoadingButton from "@/components/LoadingButton";
import { isMongoId } from "@/lib/utils";
import api from "@/lib/api";
import StatusBadge from "./StatusBadge";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";

export const AwardDetails = ({
  step,
  setStep,
  uid,
  cvData,
  setCvData,
}: IStepCard) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [idx,setIdx] = useState<number>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loadingState,setLoadingState] = useState<"Updating"|"Deleting"|"Submitting" | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [parsedAwardsData, setParsedAwardsData] = useState<[]>();
  const cvDataFromStorage = localStorage.getItem("awards");

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
      const result = await api.post(`/doc/save-awards`, {
        data:payload
      });
      const res = await result.data;
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setLoadingState(null);
      setRefresh((prev) => !prev);
      updateLocalStorageData(payload.name);
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
    if(cvDataFromStorage){
      setParsedAwardsData(JSON.parse(cvDataFromStorage));
    }
  }, [step === 7, refresh]);

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

  const uploadDocHandler = async(file:File,index:number)=>{
    if (!file) return;
    setSelectedFileName(file.name);
    const uploadRes = await handleProofUploaded({
      file,
      setIsUploading,
      setUploadError,
      setSelectedFileName,
    });
    if(!uploadRes) return;
    const {url,docHash} = uploadRes;
    setValue(`awards.${index}.docUri`, url, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`awards.${index}.docHash`, docHash, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

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

  const includedIds = useMemo(
    () => new Set(cvData.educations.map((e: any) => e.id)),
    [cvData]
  );

  function buildEducationPayload(index: number) {
    // grab the whole education row from RHF form values
    const row = getValues(`awards.${index}`) || {};
    // ensure a stable id — prefer existing ID from the form if present
    const id = row.id || uid("exp");
    return { ...row, id };
  }

  function handleToggleInclude(index: number) {
    const payload = buildEducationPayload(index);

    setCvData((prev: any) => {
      const exists = prev.awards.some((e: any) => e.id === payload.id);
      if (exists) {
        // remove
        return {
          ...prev,
          awards: prev.awards.filter((e: any) => e.id !== payload.id),
        };
      } else {
        // add (append)
        return { ...prev, awards: [...prev.awards, payload] };
      }
    });
  }

  const fillParsedAwardsDetails = ()=>{
   if(parsedAwardsData)
   {
    parsedAwardsData.map((doc:any)=>
      append({
      id: uid("awd"),
      level:"Certificate",
      name: doc.name,
      organisation: doc.organisation,
      duration: { from: "", to: "" },
      description:doc.description || "",
      isEmailSend: false,
      selfAttested: false,
      verified: false,
      status: "pending",
      verifiedThrough: "",
    }))
   }
  }

    const updateLocalStorageData = (awardName:string)=>{
    if(parsedAwardsData){
      const cvData = cvDataFromStorage ? JSON.parse(cvDataFromStorage):null;
      const updatedData = cvData?.filter((doc:any)=>
        doc.name!==awardName
      )
      localStorage.setItem("awards",JSON.stringify(updatedData))
    }
  }

  return (
    <Form {...form}>
      <form >
        <StepCard
          index={7}
          title="Certificates/Courses/Awards"
          icon={Award}
          open={step === 6}
          onToggle={() => setStep(step === 6 ? 0 : 6)}
        >
          <p className="text-sm text-slate-500">
            Add projects. Make them stand out with URL and short description.
            Each item can be removed.
          </p>
          {refresh?<ThreeDotLoader w={3} h={3} yPos="center"/>:
          <div className="mt-4 space-y-4">
            {fields.map((a, index) => (
              <>
              {!isMongoId(a.id) &&<div className="flex items-center justify-center border-dashed border-[#03257e] border-b">
                      <span className="relative top-4 bg-white p-1 text-md text-center text-[#03257e]">Save New Document</span>
                    </div>}
                {isMongoId(a.id) && (
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      className="border-[#008888] h-4 w-4"
                      // checked if this row's id exists in cvData.educations
                      checked={
                        includedIds.has(a.id) ||
                        cvData.awards.some(
                          (e: any) =>
                            e.id ===
                            (form.getValues(`awards.${index}.id`) || a.id)
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
                  <div key={a.rhfKey} className="border p-4 rounded bg-white">
                  <div className="flex justify-between flex-wrap items-center mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                      <div className="text-sm font-medium">Organisation</div>
                      <div className="text-xs flex gap-1 items-center text-slate-500 break-all">
                        {a.id}
                        {isMongoId(a.id) &&
                        <StatusBadge status={a.status} isEmailSend={a.isEmailSend}/>
                        }
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
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
                      <div className="flex items-center gap-1">
                        {isMongoId(a.id) ? (
                          <Button
                            type="button"
                            disabled={a.verified || loadingState==="Updating"}
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
                            onClick={() => removeAward(index)}
                            className="mt-2 px-1 sm:py-1 sm:px-3 rounded border border-red-600 text-red-600 flex items-center shadow-lg gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        )}
                        {isMongoId(a.id) && (
                          <Button
                            disabled={a.verified || loadingState==="Deleting"}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
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
                            disabled={a.verified}
                              placeholder={`${a.level} name`}
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
                            disabled={a.verified}
                              placeholder="Organisation"
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
                      name={`awards.${index}.duration.from`}
                      render={({ field}) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Calendar className="text-[#006666] size-4" />
                              {a.level === "Course"
                                ? "From (eg. 10/11/2015)*"
                                : "Date of achievement*"}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                            disabled={a.verified}
                            type="date" {...field} />
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
                                To (eg. 10/11/2018)*
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                              disabled={a.verified}
                              type="date" {...innerField} />
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
                            disabled={a.verified}
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
                  {!isMongoId(a.id)&&<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start md:items-center mt-1">
                    {/* Upload / proof column */}
                    <FormField
                      control={control}
                      name={`awards.${index}.docUri`}
                      render={() => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            <div className="flex items-start md:items-center gap-2">
                              <Paperclip className="h-5 w-5 text-gray-700" />
                              <div className="text-sm text-gray-700">
                                Upload your document and send an email to the
                                issuer for verification.
                              </div>
                            </div>
                          </FormLabel>

                          <FormControl>
                            {/* Styled drop area / button */}
                            <div className="relative w-full bg-white">
                              <input
                                id={`proof-file-${index}`}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(event)=>uploadDocHandler(event.target.files?.[0]!,index)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label={`Upload proof for experience ${
                                  index + 1
                                }`}
                              />

                              {/* Visible content */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2">
                                {form.getValues(
                                    `awards.${index}.docUri`
                                  )?<div className="flex items-center gap-2">
                                    <span className="text-green-600">
                                      File Uploaded
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        // clear file input visually — if you need to clear the actual input element value, you can
                                        // keep a ref to the input and set inputRef.current.value = ""
                                        setSelectedFileName(null);
                                        // optionally update form state to clear URL: form.setValue(`educations.${index}.proof`, "")
                                      }}
                                      className="text-sm px-3 py-1 text-[#f14419] rounded-md border border-[#f14419] hover:bg-[#f14419] hover:text-white"
                                    >
                                      Clear
                                    </button>
                                  </div>:<div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-[#FB980E]">
                                    <Paperclip className="h-4 w-4 text-[#171515]" />
                                    <span className="text-sm text-gray-800">
                                      {selectedFileName ??
                                        "Upload File"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#f14419]">
                                    Accepted:.jpg .jpeg .png .pdf — max
                                    5MB
                                  </p>
                                </div>}
                              </div>
                            </div>
                          </FormControl>

                          <FormMessage />

                          {/* upload / error states already in your codebase */}
                          {uploadError && (
                            <p className="mt-2 text-sm text-red-600 font-medium">
                              {uploadError}
                            </p>
                          )}
                          {isUploading && (
                            <p className="mt-2 text-sm text-green-600">
                              Uploading document — please wait…
                            </p>
                          )}

                          {/* If you have a stored URL in the form value, show a preview link */}
                          {form.getValues(`awards.${index}.docUri`) && (
                            <a
                              href={form.getValues(`awards.${index}.docUri`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 flex w-32 justify-center items-center text-sm text-[#008888] rounded border border-[#008888] px-2 py-1 gap-1"
                            >
                              View proof <ExternalLink className="size-4" />
                            </a>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Issuer email + send button column */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                      <FormField
                        control={control}
                        name={`awards.${index}.issuerEmailId`}
                        render={({ field: f }) => (
                          <>
                            <label
                              htmlFor={`issuerEmail-${index}`}
                              className="min-w-[110px] text-sm font-medium text-gray-700"
                            >
                              Issuer Email:
                            </label>

                            <div className="flex-1 flex gap-2 items-center">
                              <Input
                                id={`issuerEmail-${index}`}
                                placeholder="Enter issuer's email address"
                                className="w-full rounded-lg px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6334FA] focus:border-[#6334FA]"
                                {...f}
                              />
                              <FormMessage />
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>}
                  {loadingState === "Submitting" ? (
              (index===idx)&&<LoadingButton className="w-full bg-[#008888] mt-2 hover:bg-[#006666]"/>
            ) : (
              !isMongoId(a.id)&&<Button
                type="button"
                onClick={()=>submitFormHandler(index)}
                className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition"
              >
                Save
              </Button>
            )}
                </div>
              </>
            ))}

            <div className="flex justify-start items-center gap-2">
              <button
                onClick={addAward}
                className="flex items-center shadow-lg border-[#03257e] text-[#03257e] gap-2 px-3 py-1 rounded border"
              >
                <PlusCircle size={16} /> Add Award/Certificate
              </button>
              {parsedAwardsData&&parsedAwardsData.length > 0 && <button
              type="button"
                onClick={fillParsedAwardsDetails}
                className="flex items-center shadow-lg border-[#03257e] text-white bg-[#03257e] gap-2 px-3 py-1 rounded border"
              >
                <PlusCircle size={16} /> Fill from Parsed Data
              </button>}
            </div>
          </div>
         }
        </StepCard>
      </form>
    </Form>
  );
};
