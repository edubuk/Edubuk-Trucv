import { CheckCircle, Clock, PenLine, X } from "lucide-react";


export type VerificationStatus = "verified" | "pending" | "rejected" | "inProgress" | "selfAttested";
// Colors
const COLOR_PRIMARY = "#03257e"; // deep blue
const COLOR_TEAL = "#006666"; // teal
const COLOR_ACCENT = "#f14419"; // orange-red


const StatusBadge: React.FC<{ status: VerificationStatus,isEmailSend?:boolean }> = ({ status,isEmailSend }) => {
  if (status === "verified") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
        style={{ backgroundColor: COLOR_TEAL + "1a", color: COLOR_TEAL }}
      >
        <CheckCircle className="h-3.5 w-3.5" /> Verified
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
        style={{ backgroundColor: COLOR_ACCENT + "1a", color: COLOR_ACCENT }}
      >
        <X className="h-3.5 w-3.5" /> Rejected
      </span>
    );
  }
  if (status === "pending" && isEmailSend) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
        style={{ backgroundColor: COLOR_ACCENT + "1a", color: COLOR_ACCENT }}
      >
        <Clock className="h-3.5 w-3.5" /> Pending
      </span>
    );
  }
  return (
    <span
      className="w-fit inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
      style={{ backgroundColor: COLOR_PRIMARY + "1a", color: COLOR_PRIMARY }}
    >
      <PenLine className="h-3.5 w-3.5" /> Self Attested
    </span>
  );
};

export default StatusBadge;