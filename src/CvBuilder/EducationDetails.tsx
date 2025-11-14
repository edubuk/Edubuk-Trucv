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
import { PlusCircle, Trash2, Calendar, Building, School, Percent, GraduationCap, BookOpenCheck, Paperclip, ExternalLink, BookOpen, Replace } from "lucide-react";
import { StepCard } from "./StepCard";
// import { uploadFile } from "@/uploadFile";
import { DropDown } from "@/components/ui/dropdown";
import { handleProofUploaded } from "./uploadProof";
import DigiLockerTest from "@/components/DigiLocker/DigiLockerPullTest";
import { API_BASE_URL } from "@/main";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
import { useUserData } from "@/context/AuthContext";
import { isMongoId } from "@/lib/utils";

export const EducationDetails = ({ step, setStep, uid,docId }: { step: number; setStep: any; uid: (p?: string) => string;docId:()=>string}) => {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [digiLockerConnected, setDigilockerConnected] = useState<boolean>(false);
    const { user } = useUserData();
    const [loading, setLoading] = useState<boolean>(false);
    const [openDigiLocker, setOpenDigiLocker] = useState<boolean>(false);
    const form = useForm<EducationFormValues>({
        resolver: zodResolver(EducationSchema),
        defaultValues: {
            educations: [
                {
                    id: uid("edu"),
                    eduDocId:docId(),
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

    const { control, handleSubmit, setValue, formState, getValues } = form;
    const { errors } = formState;
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "educations",
        keyName: "rhfKey", // so we can use fields.map safely
    });

    // local UI state for proof dialog/upload (example)
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);


    const submitFormHandler = async (data: EducationFormValues) => {
        console.log("error", errors)
        console.log("form submit", data.educations);
        try {
            setLoading(true);
            const payload = { data: data.educations };
            const result = await fetch(`${API_BASE_URL}/doc/save-doc`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const res = await result.json();
            if (!res.success) {
                toast.error(res.message);
                setLoading(false);
                return;
            }
            toast.success(res.message);
            setLoading(false);
        } catch (error: any) {
            toast.error(error.message ?? error ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const addEducation = (level: "Secondary School" | "Higher Secondary School" | "Graduation" | "PostGraduation" | "Other") => {
        append({
            id: uid("edu"),
            eduDocId:docId(),
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
        setValue(`educations.${index}.selfAttested`, true, { shouldValidate: true, shouldDirty: true });
    };

    const emailHandler = async (index: number) => {
        try {
            const emailId = getValues(`educations.${index}.issuerEmailId`);
            const applicantName = user?.name;
            const documentName = getValues(`educations.${index}.level`);
            const documentType = getValues(`educations.${index}.boardNameOrDegree`);
            const documentViewUrl = getValues(`educations.${index}.docUri`);

            if (!emailId || !documentViewUrl || !documentName || !documentType)
                return toast.error("Please fill first above all the input fields");
            setLoading(true);
            const result = await fetch(`${API_BASE_URL}/doc/email-issuer`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    emailId: emailId,
                    documentViewUrl: documentViewUrl,
                    documentName: documentName,
                    documentType: documentType,
                    applicantName: applicantName
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await result.json();
            if (!data.success) {
                toast.error(data.message);
                setLoading(false);
            }

            if (data.status === "Succeeded") {
                toast.success(`${data.message} to entered email id`)
                setLoading(false);

            }
        } catch (error: any) {
            toast.error(error.message ?? error ?? "something went wrong")
        } finally {
            setLoading(false);
        }
    }

    const fetchEducationsDocs = async () => {
        try {
            const data = await fetch(`${API_BASE_URL}/doc/education-docs`, {
                method: "GET",
                credentials: "include",
            })
            const res = await data.json();
            console.log("data", res);
            if (res.success) {
                    const educations = res.documents.map((doc: any) => ({
                        id: doc._id ?? uid("edu"), // ensure unique id for RHF key
                        eduDocId:"as23jhhdjcie83bndn",
                        level: doc.level ?? "",
                        boardNameOrDegree: doc.boardNameOrDegree ?? "",
                        institutionName: doc.institutionName ?? "",
                        gpa: doc.gpa ?? "",
                        duration: {
                            from: doc.duration?.from ?? "",
                            to: doc.duration?.to ?? "",
                        },
                        selfAttested: doc.selfAttested ?? false,
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
    }

    useEffect(() => {
        fetchEducationsDocs();
    }, [step === 2])

    const updateHandler = async(index:number)=>{
        try {
            const payload = getValues(`educations.${index}`);
            console.log("payload",payload);
            const data = await fetch(`${API_BASE_URL}/doc/update-doc/${payload.id}`,{
                method:"PUT",
                credentials:"include",
                body:JSON.stringify({data:payload}),
                headers:{
                    "Content-Type":"application/json"
                }
            })
            const res = await data.json();
            if(!res.success){
                toast.error(res.message);
                return;
            }
            toast.success(res.message);
        } catch (error) {
            toast.error("something went wrong");
        }
    }


    return (
        <>
            <Form {...form}>
                {/* noValidate disables native browser popup validation */}
                <form noValidate onSubmit={handleSubmit(submitFormHandler)}>
                    <StepCard index={2} title="Educational Details" icon={BookOpen} open={step === 2} onToggle={() => setStep(step === 2 ? 0 : 2)}>
                        <p className="text-sm text-slate-500">Add education entries. Choose school or college. Each entry can be self-attested and have proof uploaded.</p>

                        <div className="mt-4 space-y-4">
                            {fields.map((field, index) => {
                                // Use field values if you need quick read-only access:
                                //const levelPath = `educations.${index}.level` as const;

                                return (
                                    <div key={field.rhfKey} className="border p-4 md:p-6 rounded-xl bg-white shadow-sm">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                                                <div className="text-sm font-medium">{(field.level === "Secondary School" || field.level === "Higher Secondary School") ? "School" : "College"} entry</div>
                                                <div className="text-xs text-slate-500 break-all sm:truncate sm:max-w-[280px]">{field.id}</div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FormField
                                                    control={control}
                                                    name={`educations.${index}.selfAttested`}
                                                    render={() => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <SelfAttestButton
                                                                    isAttested={form.watch(`educations.${index}.selfAttested`) as boolean}
                                                                    onClick={() => handleSelfAttest(index)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {isMongoId(field.id)? <button
                                                    type="button"
                                                    onClick={()=>updateHandler(index)}
                                                    className="mt-2 px-3 py-1 rounded border border-green-600 text-green-600 flex items-center shadow-lg gap-2 hover:bg-green-600/10 active:scale-[0.99] transition"
                                                >
                                                    <Replace size={14} /> Update
                                                </button>:
                                                <button
                                                    type="button"
                                                    onClick={() => removeEducation(index)}
                                                    className="mt-2 px-3 py-1 rounded border border-red-600 text-red-600 flex items-center shadow-lg gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                                                >
                                                    <Trash2 size={14} /> Remove
                                                </button>}
                                            </div>
                                        </div>

                                        {/* Form body */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 w-full">
                                            {/* Level - use Controller-like binding via setValue so RHF knows about change */}
                                            <div>
                                                <label className="text-black text-sm font-semibold pb-2">Select your education level</label>
                                                <select
                                                    value={field.level}
                                                    onChange={(e) => update(index, { ...field, level: e.target.value as "Secondary School" | "Higher Secondary School" | "Graduation" | "PostGraduation" | "Other" })}
                                                    className="border text-[#03257e] bg-gray-100 h-9 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#006666]"
                                                >
                                                    <option value="Secondary School">Secondary School</option>
                                                    <option value="Higher Secondary School">Higher Secondary School</option>
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
                                                                    Start date
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="date" placeholder="YYYY" {...innerField} />
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
                                                                    End date
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="date" placeholder="YYYY" {...innerField} />
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
                                                    name={`educations.${index}.${(field.level === "Secondary School" || field.level === "Higher Secondary School") ? "boardNameOrDegree" : "institutionName"}`}
                                                    render={({ field: f }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                <div className="flex items-center gap-1">
                                                                    <Building className="text-[#006666] size-4" />
                                                                    {field.level === "Secondary School" || field.level === "Higher Secondary School" ? "Board Name (e.g. CBSE/ICSE)" : "Institute Name"}
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                {/* <Input placeholder="Board name" className="w-full" {...f} /> */}
                                                                <DropDown
                                                                    classOrgId={`educations.${index}.${(field.level === "Secondary School" || field.level === "Higher Secondary School") ? "boardNameOrDegree" : "institutionName"}`}
                                                                    options={[
                                                                        { orgId: "", name: "Indian Council of Secondary Education(ICSE)" },
                                                                        { orgId: "000027", name: "Central Board of Secondary Education(CBSE)" },
                                                                        { orgId: "001925", name: "UP State Board of High School and Intermediate Education" },
                                                                    ]}
                                                                    {...f}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={control}
                                                    name={`educations.${index}.${(field.level === "Secondary School" || field.level === "Higher Secondary School") ? "institutionName" : "boardNameOrDegree"}`}
                                                    render={({ field: f }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                <div className="flex items-center gap-1">
                                                                    <School className="text-[#006666] size-4" />
                                                                    {field.level === "Secondary School" || field.level === "Higher Secondary School" ? "Institution Name" : "Degree(e.g. BTech,BSc.)"}
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder={field.level === "Secondary School" || field.level === "Higher Secondary School" ? "School Name" : "Degree(e.g. BTech,BSc.)"} className="w-full" {...f} />
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
                                                                    {field.level === "Secondary School" || field.level === "Higher Secondary School" ? "Percentage" : "GPA"}
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Percentage" className="w-full" {...f} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Proof Upload & DigiLocker area (single row UI) */}
                                            <div className="sm:col-span-2 mt-3 w-full rounded-xl p-2 sm:p-4 bg-white border">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                        <label className="text-sm font-medium text-gray-700">
                                                            Get your document from <span className="text-[#6334FA] font-semibold">DigiLocker</span> (Recommended)
                                                        </label>
                                                        <button type="button" onClick={() => setOpenDigiLocker(true)} className="border border-[#6334FA] rounded-lg p-1.5 hover:bg-[#6334FA]/10 transition flex items-center justify-center">
                                                            <img className="h-8 w-28 object-contain" src={DigilockerImg} alt="digilocker" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="relative border-t border-gray-300 my-2">
                                                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm bg-white px-2">OR</p>
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
                                                                            Upload your document and send an email to the issuer for verification.
                                                                        </div>
                                                                    </div>
                                                                </FormLabel>

                                                                <FormControl>
                                                                    {/* Styled drop area / button */}
                                                                    <div
                                                                        className="relative w-full p-1 bg-white"
                                                                    >
                                                                        <input
                                                                            id={`proof-file-${index}`}
                                                                            type="file"
                                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                                            onChange={async (event) => {
                                                                                const file = event.target.files?.[0];
                                                                                if (!file) return;
                                                                                setSelectedFileName(file.name);
                                                                                const url = await handleProofUploaded({ file, setIsUploading, setUploadError, setSelectedFileName });
                                                                                setValue(`educations.${index}.docUri`, url, {
                                                                                    shouldValidate: true,
                                                                                    shouldDirty: true,
                                                                                });
                                                                            }}
                                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                            aria-label={`Upload proof for education ${index + 1}`}
                                                                        />

                                                                        {/* Visible content */}
                                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2">
                                                                            <div className="flex flex-col gap-2">
                                                                                <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-[#FB980E]">
                                                                                    <Paperclip className="h-4 w-4 text-[#171515]" />
                                                                                    <span className="text-sm text-gray-800">{selectedFileName ?? "Upload File"}</span>
                                                                                </div>
                                                                                <p className="text-xs text-[#f14419]">Accepted:.jpg .jpeg .png .pdf — max 5MB</p>

                                                                                {/* {!form.getValues(`educations.${index}.proof`) && <div className="text-xs text-[#f14419]">
                                                                                Accepted: .jpg .jpeg .png .pdf — max 5MB
                                                                            </div>} */}
                                                                            </div>

                                                                            <div className="flex items-center gap-2">
                                                                                {form.getValues(`educations.${index}.docUri`) && <span className="text-green-600">File Uploaded</span>}

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
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </FormControl>

                                                                <FormMessage />

                                                                {/* upload / error states already in your codebase */}
                                                                {uploadError && (
                                                                    <p className="mt-2 text-sm text-red-600 font-medium">{uploadError}</p>
                                                                )}
                                                                {isUploading && (
                                                                    <p className="mt-2 text-sm text-green-600">Uploading document — please wait…</p>
                                                                )}

                                                                {/* If you have a stored URL in the form value, show a preview link */}
                                                                {form.getValues(`educations.${index}.docUri`) && (
                                                                    <a
                                                                        href={form.getValues(`educations.${index}.docUri`)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="mt-3 flex w-32 justify-center items-center text-sm text-[#008888] rounded border border-[#008888] px-2 py-1 gap-1"
                                                                    >
                                                                        View proof {" "}<ExternalLink className="size-4" />
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

                                                        <Button
                                                            type="button"
                                                            onClick={() => emailHandler(index)}
                                                            className="whitespace-nowrap"
                                                        >
                                                            {loading ? <LoadingButton /> : "Send Email To Issuer"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            {openDigiLocker && <DigiLockerTest setDigilockerConnected={setDigilockerConnected} setOpenDigiLocker={setOpenDigiLocker} openDigiLocker={openDigiLocker} field="class10" />}

                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex gap-2">
                                <button type="button" onClick={() => addEducation("Secondary School")} className="flex items-center gap-2 px-3 py-1 rounded border shadow-lg border-[#03257e] text-[#03257e]">
                                    <PlusCircle size={16} /> Add School
                                </button>
                                <button type="button" onClick={() => addEducation("Graduation")} className="flex items-center gap-2 px-3 py-1 rounded border shadow-lg border-[#03257e] text-[#03257e]">
                                    <PlusCircle size={16} /> Add College
                                </button>
                            </div>

                            {loading ? <LoadingButton /> : <Button type="submit" className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition">Save</Button>}
                        </div>
                    </StepCard>
                </form>
            </Form>
        </>
    );
};
