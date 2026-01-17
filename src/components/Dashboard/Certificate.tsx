
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// import { AlertTriangle, Award,DownloadIcon, Loader2, XCircle } from "lucide-react";
// import { Link } from "react-router-dom";
// import AddCertToLinkedIn from "./AddCertToLinkedIn";

const Certificate = () => {
    

  if (false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
        {/* <Loader2 className="h-10 w-10 animate-spin text-[#00776F]" /> */}
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Loading ...
        </p>
      </div>
    );
  }

  // const handleDownload = async (url:string) => {
  
  //   // Fetch file as blob
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  
  //   // Create object URL
  //   const blobUrl = window.URL.createObjectURL(blob);
  
  //   // Force download
  //   const link = document.createElement("a");
  //   link.href = blobUrl;
  //   link.download = "mypdf.pdf";
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  
  //   // Cleanup
  //   window.URL.revokeObjectURL(blobUrl);
  // };
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="absolute inset-0 pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <span
        key={i}
        className="absolute snowflake"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${6 + Math.random() * 4}s`,
        }}
      >
        ❄
      </span>
    ))}
  </div>

  {/* Header text */}
  <h1 className="relative z-10 text-3xl font-bold text-gray-900 text-center frost-text font-['Inter'] text-3xl font-extrabold">
    SNOW FROST HACKATHON Certification
  </h1>
      <Alert
        variant="destructive"
        className="rounded-2xl border-l-4 border-red-600 shadow-md max-w-xl mx-auto my-5 "
      >
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <div>
          <AlertTitle className="font-semibold text-red-700">
            Important Notice
          </AlertTitle>
          <AlertDescription className="text-gray-700">
            You can only generate a certificate after the creating the CV.
          </AlertDescription>
        </div>
      </Alert>
      <div className="max-w-xl mx-auto mt-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg">
  <div className="flex items-start gap-4">
    <div className="flex h-12 w-14 items-center justify-center rounded-full bg-blue-100">
      <svg
        className="h-6 w-6 text-[#f14419] animate-pulse"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-blue-900">
        Certificate Status
      </h3>

      <p className="mt-2 text-sm font-bold text-blue-700">
        Your certificate will be available here shortly for generation and download.
      </p>

      <p className="mt-1 text-sm text-blue-600">
        We’re preparing everything in the background to ensure it’s ready for you.
      </p>
    </div>
  </div>
</div>


        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              className="shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-200"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">
                    Spark Hackathon
                  </span>
                  {true ? (
                    <div className="flex items-center gap-2">
                    {true&&  <DownloadIcon className="h-6 w-6 text-[#03257e] cursor-pointer" onClick={() => handleDownload(`https://trucvstorage.blob.core.windows.net/uploads/123`)}/>}
                    <Award className="h-6 w-6 text-green-600" />
                    </div>
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Taken on{" "}
                  {new Date("2025-10-16T12:34:56.789Z").toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 font-medium">Score</p>
                  <p
                    className={`font-bold ${
                      true
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    80%
                  </p>
                </div>

                {true ? (
                  <div className="flex justify-center items-center flex-col w-full">
                  {true?<Link to={`/certificate/generation/123`}>
                    <Button
                      className="w-full rounded-xl bg-[#00776F] hover:bg-[#00776F]/80 cursor-pointer hover:opacity-90"
                      onClick={() =>
                        console.log("Generate certificate for", "123")
                      }
                    >
                      Generate Certificate
                    </Button>
                  </Link>:
                  <div className="flex justify-center items-center flex-col w-full gap-2">
                    <AddCertToLinkedIn
                    certName={`ABC Module Completion Certificate`}
                    organizationId={92792}
                    issueYear={2025}
                    issueMonth={10}
                    certUrl={`https://trucvstorage.blob.core.windows.net/uploads/123`}
                    certId={123}
                  />
                  </div>}
                  </div>
                ) : (
                  <p className="text-center text-red-500 font-semibold">
                    ❌ Failed
                  </p>
                )}
              </CardContent>
            </Card>
        </div> */}
    </div>
  );
};

export default Certificate;