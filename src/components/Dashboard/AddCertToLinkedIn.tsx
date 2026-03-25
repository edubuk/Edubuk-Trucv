import { Button } from "@/components/ui/button";
import { TiSocialLinkedin } from "react-icons/ti";
type Props = {
  certName: string;
  organizationId: number;
  issueYear: number;
  issueMonth: number;
  certUrl: string;
  certId: number;
  expirationYear?: number;
  expirationMonth?: number;
};

const AddCertToLinkedIn = ({
  certName,
  organizationId,
  issueYear,
  issueMonth,
  certUrl,
  certId,
  expirationYear,
  expirationMonth,
}: Props) => {
  const encodedCertName = encodeURIComponent(certName);
  const encodedCertUrl = encodeURIComponent(certUrl);

  let url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodedCertName}&organizationId=${organizationId}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodedCertUrl}&certId=${certId}`;

  if (expirationYear && expirationMonth) {
    url += `&expirationYear=${expirationYear}&expirationMonth=${expirationMonth}`;
  }

  return (
    <Button className="border text-white  py-6 rounded-lg px-5 bg-sky-700 hover:bg-sky-600 cursor-pointer">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center"
      >
        <TiSocialLinkedin className="mr-2 size-8" />

        <span className="text-lg">Add Certificate to LinkedIn</span>
      </a>
    </Button>
  );
};

export default AddCertToLinkedIn;