import { CheckCircle, FileText } from "lucide-react";
import { StepCard } from "./StepCard"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { IStepCard } from "./PersonalDetails";
import { ProfileSummaryItem, ProfileSummarySchema } from "./cvSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export const ProfileSummary = ({ step, setStep }: IStepCard) => {
    const [summaryAttested, setSummaryAttested] = useState(false);
    const form = useForm<ProfileSummaryItem>({
        resolver: zodResolver(ProfileSummarySchema),
        defaultValues: {
        },
    });
    return (
        <Form {...form}>
            <form>
                <StepCard index={7} title="Profile Summary" icon={FileText} open={step === 7} onToggle={() => setStep(step === 7 ? 0 : 7)}>
                    <p className="text-sm text-slate-500">Write a short profile summary that will appear at the top of your CV.</p>
                    <div className="mt-4">
                        <FormField
                            control={form.control}
                            name="profileSummary"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        <div className="flex items-center gap-1">
                                            <FileText className="text-[#006666] size-4" />
                                            Profile Summary
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your profile summary..."
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="mt-3 flex gap-3 items-center">
                            <button onClick={() => setSummaryAttested((s) => !s)} className="px-2 py-1 rounded border shadow-lg border-[#FB980E] text-[#FB980E] flex items-center gap-2"><CheckCircle size={16} /> {summaryAttested ? "Attested" : "Self attest"}</button>
                            <div className="text-sm text-slate-500">You can use this to indicate that your summary is self-attested.</div>
                        </div>
                        <Button type="submit" className="w-full bg-[#008888] mt-2 hover:bg-[#006666] transition">Save</Button>

                    </div>
                </StepCard>
            </form>
        </Form >
    )
}