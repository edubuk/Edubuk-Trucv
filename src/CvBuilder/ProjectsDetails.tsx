
import { StepCard } from "./StepCard"
import { Calendar, FileText, FolderOpenIcon, Link, PlusCircle, Trash2 } from "lucide-react"
import { ProjectFormValues,ProjectSchema } from "./cvSchema";

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

export const ProjectDetails = ({ step, setStep, uid }: IStepCard) => {
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            projects: [{
                id: uid("prj"),
                name: "",
                url: "",
                duration: { from: "", to: "" },
                description: "",
                selfAttested: false
            }]
        },
    });
    const { control,setValue} = form
    const { fields, append, remove } = useFieldArray({
        control,
        name: "projects",
        keyName: "rhfKey", // so we can use fields.map safely
    });

    function addProject(e: React.MouseEvent) {
        e.preventDefault();
        append(
            {
                id: uid("prj"),
                name: "",
                url: "",
                duration: { from: "", to: "" },
                description: "",
                selfAttested: false
            }
        );
    }

    const removeProject = (index:number)=>remove(index);

    function handleSelfAttest(index:number) {
        setValue(`projects.${index}.selfAttested`, true, { shouldValidate: true, shouldDirty: true })
    }

    return (
        <Form {...form}>
            <form>
                <StepCard index={5} title="Personal Projects" icon={FileText} open={step === 5} onToggle={() => setStep(step === 5 ? 0 : 5)}>
                    <p className="text-sm text-slate-500">Add projects. Make them stand out with URL and short description. Each item can be removed.</p>
                    <div className="mt-4 space-y-4">
                        {fields.map((p, index) => (
                            <>
                                <div className="flex justify-start items-center gap-2"><input type="checkbox" className="border-[#008888]" /><p className="text-[#008888]">Select to include this data in your resume</p></div>

                                <div key={p.id} className="border p-4 rounded bg-white">
                                    <div className="flex justify-end items-center gap-2">
                                        <FormField
                                            control={control}
                                            name={`projects.${index}.selfAttested`}
                                            render={() => (
                                                <FormItem>
                                                    <FormControl>
                                                        <SelfAttestButton
                                                            isAttested={form.watch(`projects.${index}.selfAttested`) as boolean}
                                                            onClick={() => handleSelfAttest(index)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeProject(index)}
                                            className="mt-2 px-3 py-1 rounded border border-red-600 text-red-600 flex items-center shadow-lg gap-2 hover:bg-red-50 active:scale-[0.99] transition"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                        <FormField
                                            control={control}
                                            name={`projects.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        <div className="flex items-center gap-1">
                                                            <FolderOpenIcon className="text-[#006666] size-4" />
                                                            Project Name
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
                                            name={`projects.${index}.url`}
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        <div className="flex items-center gap-1">
                                                            <Link className="text-[#006666] size-4" />
                                                            Project Url
                                                        </div>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Project Url"
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
                                            name={`projects.${index}.duration.from`}
                                            render={({ field: innerField }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="text-[#006666] size-4" />
                                                            From (eg. 10/11/2015)
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
                                            name={`projects.${index}.duration.to`}
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
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`projects.${index}.description`}
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
                                </div>
                            </>
                        ))}

                        <div>
                            <button onClick={addProject} className="flex items-center shadow-lg border-[#03257e] text-[#03257e] gap-2 px-3 py-1 rounded border"><PlusCircle size={16} /> Add Project</button>
                        </div>
                        <Button type="submit" className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition">Save</Button>

                    </div>
                </StepCard>
            </form>
        </Form>
    )
}