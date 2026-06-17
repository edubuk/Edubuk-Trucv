import { useEffect, useState } from "react";
import { StepCard } from "./StepCard";
import {
  Briefcase,
  Github,
  Image,
  Info,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Fill the information that will appear in your CV header.<br></br>
              <span className="text-[#f14419]">
                Last data updated{" "}
                {user?.updatedAt && new Date(user?.updatedAt).toLocaleString()}
              </span>
            </p>
            {/* Pass state and handler into SelfAttestButton so it changes RHF value */}
            <FormField
              control={form.control}
              name="selfAttested"
              render={() => (
                <FormItem className="col-span-1 md:col-span-2 flex items-center gap-3">
                  <div>
                    <SelfAttestButton
                      isAttested={!!selfAttested}
                      onClick={() => {
                        // toggle to true for your requirement; if you want toggle, use !field.value
                        form.setValue("selfAttested", true, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-1 text-sm">
              <label>Select Your Profession</label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value as any)}
                className={`border bg-gray-100 h-9 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#006666] ${
                  profession === "other" ? "text-red-500" : "text-[#03257e]"
                }`}
              >
                <option value="student">Student</option>
                <option value="employee">Employee</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="freelance">Freelance</option>
                {customProfession && (
                  <option value={customProfession?.trim()}>
                    {customProfession}
                  </option>
                )}
                {user?.profession && (
                  <option value={user.profession}>
                    {user.profession}
                  </option>
                )}
                <option value="other">Add Other Profession</option>
              </select>

              {profession === "other" && (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={customProfession}
                    onChange={(e: any) => setCustomProfession(e.target.value)}
                    placeholder="Enter your profession"
                    className="border text-[#000000] bg-gray-100 h-9 rounded w-full px-2 focus:outline-none focus:ring-1 focus:ring-[#000000]"
                  />
                  <button
                    type="button"
                    className="flex gap-1 items-center bg-[#000000] text-white px-2 py-1 rounded-lg hover:bg-[#005555]"
                    onClick={addCustomProfession}
                    >
                    <PlusCircle size={18}/>Add
                    </button>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <User className="text-[#006666] size-4" />
                      Full name
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <Mail className="text-[#006666] size-4" />
                      Email
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      {...field}
                      disabled
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
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <MapPin className="text-[#006666] size-4" />
                      Location
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your current location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <Phone className="text-[#006666] size-4" /> Phone number
                    </div>
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      country="in"
                      value={field.value}
                      onChange={(phone) => field.onChange(phone)}
                      placeholder="Phone Number"
                      // Outer wrapper styles (acts like your input's border + focus ring)
                      containerClass={`mt-2 w-full rounded-lg border px-0 focus-within:ring-2 ${
                        false
                          ? "border-red-200 focus-within:ring-red-300"
                          : "border-slate-200 focus-within:ring-[#03257e]"
                      }`}
                      inputClass="!w-full !bg-transparent !text-[#006666] !placeholder-slate-400 !pl-10 !py-2 !focus:outline-none !border-0 !shadow-none"
                      buttonClass="!border-0 !shadow-none"
                      dropdownClass="!text-black"
                      inputProps={{
                        name: "phone",
                        required: true,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <Linkedin className="text-[#0a66c2] size-4" />
                      LinkedIn Profile URL
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your linkedin url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <Github className="text-[#171515] size-4" />
                      Github Profile URL
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your github profile"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearOfExp"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <Briefcase className="text-[#171515] size-4" />
                      Year of Experience
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Year of Experience"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileSummary"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <Info className="text-[#171515] size-4" />
                      Profile Summary
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Profile Summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* imageUrl is stored as a string URL in the schema. We validate file locally and then upload and set imageUrl */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <Image className="text-[#171515] size-4" />
                      Upload Image
                    </div>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        const validation = validateImageFile(file);
                        if (!validation.isValid) {
                          alert(validation.error);
                          event.currentTarget.value = "";
                          return;
                        }
                        // Do not call field.onChange(file) because schema expects imageUrl string.
                        // Instead upload file and set the resulting URL into form.imageUrl
                        uploadImageToDB(file);
                      }}
                      className="block w-full"
                    />
                  </FormControl>
                  <FormMessage />
                  {imageError && (
                    <p className="text-sm text-red-500 font-semibold">
                      {imageError}
                    </p>
                  )}
                  {isImageUploading && (
                    <p className="text-sm text-green-500">
                      Uploading image please wait
                    </p>
                  )}
                  {(imagePreview || user?.userImageUrl) && (
                    <>
                      <img
                        src={imagePreview || user?.userImageUrl}
                        alt="previewImage"
                        loading="lazy"
                        className="h-48 w-cover object-cover rounded-lg shadow-lg"
                      />
                    </>
                  )}
                </FormItem>
              )}
            />
          </div>

          {!submitting ? (
            <Button
              type="submit"
              className="mt-2 text-white w-auto w-full bg-[#006666] hover:bg-[#008888] hover:opacity-90"
            >
              {user ? "Update" : "Save"}
            </Button>
          ) : (
            <LoadingButton className="mt-2 w-auto w-full bg-[#006666]" />
          )}
        </StepCard>
      </form>
    </Form>
  );
};
