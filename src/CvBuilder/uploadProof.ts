import { uploadFile } from "@/uploadFile";
import React from "react";

interface IProofUpload{
file:File,
setIsUploading:React.Dispatch<React.SetStateAction<boolean>>,
setUploadError:React.Dispatch<React.SetStateAction<string | null>>,
setSelectedFileName:React.Dispatch<React.SetStateAction<string | null>>,
}

 const validateProofFile = (file: File) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf",
        ];
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
        const maxSize = 5 * 1024 * 1024; // 5MB limit (optional)

        if (!file) return { isValid: false, error: "No file selected" };

        const fileExtension = file.name
            .toLowerCase()
            .substring(file.name.lastIndexOf("."));

        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error:
                    "Invalid file type. Please upload JPG, JPEG, PNG, or PDF files only.",
            };
        }

        if (!allowedExtensions.includes(fileExtension)) {
            return {
                isValid: false,
                error:
                    "Invalid file extension. Please upload JPG, JPEG, PNG, or PDF files only.",
            };
        }

        if (file.size > maxSize) {
            return {
                isValid: false,
                error: "File size too large. Please upload files smaller than 10MB.",
            };
        }

        return { isValid: true };
    };

export const handleProofUploaded = async ({file,setIsUploading,setUploadError,setSelectedFileName}:IProofUpload) => {
        if (!file) return;
        setIsUploading(true);
        //let docHash = null;
        setUploadError(null);
        const validation = validateProofFile(file);
            if (!validation.isValid) {
                alert(validation.error);
                setIsUploading(false);
                setUploadError(validation?.error || "Not a valid file");
                setSelectedFileName(null);
                return;
            }
        try {
            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const docHash = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            const formData = new FormData();
            formData.append("file", file);
            const response: any = await uploadFile(formData);
            if (response?.data?.success) {
                const url = response.data.url;
                setIsUploading(false);
                setSelectedFileName(null);
                return {url,docHash};
            } else {
                // try to pick error message from response
                const err = response?.response?.data?.error || response?.data?.error || "Upload failed";
                setUploadError(`Could not upload (${err})`);
            }
        } catch (error) {
            setIsUploading(false);
            setUploadError("Upload failed");
        }
    };