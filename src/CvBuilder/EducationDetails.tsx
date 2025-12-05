import { useEffect, useState, useMemo } from "react";
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
  Percent,
  Paperclip,
  ExternalLink,
  BookOpen,
  Replace,
  CheckCircle,
  Delete,
  Clock,
} from "lucide-react";
import { StepCard } from "./StepCard";
// import { uploadFile } from "@/uploadFile";
import { DropDown } from "@/components/ui/dropdown";
import { handleProofUploaded } from "./uploadProof";
import DigiLockerTest from "@/components/DigiLocker/DigiLockerPullTest";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
//import { useUserData } from "@/context/AuthContext";
import { isMongoId } from "@/lib/utils";
import { ICvData } from "./CvBuilder";
import api from "@/lib/api";


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
                          orgId:"000098",
                          name:"Maharashtra State Board of Secondary and Higher Secondary Education, Pune"
                        }
                      ]

export const EducationDetails = ({
  step,
  setStep,
  uid,
  docId,
  setCvData,
  cvData,
}: {
  step: number;
  setStep: any;
  uid: (p?: string) => string;
  docId: () => string;
  setCvData: React.Dispatch<React.SetStateAction<any>>;
  cvData: ICvData;
}) => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  //const { user } = useUserData();
  const [idx, setIdx] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openDigiLocker, setOpenDigiLocker] = useState<boolean>(false);
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const submitFormHandler = async (index: number) => {
    console.log("error", errors);
    const isValid = await form.trigger(`educations.${index}`);
    if (!isValid) return;
    console.log("error", errors);
    console.log("form submit", getValues(`educations.${index}`));
    const payload = getValues(`educations.${index}`);
    try {
      setIdx(index);
      setLoading(true);
      const result = await api.post(`/doc/save-eduDoc`, {
        data:payload
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

  const addEducation = (
    level:
      | "Secondary School"
      | "Higher Secondary School"
      | "Graduation"
      | "PostGraduation"
      | "Other"
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
          issuerEmailId: doc.issuerEmailId ?? "",
          isEmailSend: doc.isEmailSend ?? false,
          verified: doc.verified ?? false,
          status: doc.status ?? "pending",
        }));

        // Update form values
        form.reset({ educations });
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    fetchEducationsDocs();
  }, [step === 2, refresh]);

  const updateHandler = async (index: number) => {
    try {
      const payload = getValues(`educations.${index}`);
      console.log("payload", payload);
      const data = await api.put(`/doc/update-eduDoc/${payload.id}`, {
        data:payload
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
      setIdx(index);
      setLoading(true);
      const payload = getValues(`educations.${index}`);
      const res = await api.delete(`/doc/delete-eduDoc/${payload.id}`);
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
   try {
    setSelectedFileName(file.name);
    setIdx(index);
    const uploadRes = await handleProofUploaded({
      file,
      setIsUploading,
      setUploadError,
      setSelectedFileName,
    });
    console.log("upload res", uploadRes);
    if (!uploadRes) return;
    const { url, docHash } = uploadRes;
    setValue(`educations.${index}.docUri`, url, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`educations.${index}.docHash`, docHash, {
      shouldValidate: true,
      shouldDirty: true,
    });
   } catch (error) {
    toast.error("something went wrong");
   }finally{
     setSelectedFileName(null);
     setIsUploading(false);
   }
  };

  const includedIds = useMemo(
    () => new Set(cvData.educations.map((e: any) => e.id)),
    [cvData]
  );

  function buildEducationPayload(index: number) {
    // grab the whole education row from RHF form values
    const row = getValues(`educations.${index}`) || {};
    // ensure a stable id — prefer existing ID from the form if present
    const id = row.id || uid("exp");
    return { ...row, id };
  }

  function handleToggleInclude(index: number) {
    const payload = buildEducationPayload(index);

    setCvData((prev: any) => {
      const exists = prev.educations.some((e: any) => e.id === payload.id);
      if (exists) {
        // remove
        return {
          ...prev,
          educations: prev.educations.filter((e: any) => e.id !== payload.id),
        };
      } else {
        // add (append)
        return { ...prev, educations: [...prev.educations, payload] };
      }
    });
  }

  return (
    <>
      <Form {...form}>
        {/* noValidate disables native browser popup validation */}
        <form noValidate>
          <StepCard
            index={2}
            title="Educational Details"
            icon={BookOpen}
            open={step === 2}
            onToggle={() => setStep(step === 2 ? 0 : 2)}
          >
            <p className="text-sm text-slate-500">
              Add education entries. Choose school or college. Each entry can be
              self-attested and have proof uploaded.
            </p>
            <div className="mt-4 space-y-4">
              {fields.map((field, index) => {
                // Use field values if you need quick read-only access:
                //const levelPath = `educations.${index}.level` as const;
                return (
                  <div
                    key={field.rhfKey}
                    className="border p-4 md:p-6 rounded-xl bg-white shadow-sm"
                  >
                    {isMongoId(field.id) && (
                      <div className="flex justify-start items-center gap-2">
                        <input
                          type="checkbox"
                          className="border-[#008888] h-4 w-4"
                          // checked if this row's id exists in cvData.educations
                          checked={
                            includedIds.has(field.id) ||
                            cvData.educations.some(
                              (e: any) =>
                                e.id ===
                                (form.getValues(`educations.${index}.id`) ||
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

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                        <div className="text-sm font-medium">
                          {field.level === "Secondary School" ||
                          field.level === "Higher Secondary School"
                            ? "School"
                            : "College"}{" "}
                          entry
                        </div>
                        <div className="text-xs flex gap-1 items-center text-slate-500 break-all sm:truncate sm:max-w-[280px]">
                          {field.id} 
                          {isMongoId(field.id) && (field.verified?
                          <p className="flex items-center font-bold text-lg gap-1 text-[#008888]"> <CheckCircle size={18}/>Verified</p>
                          :field.isEmailSend?<p className="flex items-center text-lg font-bold gap-1 text-[#f14419]"><Clock size={18}/> Pending</p>:<p className="flex items-center text-lg font-bold gap-1 text-[#03257e]"><Clock size={18}/> Self Attested</p>)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <FormField
                          control={control}
                          name={`educations.${index}.selfAttested`}
                          render={() => (
                            <FormItem>
                              <FormControl>
                                <SelfAttestButton
                                  isAttested={
                                    form.watch(
                                      `educations.${index}.selfAttested`
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
                            disabled={field.verified || loading}
                            type="button"
                            onClick={() => updateHandler(index)}
                            className="mt-2 px-3 py-1 rounded border bg-[#006666] border-[#006666] text-white flex items-center shadow-lg gap-2 hover:bg-[#006666]/80 active:scale-[0.99] transition"
                          >
                            <Replace size={18} /> {loading&&idx===index?"Updating...":"Update"}
                          </Button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="mt-2 px-3 py-1 rounded border border-red-600 text-red-600 flex items-center shadow-lg gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                          >
                            <Trash2 size={18} /> Remove
                          </button>
                        )}
                        {isMongoId(field.id)&&<Button
                            disabled={field.verified || loading}
                            type="button"
                            onClick={() => deleteHandler(index)}
                            className="mt-2 px-3 py-1 rounded border bg-[#f14419] border-[#f14419] text-white flex items-center shadow-lg gap-2 hover:bg-[#f14419]/80 active:scale-[0.99] transition"
                          >
                            <Delete size={18} /> Delete
                          </Button>}
                        </div>
                      </div>
                    </div>

                    {/* Form body */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 w-full">
                      {/* Level - use Controller-like binding via setValue so RHF knows about change */}
                      <div>
                        <label className="text-black text-sm font-semibold pb-2">
                          Select your education level*
                        </label>
                        <select
                          value={field.level}
                          onChange={(e) =>
                            update(index, {
                              ...field,
                              level: e.target.value as
                                | "Secondary School"
                                | "Higher Secondary School"
                                | "Graduation"
                                | "PostGraduation"
                                | "Other",
                            })
                          }
                          className="border text-[#03257e] bg-gray-100 h-9 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#006666]"
                        >
                          <option value="Secondary School">
                            Secondary School
                          </option>
                          <option value="Higher Secondary School">
                            Higher Secondary School
                          </option>
                          <option value="Graduation">Graduation</option>
                          <option value="PostGraduation">PostGraduation</option>
                          <option value="Other">Other</option>
                        </select>
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
                                  classOrgId={`educations.${index}.${
                                    field.level === "Secondary School" ||
                                    field.level === "Higher Secondary School"
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
                                  placeholder={
                                    field.level === "Secondary School" ||
                                    field.level === "Higher Secondary School"
                                      ? "School Name"
                                      : "Degree(e.g. BTech,BSc.)"
                                  }
                                  className="w-full"
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
                                  <Percent className="text-[#006666] size-4" />
                                  {field.level === "Secondary School" ||
                                  field.level === "Higher Secondary School"
                                    ? "Percentage*"
                                    : "GPA*"}
                                </div>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={
                                    field.level === "Secondary School" ||
                                    field.level === "Higher Secondary School"
                                      ? "Percentage*"
                                      : "GPA*"
                                  }
                                  className="w-full"
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
                          <div className="relative border-t border-gray-300 my-2">
                            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm bg-white px-2">
                              OR
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start md:items-center">
                            {/* Upload / proof column */}
                            <FormField
                              control={form.control}
                              name={`educations.${index}.docUri`}
                              render={() => (
                                <FormItem className="flex-1">
                                  <FormLabel>
                                    <div className="flex items-start md:items-center gap-2">
                                      <Paperclip className="h-5 w-5 text-gray-700" />
                                      <div className="text-sm text-gray-700">
                                        Upload your document and enter issuer
                                        email id to send a email to the issuer
                                        for verification.<br></br>
                                        {/* <span className="text-[#03257e]">Note: Please ensure before enter the email id is correct and belong to the issuer </span> */}
                                      </div>
                                    </div>
                                  </FormLabel>

                                  <FormControl>
                                    {/* Styled drop area / button */}
                                    <div className="relative w-full p-1 bg-white">
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
                                        aria-label={`Upload proof for education ${
                                          index + 1
                                        }`}
                                      />

                                      {/* Visible content */}
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2">
                                        {form.getValues(
                                            `educations.${index}.docUri`
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

                                        {/* <div className="flex items-center gap-2">
                                          {form.getValues(
                                            `educations.${index}.docUri`
                                          ) && (
                                            <span className="text-green-600">
                                              File Uploaded
                                            </span>
                                          )}

                                          {selectedFileName && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                // clear file input visually — if you need to clear the actual input element value, you can
                                                // keep a ref to the input and set inputRef.current.value = ""
                                                setSelectedFileName(null);
                                                // optionally update form state to clear URL: form.setValue(`educations.${index}.proof`, "")
                                              }}
                                              className="text-sm px-3 py-1 rounded-md border border-transparent hover:bg-gray-100"
                                            >
                                              Clear
                                            </button>
                                          )}
                                        </div> */}
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
                                  {form.getValues(
                                    `educations.${index}.docUri`
                                  ) && (
                                    <a
                                      href={form.getValues(
                                        `educations.${index}.docUri`
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 flex w-32 justify-center items-center text-sm text-[#008888] rounded border border-[#008888] px-2 py-1 gap-1"
                                    >
                                      View proof{" "}
                                      <ExternalLink className="size-4" />
                                    </a>
                                  )}
                                </FormItem>
                              )}
                            />

                            {/* Issuer email + send button column */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                              <FormField
                                control={control}
                                name={`educations.${index}.issuerEmailId`}
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

                              {/* <Button
                              type="button"
                              onClick={() => emailHandler(index)}
                              className="whitespace-nowrap"
                            >
                              {loading ? (
                                <LoadingButton />
                              ) : (
                                "Send Email To Issuer"
                              )}
                            </Button> */}
                            </div>
                          </div>
                        </div>
                      )}
                      {getValues(`educations.${index}.docUri`) && getValues(`educations.${index}.verified`) && (
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
                    {loading
                      ? index === idx && (
                          <LoadingButton className="w-full bg-[#008888] mt-2 hover:bg-[#006666]" />
                        )
                      : !isMongoId(field.id) && (
                          <Button
                            type="button"
                            onClick={() => submitFormHandler(index)}
                            className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition"
                          >
                            Save
                          </Button>
                        )}
                  </div>
                );
              })}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addEducation("Secondary School")}
                  className="flex items-center gap-2 px-3 py-1 rounded border shadow-lg border-[#03257e] text-[#03257e]"
                >
                  <PlusCircle size={16} /> Add School
                </button>
                <button
                  type="button"
                  onClick={() => addEducation("Graduation")}
                  className="flex items-center gap-2 px-3 py-1 rounded border shadow-lg border-[#03257e] text-[#03257e]"
                >
                  <PlusCircle size={16} /> Add College
                </button>
              </div>
            </div>
          </StepCard>
        </form>
      </Form>
    </>
  );
};
