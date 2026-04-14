import { useContract } from "@/Blockchain/hooks/useMyContract";
import { parseContractError } from "@/Blockchain/utils/error";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResendEmailDoc,TypeResendEmail } from "@/CvBuilder/cvSchema";
import { handleProofUploaded } from "@/CvBuilder/uploadProof";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormLabel } from "@mui/material";
import { ExternalLink, Paperclip, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
const ResendEmail = ({
  openModel,
  setOpenModel,
  docId,
  setDocId,
  info,
  setRefreshKey 
}: {
  openModel: boolean;
  setOpenModel: (value: boolean) => void;
  docId:string;
  setDocId: (value: string) => void;
  info:{
    org:string,
    roleOrLevel:string,
    docType:string
  };
  setRefreshKey:React.Dispatch<React.SetStateAction<boolean>>
    }) => {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [loading,setLoading] = useState<boolean | null>(null);
    const {submitDocument} = useContract();
    const {address} = useAccount();
    //console.log("docId",docId);
    const form = useForm<TypeResendEmail>({
        resolver: zodResolver(ResendEmailDoc),
        defaultValues: 
            {
              id:"",
              issuerEmailId:"",
              docUri:"",
              docHash:""
            }
      });

      const { control, handleSubmit, setValue,formState:{errors},reset,getValues} = form;

     const uploadDocHandler = async (file: File) => {
        if (!file) return;
        try {
          setSelectedFileName(file.name);
          const uploadRes = await handleProofUploaded({
            file,
            setIsUploading,
            setUploadError,
            setSelectedFileName,
          });
          console.log("upload res", uploadRes);
          if (!uploadRes) return;
          const { url, docHash } = uploadRes;
          setValue('docUri', url, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(`docHash`, docHash, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(`id`, docId, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } catch (error) {
          toast.error("something went wrong");
        } finally {
          setSelectedFileName(null);
          setIsUploading(false);
        }
      };


      const emailHandler = async(data:TypeResendEmail)=>{
        console.log("errors",errors); 
        console.log("project form values", data);
        try {

            setLoading(true);
            const docHash = getValues("docHash");
            const issuerEmailId = getValues("issuerEmailId");
                // Blockchain Registration
            if (docHash) {
              const id = toast.loading("Submitting on chain...");
              try {
                await submitDocument({
                  name       : info.roleOrLevel,
                  hashString : `0x${docHash}` as `0x${string}`,
                  docType    : info.docType,
                  tokenUri   : "",
                  currAddress: address as `0x${string}`,
                });
                toast.dismiss(id);
              } catch (txError) {
                const errMsg = parseContractError(txError);

                if (errMsg === "This document has already been submitted.") {
                  // Already on chain — skip and proceed to DB save
                  toast.dismiss(id);
                  toast.custom(() => (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                      <p>Document already on chain. Retrying database save...</p>
                    </div>
                  ));
                } else {
                  // Any other chain error — stop everything
                  toast.dismiss(id);
                  throw txError;
                }
              }
            }
            const res = await api.post(`/doc/resend-email/${getValues("id")}?docType=${info.docType}`,
            {
                data:{issuerEmailId:issuerEmailId,docUri:getValues("docUri"),docHash:docHash}
            });
            const {data} = res;
            //console.log("data",data);   
            if(data.success)
            {
                toast.success(data.message);
                setDocId("")
                reset({
                  id:"",
                  issuerEmailId:"",
                  docUri:"",
                  docHash:""
                });
                setRefreshKey((prev)=>!prev)
                setOpenModel(false)
            }
        } catch (error) {
            toast.error("something went wrong");
        }finally{
            setLoading(false);
        }
      }

   const onCloseHandler = ()=>{
    if(!(getValues("issuerEmailId")||getValues("docUri"))){
      setOpenModel(false)
      return;
    }
    const confirm = window.confirm("Are you sure to close it? form data will erased");
      if(confirm){
      setDocId("")
      reset({
        id:"",
        issuerEmailId:"",
        docUri:"",
        docHash:""
      });
      setOpenModel(false)
   }
}

  if (!openModel) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
  <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl p-6">

    {/* Close Button */}
    <button
      onClick={onCloseHandler}
      className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
    >
      <X className="h-5 w-5 text-gray-600" />
    </button>
    <p className="text-sm text-gray-600 p-2">You are setting EMail for verification document of <span className="font-semibold text-[#03257e]">{info.org}</span> <span className="font-semibold text-[#006666]">{info.roleOrLevel}</span></p>
    {/* Centered Form Container */}
    <div className="flex flex-col items-center justify-center w-full">

      <Form {...form}>
        <form 
        onSubmit={handleSubmit(emailHandler,(err)=>console.log(err))}
        className="w-full max-w-lg space-y-6">

          {/* Upload Section */}
          <FormField
            control={form.control}
            name="docUri"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  <div className="flex items-center gap-2 mb-1">
                    <Paperclip className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-700">
                      Upload your document and enter issuer email to send a verification request.
                    </span>
                  </div>
                </FormLabel>

                <FormControl>
                  <div className="relative w-full p-1">
                    {/* Hidden File Input */}
                    <input
                    name="docUri"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => uploadDocHandler(e.target.files?.[0]!)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {/* Visual Box */}
                    <div className="flex flex-col items-start gap-2">

                      {form.getValues("docUri") ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-sm">File Uploaded</span>

                          <button
                            type="button"
                            onClick={() => setSelectedFileName(null)}
                            className="text-xs px-3 py-1 text-[#f14419] border border-[#f14419] rounded-md hover:bg-[#f14419] hover:text-white transition"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-[#FB980E]">
                            <Paperclip className="h-4 w-4 text-gray-700" />
                            <span className="text-sm text-gray-800">
                              {selectedFileName ?? "Upload File"}
                            </span>
                          </div>

                          <p className="text-xs text-[#f14419]">
                            Accepted: .jpg, .jpeg, .png, .pdf — max 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>

                <FormMessage />

                {uploadError && (
                  <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                )}

                {isUploading && (
                  <p className="text-sm text-green-600 mt-1">
                    Uploading document — please wait…
                  </p>
                )}

                {/* Preview Link */}
                {form.getValues("docUri") && (
                  <a
                    href={form.getValues("docUri")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-[#008888] border border-[#008888] px-3 py-1 rounded-md hover:bg-[#008888] hover:text-white transition"
                  >
                    View Proof <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </FormItem>
            )}
          />

          {/* Issuer Email Section */}
          <div className="space-y-3">

            <FormField
              control={control}
              name="issuerEmailId"
              render={({ field: f }) => (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="issuerEmail"
                    className="text-sm font-medium text-gray-700"
                  >
                    Issuer Email:
                  </label>

                  <Input
                    id="issuerEmail"
                    placeholder="Enter issuer's email address"
                    className="rounded-lg px-3 py-2 text-sm border border-gray-300 
                      focus:outline-none focus:ring-2 focus:ring-[#6334FA] focus:border-[#6334FA]"
                    {...f}
                  />

                  <FormMessage />
                </div>
              )}
            />

            <Button
              type="submit"
              className="w-full md:w-auto"
            >
              {loading ? <LoadingButton /> : "Send Email To Issuer"}
            </Button>

          </div>

        </form>
      </Form>
    </div>

  </div>
</div>

  );
};

export default ResendEmail;
