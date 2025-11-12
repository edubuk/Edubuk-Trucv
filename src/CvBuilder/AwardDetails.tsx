import { useState } from "react";
import { StepCard } from "./StepCard"
import { Award, Badge, Building2, Calendar,ExternalLink,FileText, Paperclip, PlusCircle, Trash2 } from "lucide-react"
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
import { AwardFormValues,AwardSchema } from "./cvSchema";

import { IStepCard } from "./PersonalDetails";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SelfAttestButton from "@/components/Buttons/SelfAttest";
import { handleProofUploaded } from "./uploadProof";

export const AwardDetails = ({ step, setStep, uid }: IStepCard) => {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const form = useForm<AwardFormValues>({
        resolver: zodResolver(AwardSchema),
        defaultValues: {
            awards: [{
                id: uid("awd"),
                level:"Award",
                name: "",
                organisation: "",
                duration: { from: "", to: "" },
                proof:"",
                description: "",
                isEmailSend:false,
                selfAttested: false
            }]
        }
    });
    const { control,setValue,handleSubmit } = form;
    const { fields, append, remove,update} = useFieldArray({
        control,
        name: "awards",
        keyName: "rhfKey", // so we can use fields.map safely
    });
    function addAward(e: React.MouseEvent) {
        e.preventDefault();
        append({
            id: uid("awd"),
            level:"Award",
            name: "",
            organisation: "",
            duration: { from: "", to: "" },
            proof:"",
            description: "",
            isEmailSend:false,
            selfAttested: false
        })
    }


    const removeAward = (index: number) => remove(index);

    const handleSelfAttest = (index: number) => {
        setValue(`awards.${index}.selfAttested`,true,)
    }
    const formSubmitHandler = (data:AwardFormValues)=>{
        console.log("form submit",data)
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(formSubmitHandler)}>
                <StepCard index={6} title="Certificates/Courses/Awards" icon={Award} open={step === 6} onToggle={() => setStep(step === 6 ? 0 : 6)}>
                    <p className="text-sm text-slate-500">Add projects. Make them stand out with URL and short description. Each item can be removed.</p>
                    <div className="mt-4 space-y-4">
                        {fields.map((a,index) => (
                            <>
                                <div className="flex justify-start items-center gap-2"><input type="checkbox" className="border-[#008888]" /><p className="text-[#008888]">Select to include this data in your resume</p></div>
                                <div key={a.id} className="border p-4 rounded bg-white">
                                    <div className="flex justify-between flex-wrap items-center">
                                        <div className="text-sm font-medium text-[#03257e]">{a.level} Entry</div>
                                        <div className="flex gap-1">
                                        <FormField
                                            control={control}
                                            name={`awards.${index}.selfAttested`}
                                            render={() => (
                                                <FormItem>
                                                    <FormControl>
                                                        <SelfAttestButton
                                                            isAttested={form.watch(`awards.${index}.selfAttested`) as boolean}
                                                            onClick={() => handleSelfAttest(index)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAward(index)}
                                            className="mt-2 px-3 py-1 rounded border border-red-600 text-red-600 flex items-center shadow-lg gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                        <div>
                                            <label className="">Select your relevant field</label>
                                            <select
                                                value={a.level}
                                                onChange={(e) => update(index, { ...a, level: e.target.value as "Award" | "Certificate" | "Course" })}
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
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        <div className="flex items-center gap-1">
                                                            <Badge className="text-[#006666] size-4" />
                                                            {a.level}
                                                        </div>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
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
                                                            Organisation
                                                        </div>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
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
                                            render={({ field: innerField }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="text-[#006666] size-4" />
                                                            {a.level==="Course"?"From (eg. 10/11/2015):":"Date of achievement"}
                                                        </div>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...innerField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                           )}
                                       />
                                       {a.level==="Course" && (
                                       <FormField
                                           control={control}
                                           name={`awards.${index}.duration.to`}
                                           render={({ field: innerField }) => (
                                               <FormItem className="w-full">
                                                   <FormLabel>
                                                       <div className="flex items-center gap-1">
                                                           <Calendar className="text-[#006666] size-4" />
                                                           To (eg. 10/11/2018)
                                                       </div>
                                                   </FormLabel>
                                                   <FormControl>
                                                       <Input type="date" {...innerField} />
                                                   </FormControl>
                                                   <FormMessage />
                                               </FormItem>
                                           )}
                                       />)}
                                        <FormField
                                            control={control}
                                            name={`awards.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="text-[#006666] size-4" />
                                                            Description
                                                        </div>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Description"
                                                            className="w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start md:items-center mt-1">
                                        {/* Upload / proof column */}
                                        <FormField
                                            control={control}
                                            name={`awards.${index}.proof`}
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
                                                            className="relative w-full bg-white"
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
                                                                            setValue(`awards.${index}.proof`, url, {
                                                                                shouldValidate: true,
                                                                                shouldDirty: true,
                                                                            });
                                                                        }}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                aria-label={`Upload proof for experience ${index + 1}`}
                                                            />

                                                            {/* Visible content */}
                                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-[#FB980E]">
                                                                        <Paperclip className="h-4 w-4 text-[#171515]" />
                                                                        <span className="text-sm text-gray-800">{selectedFileName ?? "Upload File"}</span>
                                                                    </div>
                                                                    <p className="text-start text-[#f14419] text-sm">Accepted: .jpg .jpeg .png .pdf — max 5MB</p>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    {form.getValues(`awards.${index}.proof`)&&<span className="text-green-600">File Uploaded</span>}

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
                                                    {form.getValues(`awards.${index}.proof`) && (
                                                        <a
                                                            href={form.getValues(`awards.${index}.proof`)}
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
                                                name={`awards.${index}.issuerEmail`}
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
                            </>
                        ))}

                        <div>
                            <button onClick={addAward} className="flex items-center shadow-lg border-[#03257e] text-[#03257e] gap-2 px-3 py-1 rounded border"><PlusCircle size={16} /> Add Award/Certificate</button>
                        </div>
                        <Button type="submit" className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition">Save</Button>

                    </div>
                </StepCard>
            </form>
        </Form>
    )
}