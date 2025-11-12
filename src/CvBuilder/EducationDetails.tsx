import { useState } from "react";
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
import { PlusCircle, Trash2, Calendar, Building, School, Percent, GraduationCap, BookOpenCheck, Paperclip, ExternalLink, BookOpen } from "lucide-react";
import { StepCard } from "./StepCard";
// import { uploadFile } from "@/uploadFile";
import { DropDown } from "@/components/ui/dropdown";
import { handleProofUploaded } from "./uploadProof";

export const EducationDetails = ({ step, setStep, uid }: { step: number; setStep: any; uid: (p?: string) => string }) => {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const form = useForm<EducationFormValues>({
        resolver: zodResolver(EducationSchema),
        defaultValues: {
            educations: [
                {
                    id: uid("edu"),
                    level: "school",
                    board: "",
                    schoolName: "",
                    collegeName: "",
                    status: "pending",
                    verifiedThrough: "",
                    degree: "",
                    percentage: "",
                    verified: false,
                    isEmailSend: false,
                    gpa: "",
                    duration: { startDate: "", endDate: "" },
                    proof: "",
                    selfAttested: false,
                },
            ],
        },
    });

    const { control, handleSubmit, setValue, formState } = form;
    const { errors } = formState;
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "educations",
        keyName: "rhfKey", // so we can use fields.map safely
    });

    // local UI state for proof dialog/upload (example)
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);


    const submitFormHandler = (data: EducationFormValues) => {
        console.log("error", errors)
        console.log("form submit", data);
    };

    const addEducation = (level: "school" | "college") => {
        append({
            id: uid("edu"),
            level,
            board: "",
            schoolName: "",
            collegeName: "",
            degree: "",
            percentage: "",
            status: "pending",
            gpa: "",
            duration: { startDate: "", endDate: "" },
            proof: "",
            selfAttested: false,
        });
    };

    const removeEducation = (index: number) => remove(index);

    // Sample handler: after you upload proof (returning a docUri string), set it into the array item


    // Self attest toggle for a specific index
    const handleSelfAttest = (index: number) => {
        setValue(`educations.${index}.selfAttested`, true, { shouldValidate: true, shouldDirty: true });
    };


    return (
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
                                            <div className="text-sm font-medium">{field.level === "school" ? "School" : "College"} entry</div>
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
                                            <button
                                                type="button"
                                                onClick={() => removeEducation(index)}
                                                className="mt-2 px-3 py-1 rounded border border-red-600 text-red-600 flex items-center shadow-lg gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Form body */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 w-full">
                                        {/* Level - use Controller-like binding via setValue so RHF knows about change */}
                                        <div>
                                            <label className="sr-only">Level</label>
                                            <select
                                                value={field.level}
                                                onChange={(e) => update(index, { ...field, level: e.target.value as "school" | "college" })}
                                                className="mt-6 border text-[#03257e] bg-gray-100 h-9 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#006666]"
                                            >
                                                <option value="school">School</option>
                                                <option value="college">College</option>
                                            </select>
                                        </div>

                                        {/* Duration: startDate & endDate */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <FormField
                                                control={control}
                                                name={`educations.${index}.duration.startDate`}
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
                                                name={`educations.${index}.duration.endDate`}
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
                                        {field.level === "school" ? (
                                            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1">
                                                <FormField
                                                    control={control}
                                                    name={`educations.${index}.board`}
                                                    render={({ field: f }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                <div className="flex items-center gap-1">
                                                                    <Building className="text-[#006666] size-4" />
                                                                    Board Name (e.g. CBSE/ICSE)
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                {/* <Input placeholder="Board name" className="w-full" {...f} /> */}
                                                                <DropDown
                                                                    classOrgId={`educations.${index}.schoolName`}
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
                                                    name={`educations.${index}.schoolName`}
                                                    render={({ field: f }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                <div className="flex items-center gap-1">
                                                                    <School className="text-[#006666] size-4" />
                                                                    School Name
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="School name" className="w-full" {...f} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={control}
                                                    name={`educations.${index}.percentage`}
                                                    render={({ field: f }) => (
                                                        <FormItem className="w-full sm:col-span-2">
                                                            <FormLabel>
                                                                <div className="flex items-center gap-1">
                                                                    <Percent className="text-[#006666] size-4" />
                                                                    Percentage
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
                                        ) : (
                                            // College fields
                                            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1">
                                                <FormField
                                                    control={control}
                                                    name={`educations.${index}.collegeName`}
                                                    render={({ field: f }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                <div className="flex items-center gap-1">
                                                                    <School className="text-[#006666] size-4" />
                                                                    College Name
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <DropDown
                                                                    classOrgId={`educations.${index}.collegeName`}
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
                                                    name={`educations.${index}.degree`}
                                                    render={({ field: f }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                <div className="flex items-center gap-1">
                                                                    <GraduationCap className="text-[#006666] size-4" />
                                                                    Degree (e.g. BTech/BSc.)
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Degree" className="w-full" {...f} />
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
                                                                    <BookOpenCheck className="text-[#006666] size-4" />
                                                                    GPA
                                                                </div>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="GPA" className="w-full" {...f} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}

                                        {/* Proof Upload & DigiLocker area (single row UI) */}
                                        <div className="sm:col-span-2 mt-3 w-full rounded-xl p-2 sm:p-4 bg-white border">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Get your document from <span className="text-[#6334FA] font-semibold">DigiLocker</span> (Recommended)
                                                    </label>
                                                    <button className="border border-[#6334FA] rounded-lg p-1.5 hover:bg-[#6334FA]/10 transition flex items-center justify-center">
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
                                                    name={`educations.${index}.proof`}
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
                                                                        onChange={async(event) => {
                                                                            const file = event.target.files?.[0];
                                                                            if (!file) return;
                                                                            setSelectedFileName(file.name);
                                                                            const url = await handleProofUploaded({file, setIsUploading, setUploadError, setSelectedFileName });
                                                                            setValue(`educations.${index}.proof`, url, {
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
                                                                            {form.getValues(`educations.${index}.proof`)&&<span className="text-green-600">File Uploaded</span>}

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
                                                            {form.getValues(`educations.${index}.proof`) && (
                                                                <a
                                                                    href={form.getValues(`educations.${index}.proof`)}
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
                                                        name={`educations.${index}.issuerEmail`}
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
                                                        onClick={() => {
                                                            // call your email send routine. don't call on render:
                                                            // sendIssuerEmail(index, form.getValues(`educations.${index}.issuerEmail`))
                                                        }}
                                                        className="whitespace-nowrap"
                                                    >
                                                        Send Email To Issuer
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex gap-2">
                            <button type="button" onClick={() => addEducation("school")} className="flex items-center gap-2 px-3 py-1 rounded border shadow-lg border-[#03257e] text-[#03257e]">
                                <PlusCircle size={16} /> Add School
                            </button>
                            <button type="button" onClick={() => addEducation("college")} className="flex items-center gap-2 px-3 py-1 rounded border shadow-lg border-[#03257e] text-[#03257e]">
                                <PlusCircle size={16} /> Add College
                            </button>
                        </div>

                        <Button type="submit" className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition">Save</Button>
                    </div>
                </StepCard>
            </form>
        </Form>
    );
};
