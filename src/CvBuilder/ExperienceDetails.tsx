import { useEffect, useState, useMemo } from "react";
import { StepCard } from "./StepCard";
import {
  Briefcase,
  BriefcaseBusiness,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Delete,
  ExternalLink,
  FileText,
  Paperclip,
  PenLine,
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
import { handleProofUploaded } from "./uploadProof";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
import { isMongoId } from "@/lib/utils";
import api from "@/lib/api";
//import { useUserData } from "@/context/AuthContext";

export const ExperienceDetails = ({
  step,
  setStep,
  uid,
  docId,
  setCvData,
  cvData,
}: IStepCard) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
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
  const { control, setValue, getValues } = form;
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [idx, setIdx] = useState<number>();

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
    setIsCurrentlyWorking(!isCurrentlyWorking);
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
    //console.log("error", errors);
    console.log("form submit", getValues(`experiences.${index}`));
    const payload = getValues(`experiences.${index}`);
    try {
      setIdx(index);
      setLoading(true);
      const result = await api.post(`/doc/save-expDoc`, {
        data: payload,
      });
      const res = await result.data;
      if (!res.success) {
        toast.error(res.message);
        setLoading(false);
        return;
      }
      toast.success(res.message);
      setLoading(false);
      setRefresh((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message ?? error ?? "Something went wrong");
    } finally {
      setLoading(false);
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
          issuerEmailId: doc.issuerEmailId ?? "",
          verified: doc.verified ?? false,
          status: doc.status ?? "pending",
        }));
        // Update form values
        form.reset({ experiences });
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    fetchExpDocs();
  }, [step === 3, refresh]);

  const updateHandler = async (index: number) => {
    try {
      const payload = getValues(`experiences.${index}`);
      console.log("payload", payload);
      const data = await api.put(`/doc/update-expDoc/${payload.id}`, {
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
    }
  };

  const deleteHandler = async (index: number) => {
    try {
      setLoading(true);
      setIdx(index);
      const payload = getValues(`experiences.${index}`);
      const res = await api.delete(`/doc/delete-expDoc/${payload.id}`);
      console.log("res", res);
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      setRefresh((prev) => !prev);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message ?? error ?? "something went wrong");
      setLoading(false);
    }
  };

  const uploadDocHandler = async (file: File, index: number) => {
    if (!file) return;
    setSelectedFileName(file.name);
    const uploadRes = await handleProofUploaded({
      file,
      setIsUploading,
      setUploadError,
      setSelectedFileName,
    });
    if (!uploadRes) return;
    const { url, docHash } = uploadRes;
    setValue(`experiences.${index}.docUri`, url, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`experiences.${index}.docHash`, docHash, {
      shouldValidate: true,
      shouldDirty: true,
    });
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
          index={3}
          title="Experience Details"
          icon={Briefcase}
          open={step === 3}
          onToggle={() => setStep(step === 3 ? 0 : 3)}
        >
          <p className="text-sm text-slate-500">
            Add professional experiences. Each entry supports proof upload and
            self-attestation.
          </p>
          <div className="mt-4 space-y-4">
            {fields.map((field, index) => (
              <>
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
                          (field.verified ? (
                            <p className="flex items-center font-bold text-md sm:text-lg gap-1 text-[#008888]">
                              {" "}
                              <CheckCircle size={18} />
                              Verified
                            </p>
                          ) : field.isEmailSend ? (
                            <p className="flex items-center text-md sm:text-lg font-bold gap-1 text-[#f14419]">
                              <Clock size={18} />
                              Pending
                            </p>
                          ) : (
                            <p className="flex items-center text-md sm:text-lg font-bold gap-1 text-[#03257e]">
                              <PenLine size={18} />
                              Self Attested
                            </p>
                          ))}
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
                            disabled={field.verified || loading}
                            onClick={() => updateHandler(index)}
                            className="mt-2 px-3 py-1 rounded border bg-[#006666] border-[#006666] text-white flex items-center shadow-lg gap-2 hover:bg-[#006666]/90 active:scale-[0.99] transition"
                          >
                            <Replace size={18} />{" "}
                            {loading && idx === index
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
                            disabled={field.verified || loading}
                            type="button"
                            onClick={() => deleteHandler(index)}
                            className="mt-2 px-1 sm:py-1 sm:px-3 rounded border bg-[#f14419] border-[#f14419] text-white flex items-center shadow-lg gap-2 hover:bg-[#f14419]/80 active:scale-[0.99] transition"
                          >
                            <Delete size={18} /> Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <input
                      type="checkbox"
                      onChange={() => checkboxHandler(index)}
                      checked={isCurrentlyWorking}
                    />
                    <p className="text-[#03257e]">
                      Are you currently working here ?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <FormField
                      control={control}
                      name={`experiences.${index}.companyName`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Building className="text-[#006666] size-4" />
                              Company Name*
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
                      name={`experiences.${index}.jobRole`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <BriefcaseBusiness className="text-[#006666] size-4" />
                              Position*
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="eg. Software Engineer"
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
                            <Input type="date" {...innerField} />
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
                              type="date"
                              {...innerField}
                              disabled={isCurrentlyWorking}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.skills`}
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
                              placeholder="Write your skills"
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
                      name={`experiences.${index}.description`}
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
                  {!field.verified && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start md:items-center">
                      {/* Upload / proof column */}
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.docUri`}
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
                                  onChange={(e) =>
                                    uploadDocHandler(
                                      e.target.files?.[0]!,
                                      index
                                    )
                                  }
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  aria-label={`Upload proof for experience ${
                                    index + 1
                                  }`}
                                />

                                {/* Visible content */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2">
                                  {form.getValues(
                                    `experiences.${index}.docUri`
                                  ) ? (
                                    <div className="flex items-center gap-2">
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
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-[#FB980E]">
                                        <Paperclip className="h-4 w-4 text-[#171515]" />
                                        <span className="text-sm text-gray-800">
                                          {selectedFileName ?? "Upload File"}
                                        </span>
                                      </div>
                                      <p className="text-xs text-[#f14419]">
                                        Accepted:.jpg .jpeg .png .pdf — max 5MB
                                      </p>
                                    </div>
                                  )}
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
                            {form.getValues(`experiences.${index}.docUri`) && (
                              <a
                                href={form.getValues(
                                  `experiences.${index}.docUri`
                                )}
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
                          name={`experiences.${index}.issuerEmailId`}
                          render={({ field: f }) => (
                            <>
                              <label
                                htmlFor={`issuerEmail-${index}`}
                                className="min-w-[110px] text-sm font-medium text-gray-700"
                              >
                                Issuer Email:
                              </label>

                              <div className="flex-1 flex-col gap-2 items-center">
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

                        {/* {loading?<LoadingButton />:<Button
                                                type="button"
                                                onClick={() => emailHandler(index)}
                                                className="whitespace-nowrap"
                                            >
                                                Send Email To Issuer
                                            </Button>} */}
                      </div>
                    </div>
                  )}
                  {loading
                    ? index === idx && (
                        <LoadingButton className="w-full bg-[#008888] mt-2 hover:bg-[#006666]" />
                      )
                    : !isMongoId(field.id) && (
                        <Button
                          onClick={() => submitFormHandler(index)}
                          type="button"
                          className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition"
                        >
                          Save
                        </Button>
                      )}
                </div>
              </>
            ))}

            <div>
              <button
                onClick={addExperience}
                className="flex items-center shadow-lg border-[#03257e] text-[#03257e] gap-2 px-3 py-1 rounded border"
              >
                <PlusCircle size={16} /> Add Experience
              </button>
            </div>
          </div>
        </StepCard>
      </form>
    </Form>
  );
};
