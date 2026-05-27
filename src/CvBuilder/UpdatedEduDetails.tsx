import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  Paperclip,
  Replace,
  School,
  Trash2,
} from "lucide-react";

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

import {
  EducationFormValues,
  EducationSchema,
} from "./cvSchema";

import { StepCard } from "./StepCard";

import { handleProofUploaded } from "./uploadProof";

import DigiLockerTest from "@/components/DigiLocker/DigiLockerPullTest";

import toast from "react-hot-toast";

import LoadingButton from "@/components/LoadingButton";

import { isMongoId } from "@/lib/utils";

import { ICvData } from "./CvBuilder";

import api from "@/lib/api";

import StatusBadge from "./StatusBadge";

import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";

import { DropDown } from "@/components/ui/dropdown";

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
];

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
  const [refresh, setRefresh] = useState(true);

  const [idx, setIdx] = useState<number>();

  const [loadingState, setLoadingState] = useState<
    "Updating" | "Deleting" | "Submitting" | null
  >(null);

  const [openDigiLocker, setOpenDigiLocker] =
    useState(false);

  const [expandedCard, setExpandedCard] =
    useState<number | null>(null);

  const [expandedVerification, setExpandedVerification] =
    useState<number | null>(null);

  const [selectedFileName, setSelectedFileName] =
    useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [uploadError, setUploadError] =
    useState<string | null>(null);

  const [customLevel, setCustomLevel] =
    useState<string>("");

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(EducationSchema),
    defaultValues: {
      educations: [],
    },
  });

  const { control, setValue, getValues } = form;

  const { fields, append, remove, update } =
    useFieldArray({
      control,
      name: "educations",
      keyName: "rhfKey",
    });

  const includedIds = useMemo(
    () => new Set(cvData.educations.map((e: any) => e.id)),
    [cvData.educations],
  );

  const fetchEducationsDocs = async () => {
    try {
      const data = await api.get(`/doc/education-docs`);

      const res = await data.data;

      if (res.success) {
        const educations = res.documents.map((doc: any) => ({
          id: doc._id ?? uid("edu"),
          eduDocId: "edu-doc",
          level: doc.level ?? "",
          boardNameOrDegree:
            doc.boardNameOrDegree ?? "",
          institutionName:
            doc.institutionName ?? "",
          gpa: doc.gpa ?? "",
          duration: {
            from: doc.duration?.from ?? "",
            to: doc.duration?.to ?? "",
          },
          selfAttested:
            doc.selfAttested ?? false,
          docUri: doc.docUri ?? "",
          orgId: doc.orgId ?? "",
          issuerEmailId:
            doc.issuerEmailId ?? "",
          isEmailSend:
            doc.isEmailSend ?? false,
          verified: doc.verified ?? false,
          status: doc.status ?? "pending",
        }));

        form.reset({ educations });

        cvData.educations = educations;
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setRefresh(false);
    }
  };

  useEffect(() => {
    fetchEducationsDocs();
  }, [refresh]);

  const addEducation = (
    level:
      | "Secondary School"
      | "Higher Secondary School"
      | "Graduation"
      | "PostGraduation",
  ) => {
    append({
      id: uid("edu"),
      eduDocId: docId(),
      level,
      boardNameOrDegree: "",
      institutionName: "",
      gpa: "",
      duration: {
        from: "",
        to: "",
      },
      selfAttested: false,
      isEmailSend: false,
      verified: false,
      status: "pending",
    });

    setExpandedCard(fields.length);
  };

  const removeEducation = (index: number) => {
    remove(index);
  };

  const handleSelfAttest = (index: number) => {
    setValue(
      `educations.${index}.selfAttested`,
      true,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const submitFormHandler = async (
    index: number,
  ) => {
    const isValid = await form.trigger(
      `educations.${index}`,
    );

    if (!isValid) return;

    try {
      setIdx(index);

      setLoadingState("Submitting");

      const payload = getValues(
        `educations.${index}`,
      );

      const { data } = await api.post(
        `/doc/save-eduDoc`,
        {
          data: payload,
        },
      );

      if (!data.success) {
        toast.error(data.message);

        return;
      }

      toast.success(data.message);

      setRefresh((prev) => !prev);
    } catch (error: any) {
      toast.error(
        error.message ?? "Something went wrong",
      );
    } finally {
      setLoadingState(null);
    }
  };

  const updateHandler = async (
    index: number,
  ) => {
    const isValid = await form.trigger(
      `educations.${index}`,
    );

    if (!isValid) return;

    try {
      setIdx(index);

      setLoadingState("Updating");

      const payload = getValues(
        `educations.${index}`,
      );

      const data = await api.put(
        `/doc/update-eduDoc/${payload.id}`,
        {
          data: payload,
        },
      );

      const res = await data.data;

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      toast.success(res.message);

      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingState(null);
    }
  };

  const deleteHandler = async (
    index: number,
  ) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this education record?",
      );

      if (!confirmDelete) return;

      setIdx(index);

      setLoadingState("Deleting");

      const payload = getValues(
        `educations.${index}`,
      );

      const res = await api.delete(
        `/doc/delete-eduDoc/${payload.id}`,
      );

      if (!res.data.success) {
        toast.error(res.data.message);

        return;
      }

      toast.success(res.data.message);

      setRefresh((prev) => !prev);
    } catch (error: any) {
      toast.error(
        error.message ?? "Something went wrong",
      );
    } finally {
      setLoadingState(null);
    }
  };

  const uploadDocHandler = async (
    file: File,
    index: number,
  ) => {
    if (!file) return;

    try {
      setSelectedFileName(file.name);

      const uploadRes = await handleProofUploaded({
        file,
        setIsUploading,
        setUploadError,
        setSelectedFileName,
      });

      if (!uploadRes) return;

      const { url, docHash } = uploadRes;

      setValue(
        `educations.${index}.docUri`,
        url,
      );

      setValue(
        `educations.${index}.docHash`,
        docHash,
      );
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setSelectedFileName(null);

      setIsUploading(false);
    }
  };

  function buildEducationPayload(index: number) {
    const row =
      getValues(`educations.${index}`) || {};

    const id = row.id || uid("edu");

    return {
      ...row,
      id,
    };
  }

  function handleToggleInclude(index: number) {
    const payload = buildEducationPayload(index);

    setCvData((prev: any) => {
      const exists = prev.educations.some(
        (e: any) => e.id === payload.id,
      );

      if (exists) {
        return {
          ...prev,
          educations:
            prev.educations.filter(
              (e: any) => e.id !== payload.id,
            ),
        };
      }

      return {
        ...prev,
        educations: [
          ...prev.educations,
          payload,
        ],
      };
    });
  }

  return (
    <Form {...form}>
      <form noValidate>
        <StepCard
          index={3}
          title="Educational Details"
          icon={BookOpen}
          open={step === 3}
          onToggle={() =>
            setStep(step === 3 ? 0 : 3)
          }
        >
          <div className="space-y-6">
            {/* HEADER */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Education Details
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Add and verify your educational
                qualifications.
              </p>
            </div>

            {/* ADD BUTTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  addEducation("Secondary School")
                }
                className="border-2 border-dashed border-[#03257e] rounded-2xl p-5 bg-white hover:bg-slate-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <School className="text-[#03257e]" />

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Add School Education
                    </h3>

                    <p className="text-sm text-slate-500">
                      Secondary or Higher Secondary
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  addEducation("Graduation")
                }
                className="border-2 border-dashed border-[#006666] rounded-2xl p-5 bg-white hover:bg-slate-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-[#006666]" />

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Add College / University
                    </h3>

                    <p className="text-sm text-slate-500">
                      Graduation or Post Graduation
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* LOADER */}
            {refresh ? (
              <ThreeDotLoader
                w={3}
                h={3}
                yPos="center"
              />
            ) : (
              <div className="space-y-5">
                {fields.map((field, index) => {
                  const isSaved = isMongoId(
                    field.id,
                  );

                  return (
                    <div
                      key={field.rhfKey}
                      className="bg-white border rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* CARD HEADER */}
                      <div className="p-5 border-b bg-slate-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900">
                                {field.level}
                              </h3>

                              {isSaved && (
                                <StatusBadge
                                  status={field.status}
                                  isEmailSend={
                                    field.isEmailSend
                                  }
                                />
                              )}
                            </div>

                            <p className="text-sm text-slate-500 mt-1">
                              {field.institutionName ||
                                "Institution name not added"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {isSaved && (
                              <label className="flex items-center gap-2 bg-[#006666]/10 px-3 py-2 rounded-lg cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={includedIds.has(
                                    field.id,
                                  )}
                                  onChange={() =>
                                    handleToggleInclude(
                                      index,
                                    )
                                  }
                                  className="accent-[#006666]"
                                />

                                <span className="text-sm text-[#006666] font-medium">
                                  Include in CV
                                </span>
                              </label>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedCard(
                                  expandedCard ===
                                    index
                                    ? null
                                    : index,
                                )
                              }
                              className="border px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-100"
                            >
                              {expandedCard ===
                              index ? (
                                <>
                                  Hide Details
                                  <ChevronUp
                                    size={16}
                                  />
                                </>
                              ) : (
                                <>
                                  View Details
                                  <ChevronDown
                                    size={16}
                                  />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CARD BODY */}
                      {expandedCard === index && (
                        <div className="p-5 space-y-6">
                          {/* LEVEL + DURATION */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* LEVEL */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">
                                Education Level
                              </label>

                              <select
                                disabled={
                                  field.verified
                                }
                                value={field.level}
                                onChange={(e) =>
                                  update(index, {
                                    ...field,
                                    level:
                                      e.target
                                        .value,
                                  })
                                }
                                className="w-full h-9 rounded-lg border px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006666]"
                              >
                                <option value="">
                                  Select level
                                </option>

                                <option value="Secondary School">
                                  Secondary School
                                </option>

                                <option value="Higher Secondary School">
                                  Higher Secondary
                                  School
                                </option>

                                <option value="Graduation">
                                  Graduation
                                </option>

                                <option value="PostGraduation">
                                  Post Graduation
                                </option>

                                {field.level &&
                                  ![
                                    "Secondary School",
                                    "Higher Secondary School",
                                    "Graduation",
                                    "PostGraduation",
                                  ].includes(
                                    field.level,
                                  ) && (
                                    <option
                                      value={
                                        field.level
                                      }
                                    >
                                      {
                                        field.level
                                      }
                                    </option>
                                  )}

                                <option value="Other">
                                  Other
                                </option>
                              </select>

                              {/* CUSTOM */}
                              {field.level ===
                                "Other" && (
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Custom level"
                                    value={
                                      customLevel
                                    }
                                    onChange={(e) =>
                                      setCustomLevel(
                                        e.target
                                          .value,
                                      )
                                    }
                                  />

                                  <Button
                                    type="button"
                                    className="bg-black hover:bg-black/90 text-white"
                                    onClick={() => {
                                      if (
                                        !customLevel
                                      )
                                        return;

                                      update(
                                        index,
                                        {
                                          ...field,
                                          level:
                                            customLevel,
                                        },
                                      );

                                      setCustomLevel(
                                        "",
                                      );
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* START */}
                            <FormField
                              control={control}
                              name={`educations.${index}.duration.from`}
                              render={({
                                field: f,
                              }) => (
                                <FormItem>
                                  <FormLabel>
                                    Start Month
                                  </FormLabel>

                                  <FormControl>
                                    <div className="relative">
                                      <Calendar className="absolute left-1 top-2.5 size-4 text-slate-400" />

                                      <Input
                                        disabled={
                                          field.verified
                                        }
                                        type="month"
                                        className="pl-5 h-9"
                                        {...f}
                                      />
                                    </div>
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* END */}
                            <FormField
                              control={control}
                              name={`educations.${index}.duration.to`}
                              render={({
                                field: f,
                              }) => (
                                <FormItem>
                                  <FormLabel>
                                    End Month
                                  </FormLabel>

                                  <FormControl>
                                    <div className="relative">
                                      <Calendar className="absolute left-1 top-2.5 size-4 text-slate-400" />

                                      <Input
                                        disabled={
                                          field.verified
                                        }
                                        type="month"
                                        className="pl-5 h-9"
                                        {...f}
                                      />
                                    </div>
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* INSTITUTE */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* DROPDOWN */}
                            <FormField
                              control={control}
                              name={`educations.${index}.${
                                field.level ===
                                  "Secondary School" ||
                                field.level ===
                                  "Higher Secondary School"
                                  ? "boardNameOrDegree"
                                  : "institutionName"
                              }`}
                              render={({
                                field: f,
                              }) => (
                                <FormItem>
                                  <FormLabel>
                                    {field.level ===
                                      "Secondary School" ||
                                    field.level ===
                                      "Higher Secondary School"
                                      ? "Board Name"
                                      : "Institute Name"}
                                  </FormLabel>

                                  <FormControl>
                                    <DropDown
                                      isDisabled={
                                        field.verified
                                      }
                                      classOrgId={`educations.${index}.${
                                        field.level ===
                                          "Secondary School" ||
                                        field.level ===
                                          "Higher Secondary School"
                                          ? "boardNameOrDegree"
                                          : "institutionName"
                                      }`}
                                      index={index}
                                      options={
                                        collegeOptions
                                      }
                                      placeholder={
                                        field.level ===
                                          "Secondary School" ||
                                        field.level ===
                                          "Higher Secondary School"
                                          ? "Search board..."
                                          : "Search institute..."
                                      }
                                      {...f}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* DEGREE */}
                            <FormField
                              control={control}
                              name={`educations.${index}.${
                                field.level ===
                                  "Secondary School" ||
                                field.level ===
                                  "Higher Secondary School"
                                  ? "institutionName"
                                  : "boardNameOrDegree"
                              }`}
                              render={({
                                field: f,
                              }) => (
                                <FormItem>
                                  <FormLabel>
                                    {field.level ===
                                      "Secondary School" ||
                                    field.level ===
                                      "Higher Secondary School"
                                      ? "School Name"
                                      : "Degree"}
                                  </FormLabel>

                                  <FormControl>
                                    <Input
                                      disabled={
                                        field.verified
                                      }
                                      placeholder={
                                        field.level ===
                                          "Secondary School" ||
                                        field.level ===
                                          "Higher Secondary School"
                                          ? "Enter school name"
                                          : "e.g. B.Tech"
                                      }
                                      className="h-9"
                                      {...f}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* GPA */}
                            <FormField
                              control={control}
                              name={`educations.${index}.gpa`}
                              render={({
                                field: f,
                              }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>
                                    {field.level ===
                                      "Secondary School" ||
                                    field.level ===
                                      "Higher Secondary School"
                                      ? "Percentage"
                                      : "GPA / CGPA"}
                                  </FormLabel>

                                  <FormControl>
                                    <Input
                                      disabled={
                                        field.verified
                                      }
                                      placeholder={
                                        field.level ===
                                          "Secondary School" ||
                                        field.level ===
                                          "Higher Secondary School"
                                          ? "Enter percentage"
                                          : "Enter GPA"
                                      }
                                      className="h-9"
                                      {...f}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* VERIFICATION */}
                          {!field.verified && (
                            <div className="border rounded-2xl bg-slate-50 overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedVerification(
                                    expandedVerification ===
                                      index
                                      ? null
                                      : index,
                                  )
                                }
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-100 transition"
                              >
                                <div>
                                  <h3 className="font-semibold text-slate-900 text-left">
                                    Verification &
                                    Documents
                                  </h3>

                                  <p className="text-sm text-slate-500 text-left">
                                    DigiLocker or
                                    upload
                                  </p>
                                </div>

                                {expandedVerification ===
                                index ? (
                                  <ChevronUp
                                    size={18}
                                  />
                                ) : (
                                  <ChevronDown
                                    size={18}
                                  />
                                )}
                              </button>

                              {expandedVerification ===
                                index && (
                                <div className="border-t p-4 space-y-5">
                                  {/* DIGILOCKER */}
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border rounded-xl p-4">
                                    <div>
                                      <h4 className="font-medium text-slate-900">
                                        Verify with
                                        DigiLocker
                                      </h4>

                                      <p className="text-sm text-slate-500">
                                        Recommended
                                        method
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenDigiLocker(
                                          true,
                                        );

                                        setIdx(
                                          index,
                                        );
                                      }}
                                      className="border border-[#6334FA] rounded-xl px-4 py-2 hover:bg-[#6334FA]/10 transition"
                                    >
                                      <img
                                        src={
                                          DigilockerImg
                                        }
                                        alt="digilocker"
                                        className="w-28 h-8 object-contain"
                                      />
                                    </button>
                                  </div>

                                  {/* UPLOAD */}
                                  <div className="space-y-4">
                                    <label className="border-2 border-dashed rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white transition">
                                      <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Paperclip className="size-5 text-slate-600" />
                                      </div>

                                      <div className="flex-1">
                                        <p className="font-medium text-slate-900">
                                          {selectedFileName ??
                                            "Choose document"}
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                          JPG, PNG
                                          or PDF
                                        </p>
                                      </div>

                                      <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="hidden"
                                        onChange={(
                                          e,
                                        ) =>
                                          uploadDocHandler(
                                            e
                                              .target
                                              .files?.[0]!,
                                            index,
                                          )
                                        }
                                      />
                                    </label>

                                    {isUploading && (
                                      <p className="text-sm text-[#006666]">
                                        Uploading...
                                      </p>
                                    )}

                                    {uploadError && (
                                      <p className="text-sm text-red-600">
                                        {
                                          uploadError
                                        }
                                      </p>
                                    )}

                                    {/* VIEW */}
                                    {getValues(
                                      `educations.${index}.docUri`,
                                    ) && (
                                      <a
                                        href={getValues(
                                          `educations.${index}.docUri`,
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-[#006666] border border-[#006666] px-3 py-2 rounded-lg"
                                      >
                                        View
                                        Uploaded
                                        File
                                        <ExternalLink
                                          size={
                                            15
                                          }
                                        />
                                      </a>
                                    )}

                                    {/* EMAIL */}
                                    <FormField
                                      control={
                                        control
                                      }
                                      name={`educations.${index}.issuerEmailId`}
                                      render={({
                                        field:
                                          f,
                                      }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Issuer
                                            Email
                                          </FormLabel>

                                          <FormControl>
                                            <Input
                                              disabled={
                                                field.verified
                                              }
                                              placeholder="issuer@example.com"
                                              className="h-11"
                                              {...f}
                                            />
                                          </FormControl>

                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ACTIONS */}
                          <div className="flex justify-between items-center flex-wrap gap-3">
                            <FormField
                              control={control}
                              name={`educations.${index}.selfAttested`}
                              render={() => (
                                <FormItem>
                                  <FormControl>
                                    <SelfAttestButton
                                      isAttested={
                                        form.watch(
                                          `educations.${index}.selfAttested`,
                                        ) as boolean
                                      }
                                      onClick={() =>
                                        handleSelfAttest(
                                          index,
                                        )
                                      }
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center gap-3">
                              {isSaved ? (
                                <>
                                  <Button
                                    type="button"
                                    disabled={
                                      loadingState ===
                                      "Updating"
                                    }
                                    onClick={() =>
                                      updateHandler(
                                        index,
                                      )
                                    }
                                    className="bg-[#006666] hover:bg-[#005555]"
                                  >
                                    <Replace
                                      size={
                                        16
                                      }
                                    />

                                    {loadingState ===
                                      "Updating" &&
                                    idx ===
                                      index
                                      ? "Updating..."
                                      : "Update"}
                                  </Button>

                                  <Button
                                    type="button"
                                    disabled={
                                      loadingState ===
                                      "Deleting"
                                    }
                                    onClick={() =>
                                      deleteHandler(
                                        index,
                                      )
                                    }
                                    className="bg-[#f14419] hover:bg-[#d63b14]"
                                  >
                                    <Trash2
                                      size={
                                        16
                                      }
                                    />

                                    Delete
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      removeEducation(
                                        index,
                                      )
                                    }
                                  >
                                    <Trash2
                                      size={
                                        16
                                      }
                                    />

                                    Remove
                                  </Button>

                                  {loadingState ===
                                    "Submitting" &&
                                  idx ===
                                    index ? (
                                    <LoadingButton className="bg-[#006666]" />
                                  ) : (
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        submitFormHandler(
                                          index,
                                        )
                                      }
                                      className="bg-[#006666] text-white hover:bg-[#005555]"
                                    >
                                      Save
                                      Education
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* VERIFIED */}
                          {field.verified && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-700">
                              <CheckCircle
                                size={18}
                              />

                              <span>
                                This document
                                has been
                                verified and
                                saved.
                              </span>
                            </div>
                          )}

                          {/* DIGILOCKER MODAL */}
                          {openDigiLocker &&
                            index === idx && (
                              <DigiLockerTest
                                setOpenDigiLocker={
                                  setOpenDigiLocker
                                }
                                openDigiLocker={
                                  openDigiLocker
                                }
                                field={
                                  field.level
                                }
                                index={index}
                              />
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </StepCard>
      </form>
    </Form>
  );
};