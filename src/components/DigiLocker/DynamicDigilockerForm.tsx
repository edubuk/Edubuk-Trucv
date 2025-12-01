import { useForm, useFormContext } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/api";
// import qs from "qs";

type FieldSpec = {
  label: string;
  paramname: string;
  valuelist: string | null;
  example: string | null;
};

type Props = {
  fields: FieldSpec[];
  index: number;
  setOpenDigiLocker:(open: boolean) => void;
  description:string;
  issuerName:string;
  doctype:string;
  orgid:string;
  setErrorMsg: (msg: string) => void;
};

export default function DynamicDigilockerForm({
  fields,
  index,
  setOpenDigiLocker,
  description,
  issuerName,
  doctype,
  orgid,
  setErrorMsg
}: Props) {
  // Build defaultValues from fields (empty string)
  const defaultValues = fields.reduce<Record<string, any>>((acc, f) => {
    acc[f.paramname] = "";
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues });
  const formContext = useFormContext();
  const { setValue } = formContext;
  const [loading,setLoading] = useState<boolean>(false);
  const [uri, setUri] = useState<string>();
  const [consent, setConsent] = useState(false);
  

  const onSubmitWrapper = handleSubmit(async (values) => {
  console.log("submitting", values);
  await fetchIssued(values);
});

  const fetchIssued = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      const body = values;
      console.log("body",body)
      const r: any = await api.post(`/api/dl/fetchDocUri?orgid=${orgid}&doctype=${doctype}`,body)
      console.log("response",r.data);
      if (r.data.ok) {
        setUri(r.data.data.uri);
        setValue(`educations.${index}.docUri`, r.data.data.uri, {
          shouldValidate: true,
          shouldDirty: true,
        });
        //setting value for the verification validations
        setValue(`educations.${index}.status`, "verified");
        setValue(`educations.${index}.verifiedThrough`, "DigiLocker");
        setValue(`educations.${index}.verified`, true);
      } else {
        setErrorMsg("No document found");
      }
      if (!r.response.data.ok) {
        setErrorMsg(r?.response?.data?.error?.error_description);
      }
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error?.error_description);
    }finally{setLoading(false)}
  };



  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-1">
        <div className="flex flex-wrap items-center gap-4">
      {fields.map((f) => {
        const options =
          f.valuelist && typeof f.valuelist === "string"
            ? f.valuelist.split(",").map((s) => s.trim())
            : null;

        return (
          <div key={f.paramname} className="flex flex-col gap-1">
            <label className="font-medium">
              {f.label}{" "}
              {f.example && (
                <span className="text-sm text-gray-500">({f.example})</span>
              )}
            </label>

            {options ? (
              <select
                {...register(f.paramname, { required: `${f.label} is required` })}
                defaultValue=""
                className="p-2 border rounded"
            
              >
                <option value="" disabled>
                  Select {f.label}
                </option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register(f.paramname, { required: `${f.label} is required` })}
                placeholder={f.example ?? ""}
                className="p-2 border rounded"
              />
            )}

            {errors[f.paramname] && (
              <p className="text-red-600 text-sm">
                {String((errors as any)[f.paramname]?.message)}
              </p>
            )}
          </div>
        );
      })}
      </div>
      <div className="mt-4">
          <label htmlFor="digilocker-checkbox" className="flex items-start gap-3 text-sm text-slate-600">
            <input
              id="digilocker-checkbox"
              type="checkbox"
              onChange={() => setConsent(!consent)}
              checked={consent}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#006666]"
            />
            <span className="text-slate-600">I provide my consent to share my educational documents with the <span className="font-semibold text-slate-800">{issuerName}</span> for the purpose of fetching <span className="font-semibold text-slate-800">{description}</span> into DigiLocker.</span>
          </label>
        </div>
      <div className="flex items-center gap-2">
        {uri?<a href={`https://trucv.org/api/dl/view-doc?docUri=${uri}`} target="_blank" rel="noopener noreferrer">View Document</a>:<button
        type="button"  
        onClick={() => onSubmitWrapper()}   
        disabled={isSubmitting || loading || !consent}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
      >
        {isSubmitting || loading ? "fetching..." : "Submit"}
      </button>}
        {uri&&<button
        type="button"                 
        onClick={() => setOpenDigiLocker(false)}   
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
      >
        Save
      </button>}
      
      </div>
    </form>
  );
}
