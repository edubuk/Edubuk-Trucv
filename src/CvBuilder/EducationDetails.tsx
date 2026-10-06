import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DigilockerImg from "../assets/digilocker.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelfAttestButton from "@/components/Buttons/SelfAttest";
import { EducationSchema, EducationFormValues } from "./cvSchema"; // make sure these are exported
import {
  PlusCircle,
  Trash2,
  Calendar,
  Building,
  School,
  BookOpen,
  Replace,
  CheckCircle,
  Delete,
  SquarePercent,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StepCard } from "./StepCard";
// import { uploadFile } from "@/uploadFile";
import { DropDown } from "@/components/ui/dropdown";
import DigiLockerTest from "@/components/DigiLocker/DigiLockerPullTest";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
//import { useUserData } from "@/context/AuthContext";
import { isMongoId } from "@/lib/utils";
import { ICvData } from "./CvBuilder";
import api from "@/lib/api";
import StatusBadge from "./StatusBadge";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";
//import { useContract } from "@/Blockchain/hooks/useMyContract";
//import { useAccount } from "wagmi";
//import { parseContractError } from "@/Blockchain/utils/error";

const collegeOptions = [
  {
    orgId: "001447",
    name: "Council for the Indian School Certificate Examination (CISCE)",
  },
  {
    orgId: "000027",
    name: "Central Board of Secondary Education(CBSE)",
  },
  {
    orgId: "001925",
    name: "UP State Board of High School and Intermediate Education(UP Board)",
  },
  {
    orgId: "003513",
    name: "Dr. A.P.J. Abdul Kalam University",
  },
  {
    orgId: "000607",
    name: "STATE BOARD OF TECHNICAL EDUCATION, BIHAR",
  },
  {
    orgId: "000098",
    name: "Maharashtra State Board of Secondary and Higher Secondary Education, Pune",
  },
];

export const EducationDetails = ({
  step,
  setStep,
  uid,
  docId,
  cvData,
}: {
  step: number;
  setStep: any;
  uid: (p?: string) => string;
  docId: () => string;
  setCvData: React.Dispatch<React.SetStateAction<any>>;
  cvData: ICvData;
}) => {
  const [refresh, setRefresh] = useState<boolean>(true);
  //const { user } = useUserData();
  const [idx, setIdx] = useState<number>();
  const [loadingState, setLoadingState] = useState<
    "Updating" | "Deleting" | "Submitting" | null
  >(null);
  const [openDigiLocker, setOpenDigiLocker] = useState<boolean>(false);
  const [customLevel, setCustomLevel] = useState<string>();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  // const { submitDocument } = useContract();
  // const { address } = useAccount();
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(EducationSchema),
    defaultValues: {
      educations: [
        {
          id: uid("edu"),
          eduDocId: docId(),
          level: "Secondary School",
          boardNameOrDegree: "",
          institutionName: "",
          gpa: "",
          duration: { from: "", to: "" },
          selfAttested: false,
          isEmailSend: false,
          verified: false,
          status: "pending",
        },
      ],
    },
  });

  const { control, setValue, formState, getValues } = form;
  const { errors } = formState;
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "educations",
    keyName: "rhfKey", // so we can use fields.map safely
  });

  // local UI state for proof dialog/upload (example)

  const submitFormHandler = async (index: number) => {
    console.log("error", errors);
    const isValid = await form.trigger(`educations.${index}`);
    if (!isValid) return;
    console.log("error", errors);
    const digiLockerHash = "5de0e71f3766b54139668853b1c253dcdec61eef1f00fa24ba1ab112081148c0";
    if(getValues(`educations.${index}.verifiedThrough`)==="DigiLocker"){
      setValue(`educations.${index}.docHash`, digiLockerHash);
    }
    //console.log("form submit", getValues(`educations.${index}`));
    const payload = getValues(`educations.${index}`);
    try {
      setIdx(index);
      setLoadingState("Submitting");
      // if (payload.docHash || payload.verifiedThrough==="DigiLocker") {
      //   const id = toast.loading("Submitting on chain...");
      //   // "This is DigiLocker verified"->hash256
      //   try {
      //     await submitDocument({
      //       name: payload.level,
      //       hashString: payload.verifiedThrough==="DigiLocker" ? `0x${digiLockerHash}` as `0x${string}` : `0x${payload.docHash}` as `0x${string}`,
      //       docType: "education",
      //       tokenUri: "",
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

      const { data } = await api.post(`/doc/save-eduDoc`, { data: payload });

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

  const addEducation = (
    level:
      | "Secondary School"
      | "Higher Secondary School"
      | "Graduation"
      | "PostGraduation"
      | "Other"
      | any,
  ) => {
    append({
      id: uid("edu"),
      eduDocId: docId(),
      level,
      boardNameOrDegree: "",
      institutionName: "",
      gpa: "",
      duration: { from: "", to: "" },
      selfAttested: false,
      isEmailSend: false,
      verified: false,
      status: "pending",
    });
    setExpandedCard(fields.length);
  };

  const removeEducation = (index: number) => remove(index);

  // Self attest toggle for a specific index
  const handleSelfAttest = (index: number) => {
    setValue(`educations.${index}.selfAttested`, true, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const fetchEducationsDocs = async () => {
    try {
      const data = await api.get(`/doc/education-docs`);
      const res = await data.data;
      console.log("data", res);
      if (res.success) {
        const educations = res.documents.map((doc: any) => ({
          id: doc._id ?? uid("edu"), // ensure unique id for RHF key
          eduDocId: "as23jhhdjcie83bndn",
          level: doc.level ?? "",
          boardNameOrDegree: doc.boardNameOrDegree ?? "",
          institutionName: doc.institutionName ?? "",
          gpa: doc.gpa ?? "",
          duration: {
            from: doc.duration?.from ?? "",
            to: doc.duration?.to ?? "",
          },
          selfAttested: doc.selfAttested ?? false,
          docUri: doc.docUri ?? "",
          orgId: doc.orgId ?? "",
          issuerEmailId: doc.issuerEmailId ?? undefined,
          isEmailSend: doc.isEmailSend ?? false,
          verified: doc.verified ?? false,
          status: doc.status ?? "pending",
        }));
        cvData.educations = educations;
        // Update form values
        form.reset({ educations });
      }
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setRefresh(false);
    }
  };

  useEffect(() => {
    fetchEducationsDocs();
  }, [refresh]);

  const updateHandler = async (index: number) => {
    try {
      console.log("errors", errors);
      const isValid = await form.trigger(`educations.${index}`);
      if (!isValid) return;
      const payload = getValues(`educations.${index}`);
      console.log("payload", payload);
      setLoadingState("Updating");
      const data = await api.put(`/doc/update-eduDoc/${payload.id}`, {
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
      const confirm = window.confirm(
        "Are you sure you want to delete this educational document?",
      );
      if (!confirm) return;
      setIdx(index);
      setLoadingState("Deleting");
      const payload = getValues(`educations.${index}`);
      const res = await api.delete(`/doc/delete-eduDoc/${payload.id}`);
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


  const addCustomLevel = (index: number, field: any) => {
    if (customLevel) {
      update(index, {
        ...field,
        level: customLevel,
      });
    }
  };

  return (
    <>
      <Form {...form}>
        {/* noValidate disables native browser popup validation */}
        <form noValidate>
          <StepCard
            index={3}
            title="Educational Details"
            icon={BookOpen}
            open={step === 3}
            onToggle={() => setStep(step === 3 ? 0 : 3)}
          >
            <p className="text-sm leading-6 text-slate-500">
              Manage your education records from one place. Add a new document,
              update saved details, include items in the resume, or delete old
              records when they are no longer needed.
            </p>
            {refresh ? (
              <ThreeDotLoader w={3} h={3} yPos="center" />
            ) : (
              <div className="mt-4 space-y-4">
                {fields.map((field, index) => {
                  // Use field values if you need quick read-only access:
                  //const levelPath = `educations.${index}.level` as const;
                  return (
                    <>
                      <div
                        key={field.rhfKey}
                        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${isMongoId(field.id) ? "border-slate-200" : "border-[#008888]/50 ring-2 ring-[#008888]/10"}`}
                      >
                        <div
                          className="cursor-pointer bg-white px-4 py-3.5 md:px-5 hover:bg-slate-50/70 transition-colors"
                          onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") setExpandedCard(expandedCard === index ? null : index);
                          }}
                        >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#006666]/10 text-[#006666]"><School size={17} /></span>
                              {field.level === "Secondary School" ||
                              field.level === "Higher Secondary School"
                                ? "School"
                                : "College"}{" "}
                              entry
                              <span className={`rounded-full px-2 py-0.5 text-[11px] ${isMongoId(field.id) ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
                                {isMongoId(field.id) ? "Added" : "New draft"}
                              </span>
                            </div>
                            <div className="text-xs flex gap-1 items-center text-slate-500">
                              {field.institutionName || field.boardNameOrDegree || "Details not added yet"}
                              {isMongoId(field.id) && (
                                <StatusBadge
                                  status={field.status}
                                  isEmailSend={field.isEmailSend}
                                />
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[#006666]/40 hover:text-[#006666]" aria-label={expandedCard === index ? "Hide details" : "Edit education details"}>
                              <Replace size={14} /> {expandedCard === index ? "Close" : "Edit"} {expandedCard === index ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </span>
                          </div>
                        </div>
                        </div>

                        {/* Form body */}
                        {expandedCard === index && <>
                        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
                          <FormField control={control} name={`educations.${index}.selfAttested`} render={() => <FormItem><FormControl><SelfAttestButton isAttested={form.watch(`educations.${index}.selfAttested`) as boolean} onClick={() => handleSelfAttest(index)} /></FormControl><FormMessage /></FormItem>} />
                          <div className="flex flex-wrap gap-2">
                            {isMongoId(field.id) ? (
                              <Button disabled={field.verified || loadingState === "Deleting"} type="button" onClick={() => deleteHandler(index)} className="h-9 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50"><Delete size={15} className="mr-1.5" />{loadingState === "Deleting" && idx === index ? "Deleting..." : "Delete"}</Button>
                            ) : <button type="button" onClick={() => removeEducation(index)} className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50"><Trash2 size={16} className="mr-1.5" />Discard new draft</button>}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 md:p-5 w-full">
                          {/* Level - use Controller-like binding via setValue so RHF knows about change */}
                          <div>
                            <label className="text-black text-sm font-semibold pb-2">
                              Select your education level*
                            </label>
                            <select
                              disabled={field.verified}
                              value={field.level}
                              onChange={(e) =>
                                update(index, {
                                  ...field,
                                  level: e.target.value,
                                })
                              }
                              className="border text-[#03257e] bg-gray-100 h-9 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#006666]"
                            >
                              <option value="">Select level</option>
                              <option value="Secondary School">
                                Secondary School
                              </option>
                              <option value="Higher Secondary School">
                                Higher Secondary School
                              </option>
                              <option value="Graduation">Graduation</option>
                              <option value="PostGraduation">
                                PostGraduation
                              </option>

                              {customLevel && (
                                <option value={customLevel}>
                                  {customLevel}
                                </option>
                              )}

                              <option value="Other">Other</option>
                            </select>
                            {field.level === "Other" && (
                              <div className="flex gap-2 mt-1">
                                <input
                                  type="text"
                                  value={customLevel}
                                  onChange={(e: any) =>
                                    setCustomLevel(e.target.value)
                                  }
                                  placeholder="Enter your level"
                                  className="border text-[#000000] bg-gray-100 h-9 rounded w-full px-2 focus:outline-none focus:ring-1 focus:ring-[#000000]"
                                />
                                <button
                                  type="button"
                                  className="flex gap-1 items-center bg-[#000000] text-white px-2 py-1 rounded-lg"
                                  onClick={() => addCustomLevel(index, field)}
                                >
                                  <PlusCircle size={18} />
                                  Add
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Duration: startDate & endDate */}
                          <div className="grid grid-cols-2 gap-2">
                            <FormField
                              control={control}
                              name={`educations.${index}.duration.from`}
                              render={({ field: innerField }) => (
                                <FormItem>
                                  <FormLabel>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="text-[#006666] size-4" />
                                      Start date*
                                    </div>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={field.verified}
                                      className={isMongoId(field.id) && innerField.value === "" ? "border-red-500" : ""}
                                      type="date"
                                      placeholder="YYYY"
                                      {...innerField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name={`educations.${index}.duration.to`}
                              render={({ field: innerField }) => (
                                <FormItem>
                                  <FormLabel>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="text-[#006666] size-4" />
                                      End date*
                                    </div>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className={isMongoId(field.id) && innerField.value === "" ? "border-red-500" : ""}
                                      disabled={field.verified}
                                      type="date"
                                      placeholder="YYYY"
                                      {...innerField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Conditional fields: School */}
                          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1">
                            <FormField
                              control={control}
                              name={`educations.${index}.${
                                field.level === "Secondary School" ||
                                field.level === "Higher Secondary School"
                                  ? "boardNameOrDegree"
                                  : "institutionName"
                              }`}
                              render={({ field: f }) => (
                                <FormItem className="w-full">
                                  <FormLabel>
                                    <div className="flex items-center gap-1">
                                      <Building className="text-[#006666] size-4" />
                                      {field.level === "Secondary School" ||
                                      field.level === "Higher Secondary School"
                                        ? "Board Name (e.g. CBSE/ICSE)*"
                                        : "Institute Name*"}
                                    </div>
                                  </FormLabel>
                                  <FormControl>
                                    {/* <Input placeholder="Board name" className="w-full" {...f} /> */}
                                    <DropDown
                                      isDisabled={field.verified}
                                      classOrgId={`educations.${index}.${
                                        field.level === "Secondary School" ||
                                        field.level ===
                                          "Higher Secondary School"
                                          ? "boardNameOrDegree"
                                          : "institutionName"
                                      }`}
                                      index={index}
                                      options={collegeOptions}
                                      {...f}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={control}
                              name={`educations.${index}.${
                                field.level === "Secondary School" ||
                                field.level === "Higher Secondary School"
                                  ? "institutionName"
                                  : "boardNameOrDegree"
                              }`}
                              render={({ field: f }) => (
                                <FormItem className="w-full">
                                  <FormLabel>
                                    <div className="flex items-center gap-1">
                                      <School className="text-[#006666] size-4" />
                                      {field.level === "Secondary School" ||
                                      field.level === "Higher Secondary School"
                                        ? "Institution Name*"
                                        : "Degree(e.g. BTech,BSc.)*"}
                                    </div>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className={`w-full ${isMongoId(field.id) && f.value === "" ? "border-red-500" : ""}`}
                                      disabled={field.verified}
                                      placeholder={
                                        field.level === "Secondary School" ||
                                        field.level ===
                                          "Higher Secondary School"
                                          ? "School Name"
                                          : "Degree(e.g. BTech,BSc.)"
                                      }
                                      {...f}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={control}
                              name={`educations.${index}.gpa`}
                              render={({ field: f }) => (
                                <FormItem className="w-full sm:col-span-2">
                                  <FormLabel>
                                    <div className="flex items-center gap-1">
                                      <SquarePercent className="text-[#006666] size-4" />
                                      {field.level === "Secondary School" ||
                                      field.level === "Higher Secondary School"
                                        ? "Percentage*"
                                        : "GPA(Grade Point Average)*"}
                                    </div>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className={`w-full ${isMongoId(field.id) && f.value === "" ? "border-red-500" : ""}`}
                                      disabled={field.verified}
                                      placeholder={
                                        field.level === "Secondary School" ||
                                        field.level ===
                                          "Higher Secondary School"
                                          ? "Percentage*"
                                          : "GPA(Grade Point Average)*"
                                      }
                                      {...f}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Proof Upload & DigiLocker area (single row UI) */}
                          {!(
                            field.verified ||
                            (getValues(`educations.${index}.docUri`) &&
                              getValues(`educations.${index}.verified`))
                          ) && (
                            <div className="sm:col-span-2 mt-3 w-full rounded-xl p-2 sm:p-4 bg-white border">
                              {getValues(
                                `educations.${index}.${field.level === "Secondary School" || field.level === "Higher Secondary School" ? "boardNameOrDegree" : "institutionName"}`,
                              ) &&
                              !getValues(`educations.${index}.orgId`) &&
                              !field.orgId ? (
                                <p className="text-sm text-[#f14419] text-center mb-2">
                                  DigiLocker not available for this
                                  college/Board {field.orgId}
                                </p>
                              ) : (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <label className="text-sm font-medium text-gray-700">
                                      Get your document from{" "}
                                      <span className="text-[#6334FA] font-semibold">
                                        DigiLocker
                                      </span>{" "}
                                      (Recommended)
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenDigiLocker(true);
                                        setIdx(index);
                                      }}
                                      className="border border-[#6334FA] rounded-lg p-1.5 hover:bg-[#6334FA]/10 transition flex items-center justify-center"
                                    >
                                      <img
                                        className="h-8 w-28 object-contain"
                                        src={DigilockerImg}
                                        alt="digilocker"
                                      />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {getValues(`educations.${index}.docUri`) &&
                            getValues(`educations.${index}.verified`) && (
                              <div className="flex items-center p-4 text-green-600 gap-2">
                                <CheckCircle size={18} /> <p>Document Saved</p>
                              </div>
                            )}
                          {openDigiLocker && index === idx && (
                            <DigiLockerTest
                              setOpenDigiLocker={setOpenDigiLocker}
                              openDigiLocker={openDigiLocker}
                              field={field.level}
                              index={index}
                            />
                          )}
                        </div>
                        {isMongoId(field.id) ? (
                          <Button
                            disabled={field.verified || loadingState === "Updating"}
                            type="button"
                            onClick={() => updateHandler(index)}
                            className="mt-2 w-full bg-[#006666] text-white transition hover:bg-[#005555]"
                          >
                            <Replace size={16} className="mr-2" />
                            {loadingState === "Updating" && idx === index ? "Updating..." : "Update education"}
                          </Button>
                        ) : loadingState === "Submitting" && index === idx ? (
                          <LoadingButton className="mt-2 w-full bg-[#008888] hover:bg-[#006666]" />
                        ) : (
                          <Button
                            type="button"
                            onClick={() => submitFormHandler(index)}
                            className="mt-2 w-full bg-[#008888] text-white transition hover:bg-[#006666]"
                          >
                            Save new education
                          </Button>
                        )}
                        </>}
                      </div>
                    </>
                  );
                })}

                <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => addEducation("Secondary School")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#03257e]/20 bg-[#03257e]/5 px-4 py-2.5 text-sm font-medium text-[#03257e] shadow-sm transition hover:bg-[#03257e]/10 sm:w-auto"
                  >
                    <PlusCircle size={16} /> Add School
                  </button>
                  <button
                    type="button"
                    onClick={() => addEducation("Graduation")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#006666]/20 bg-[#006666]/5 px-4 py-2.5 text-sm font-medium text-[#006666] shadow-sm transition hover:bg-[#006666]/10 sm:w-auto"
                  >
                    <PlusCircle size={16} /> Add University/College
                  </button>
                </div>
              </div>
            )}
          </StepCard>
        </form>
      </Form>
    </>
  );
};
