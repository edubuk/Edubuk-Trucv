import { useEffect, useState } from "react";
import { StepCard } from "./StepCard";
import {
  Briefcase,
  CheckCircle2,
  Github,
  Info,
  Linkedin,
  LockKeyhole,
  Mail,
  MapPin,
  PlusCircle,
  UploadCloud,
  User,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PersonalDetailsItem, personalDetailsSchema } from "./cvSchema";
import SelfAttestButton from "@/components/Buttons/SelfAttest";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/uploadFile";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
import { useUserData } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { ICvData } from "./CvBuilder";
import api from "@/lib/api";
import PhoneInput from "react-phone-input-2";

export interface IStepCard {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  uid: (prefix?: string) => string;
  docId: () => string;
  setCvData: React.Dispatch<React.SetStateAction<any>>;
  cvData: ICvData;
}

export const PersonalDetails = ({ step, setStep, setCvData }: IStepCard) => {
  const { user } = useUserData();
  const [customProfession, setCustomProfession] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [profession, setProfession] = useState<any>(user?.profession ?? "student");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form = useForm<PersonalDetailsItem>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      fullName: "",
      email: "",
      location: "",
      phoneNumber: "",
      yearOfExp: "",
      github: "",
      linkedin: "",
      imageUrl: "",
      profileSummary: "",
      selfAttested: false,
    },
  });

  useEffect(() => {
    if (!user) return;

    // Only reset if user hasn't edited the form yet
    if (!form.formState.isDirty) {
      console.log("user", user);
      form.reset({
        fullName: user.name ?? "",
        email: user.email ?? "",
        location: user.address ?? "",
        phoneNumber: user.phoneNumber ?? "",
        yearOfExp: user.yearOfExp ?? "",
        github: user.githubUrl ?? "",
        linkedin: user.linkedInUrl ?? "",
        imageUrl: user.userImageUrl ?? "",
        profileSummary: user.profileSummary ?? "",
        selfAttested: user.selfAttested ?? false,
      });
      setCvData((prev: any) => {
        return {
          ...prev,
          personal: {
            fullName: user.name ?? "",
            email: user.email ?? "",
            phone: user.phoneNumber ?? "",
            city: user.address ?? "",
            linkedin: user.linkedInUrl ?? "",
            github: user.githubUrl ?? "",
            summary: user.profileSummary ?? "",
            imgUrl: user.userImageUrl ?? "",
          },
        };
      });
    }
  }, [user, form, refresh]);

  // WATCH the selfAttested value so UI can reflect it
  const selfAttested = form.watch("selfAttested");

  // Proper image validation returns an object with isValid true/false
  const validateImageFile = (file?: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) return { isValid: false, error: "No file selected" };

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Invalid file type. Please upload JPG, JPEG, or PNG files only.",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File is too large. Max 5MB allowed.",
      };
    }

    return { isValid: true };
  };

  // Upload and write the remote image URL into the form's imageUrl field
  const uploadImageToDB = async (file: File | undefined) => {
    if (!file) return;
    setImageError("");
    setImagePreview("");
    setIsImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response: any = await uploadFile(formData);
      // adapt to your backend response shape
      if (response?.data?.success) {
        const url = response.data.url;
        setImagePreview(url);
        // IMPORTANT: write the uploaded URL into the form so validation/submission sees it
        form.setValue("imageUrl", url, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        // try to pick error message from response
        const err =
          response?.response?.data?.error ||
          response?.data?.error ||
          "Upload failed";
        setImageError(`Could not upload (${err})`);
      }
    } catch (err: any) {
      setImageError("Upload failed. Please try again.");
    } finally {
      setIsImageUploading(false);
    }
  };

  // On submit
  const submitFormHandler = async (data: PersonalDetailsItem) => {
    console.log("personal data", data);
    try {
      setSubmitting(true);
      const updateUser = await api.put(`/user/update-userInfo`, {
        name: data.fullName,
        phoneNumber: data.phoneNumber,
        address: data.location,
        userImageUrl: data.imageUrl,
        linkedInUrl: data.linkedin,
        githubUrl: data.github,
        selfAttested: data.selfAttested,
        yearOfExp: data.yearOfExp,
        profession: profession,
        profileSummary: data.profileSummary,
      });
      const res = await updateUser.data;
      console.log("res", res);
      if (res.success) {
        toast.success(res.message);
        setRefresh((prev) => !prev);
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.message || error || "something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const addCustomProfession = () => {
    if(!customProfession?.trim())
        return toast.error("No custom profession is provided")
    setProfession(customProfession?.trim() as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitFormHandler)}>
        <StepCard
          index={2}
          title="Personal Details"
          icon={User}
          open={step === 2}
          onToggle={() => setStep(step === 2 ? 0 : 2)}
        >
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-[#f5f9ff] to-[#f2fbf9] p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Your personal details
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  Keep the information shown on your CV clear and up to date.
                </p>
                {user?.updatedAt && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <CheckCircle2 className="size-3.5 text-[#008888]" />
                    Last updated {new Date(user.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="selfAttested"
                render={() => (
                  <FormItem className={`min-w-0 rounded-xl border p-3 lg:min-w-[360px] ${selfAttested ? "border-emerald-200 bg-emerald-50/80" : "border-amber-200 bg-amber-50/80"}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-white ${selfAttested ? "text-emerald-700" : "text-amber-700"}`}>
                        {selfAttested ? <CheckCircle2 className="size-5" /> : <LockKeyhole className="size-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {selfAttested ? "Details self-attested" : "Attestation required"}
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-slate-600">
                          Confirm that all information is accurate.
                        </p>
                        <FormMessage className="mt-1" />
                      </div>
                      <div className="shrink-0">
                        <SelfAttestButton
                          isAttested={!!selfAttested}
                          className="m-0 h-9 rounded-lg bg-white px-3 text-xs shadow-none"
                          onClick={() => {
                            form.setValue("selfAttested", true, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={() => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <label className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-[#008888] hover:bg-[#f2fbf9] focus-within:ring-2 focus-within:ring-[#008888]/30">
                          <input
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              const validation = validateImageFile(file);
                              if (!validation.isValid) {
                                setImageError(validation.error || "Invalid image");
                                event.currentTarget.value = "";
                                return;
                              }
                              uploadImageToDB(file);
                            }}
                          />
                          {imagePreview || user?.userImageUrl ? (
                            <div className="relative h-[220px] w-full">
                              <img
                                src={imagePreview || user?.userImageUrl}
                                alt="Profile preview"
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-slate-950/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                                Click to replace photo
                              </div>
                            </div>
                          ) : (
                            <div className="px-5">
                              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white text-[#03257e] shadow-sm ring-1 ring-slate-200">
                                <UploadCloud className="size-7" />
                              </div>
                              <p className="mt-4 text-sm font-semibold text-slate-800">Upload profile photo</p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">JPG or PNG, up to 5 MB</p>
                              <span className="mt-3 inline-flex rounded-lg bg-[#03257e] px-3 py-2 text-xs font-semibold text-white transition group-hover:bg-[#006666]">
                                Choose image
                              </span>
                            </div>
                          )}
                        </label>
                      </FormControl>
                      <FormMessage />
                      {imageError && <p className="text-xs font-medium text-red-600">{imageError}</p>}
                      {isImageUploading && <p className="text-xs font-medium text-[#006666]">Uploading your photo…</p>}
                    </FormItem>
                  )}
                />

                <div className="grid content-start gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">Full name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-none focus-visible:ring-[#008888]" placeholder="e.g. Aditi Sharma" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <label htmlFor="profession" className="text-xs font-semibold text-slate-700">Profession</label>
                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <select
                        id="profession"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className={`h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 text-sm outline-none transition focus:border-[#008888] focus:ring-1 focus:ring-[#008888] ${profession === "other" ? "text-amber-700" : "text-slate-800"}`}
                      >
                        <option value="student">Student</option>
                        <option value="employee">Employee</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="freelance">Freelance</option>
                        {customProfession && <option value={customProfession.trim()}>{customProfession}</option>}
                        {user?.profession && user.profession !== customProfession?.trim() && (
                          <option value={user.profession}>{user.profession}</option>
                        )}
                        <option value="other">Add another profession</option>
                      </select>
                    </div>
                    {profession === "other" && (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={customProfession ?? ""}
                          onChange={(e) => setCustomProfession(e.target.value)}
                          placeholder="Enter your profession"
                          className="h-10 rounded-xl border-slate-200 bg-white shadow-none focus-visible:ring-[#008888]"
                        />
                        <Button type="button" onClick={addCustomProfession} className="h-10 rounded-xl bg-slate-900 px-3 hover:bg-[#03257e]">
                          <PlusCircle className="mr-1.5 size-4" /> Add
                        </Button>
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="yearOfExp"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs font-semibold text-slate-700">Years of experience</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input type="text" placeholder="e.g. 3 years" className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-none focus-visible:ring-[#008888]" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">Email <LockKeyhole className="size-3 text-slate-400" /></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                          <Input type="email" placeholder="name@example.com" className="h-11 rounded-xl border-slate-200 bg-slate-100 pl-10 shadow-none" {...field} disabled />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">Phone number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country="in"
                          value={field.value}
                          onChange={(phone) => field.onChange(phone)}
                          placeholder="Phone number"
                          containerClass="!mt-0 !h-11 !w-full !rounded-xl !border !border-slate-200 !bg-slate-50 focus-within:!border-[#008888] focus-within:!ring-1 focus-within:!ring-[#008888]"
                          inputClass="!h-full !w-full !rounded-xl !border-0 !bg-transparent !pl-12 !text-sm !text-slate-800 !shadow-none !outline-none"
                          buttonClass="!rounded-l-xl !border-0 !border-r !border-slate-200 !bg-transparent !shadow-none"
                          dropdownClass="!text-black"
                          inputProps={{ name: "phone", required: true }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-semibold text-slate-700">Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                          <Input type="text" placeholder="City, state, country" className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-none focus-visible:ring-[#008888]" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">LinkedIn <span className="font-normal text-slate-400">(optional)</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Linkedin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#0a66c2]" />
                          <Input type="url" placeholder="https://linkedin.com/in/username" className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-none focus-visible:ring-[#008888]" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">GitHub <span className="font-normal text-slate-400">(optional)</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Github className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" />
                          <Input type="url" placeholder="https://github.com/username" className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-none focus-visible:ring-[#008888]" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileSummary"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Profile summary <span className="font-normal text-slate-400">(optional)</span></span>
                        <Info className="size-4 text-slate-400" />
                      </FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Summarize your experience, strengths, and career goals in a few sentences…" className="min-h-[120px] resize-y rounded-xl border-slate-200 bg-slate-50 px-3.5 py-3 leading-6 shadow-none focus-visible:ring-[#008888]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm font-semibold text-slate-900">Review and save</p>
                <p className="mt-0.5 text-xs text-slate-500">Make sure your details are correct before continuing.</p>
              </div>
              {!submitting ? (
                <Button type="submit" className="h-11 min-w-[180px] rounded-xl bg-[#03257e] px-6 font-semibold text-white shadow-sm hover:bg-[#006666]">
                  {user ? "Update personal details" : "Save personal details"}
                </Button>
              ) : (
                <LoadingButton className="h-11 min-w-[180px] rounded-xl bg-[#03257e]" />
              )}
            </div>
          </div>
        </StepCard>
      </form>
    </Form>
  );
};
