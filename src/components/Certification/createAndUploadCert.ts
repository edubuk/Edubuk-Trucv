export const createAndUploadCert = async ({
  setState,
}: {
  setState: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const userFormData = JSON.parse(localStorage.getItem("userFormData") || "{}");
  try {
    setState("Generating certificate...");
    let response: any = await fetch("https://edubuktrucveduchain.org/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userFormData.name,
        certificate_type: `${userFormData.topic}`,
      }),
    });
    const id = await response.headers.get("id");
    if (!id) {
        return setState("Failed to generate certificate ID");
    }
    response = await response.blob();
    const file = new File([response], "document.pdf", {
      type: "application/pdf",
    });
    const formData = new FormData();
    formData.append("file", file);
    console.log("Certificate response:", response);
    if (response) {
      setState("Uploading certificate...");
      let upload: any = await fetch("https://okto-v2.vercel.app/file/upload", {
        method: "POST",
        body: formData,
      });
      upload = await upload.json();
      console.log("Upload response:", upload);
      if (upload?.success && upload.url) {
        {
        setState("Attaching QR Code...");
          const mappingUrl:any = await fetch(
            `https://okto-v2.vercel.app/qr/url-map`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
                url: upload.url,
              }),
            }
          );
          const mappedResponse:any = await mappingUrl.json();
          if(!mappingUrl.success) {
            return setState("Failed to map URL to QR code");
          }
          if(mappedResponse.success) {
            console.log("Certificate uploaded successfully:", mappedResponse);
            return upload;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in creating and uploading certificate:", error);
    console.log("Error in creating and uploading certificate:", error);
  }
};