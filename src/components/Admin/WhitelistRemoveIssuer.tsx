import { ShieldCheck, UserPlus, Wallet, ShieldX, User } from "lucide-react";
import toast from "react-hot-toast";
import { useContract } from "@/Blockchain/hooks/useMyContract";
import { parseContractError } from "@/Blockchain/utils/error";
import { useAccount } from "wagmi";
import { useState } from "react";


const WhitelistRemoveIssuer = () => {

  const [name, setName] = useState("");
  const [issuerAddress, setIssuerAddress] = useState("");
  const [loadingAction, setLoadingAction] = useState<"whitelist" | "remove" | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { whitelistIssuer, revokeIssuer } = useContract();
  const { address } = useAccount();
  const validateInputs = () => {
    if (!issuerAddress) {
      setMessage({ type: "error", text: "Issuer Address is required." });
      return false;
    }
    if (!name) {
      setMessage({ type: "error", text: "Issuer Name is required." });
      return false;
    }
    return true;
  };

  const handleWhitelist = async () => {
    if (!validateInputs()) return;

    try {
      setLoadingAction("whitelist");
      setMessage(null);
     console.log("address",address);
      const res = await whitelistIssuer(issuerAddress,name,address!);
      console.log("res",res);  
      if(res) {
        toast.success("Issuer successfully whitelisted.");
        setMessage({ type: "success", text: "Issuer successfully whitelisted." });
      } else {
        setMessage({ type: "error", text: "Failed to whitelist issuer." });
      }
    } catch (err: any) {
      console.log("err",err);
      toast.error(parseContractError(err) || "Failed to whitelist issuer.");
      setMessage({ type: "error", text: parseContractError(err) });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemove = async () => {
    if (!validateInputs()) return;

    try {
      setLoadingAction("remove");
      setMessage(null);

      const res = await revokeIssuer(issuerAddress,address!);
      console.log("res",res);  
      if(res) {
        toast.success("Issuer successfully removed from whitelist.");
        setMessage({ type: "success", text: "Issuer successfully removed from whitelist." });
      } else {
        setMessage({ type: "error", text: "Failed to remove issuer." });
      }
    } catch (err: any) {
      console.log("err",err);
      toast.error(parseContractError(err) || "Failed to remove issuer.");
      setMessage({ type: "error", text: parseContractError(err) });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-gray-200">

        {/* Left Panel */}
        <div className="bg-[#03257e] p-6 text-white flex flex-col justify-center py-2">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-8 w-8 text-[#f14419]" />
            <h1 className="text-2xl font-bold">
              Issuer Access Control
            </h1>
          </div>

          <p className="text-sm text-gray-200 leading-relaxed">
            Manage trusted issuers in your verification network.  
            You can whitelist new issuers or remove existing ones securely.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-300">
            <UserPlus className="h-4 w-4 text-[#006666]" />
            Secure issuer management
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="bg-white p-6 space-y-5">

          {/* Issuer Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#03257e]">
              <User className="h-4 w-4 text-[#006666]" />
              Issuer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter issuer name"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#03257e] focus:outline-none focus:ring-1 focus:ring-[#03257e]"
            />
          </div>
          {/* Issuer Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#03257e]">
              <Wallet className="h-4 w-4 text-[#006666]" />
              Issuer Address
            </label>
            <input
              type="text"
              value={issuerAddress}
              onChange={(e) => setIssuerAddress(e.target.value)}
              placeholder="Enter issuer wallet address"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#03257e] focus:outline-none focus:ring-1 focus:ring-[#03257e]"
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-lg px-3 py-2 text-sm border ${
                message.type === "success"
                  ? "border-[#006666] text-[#006666] bg-[#006666]/10"
                  : "border-[#f14419] text-[#f14419] bg-[#f14419]/10"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Whitelist Button */}
            <button
              onClick={handleWhitelist}
              disabled={loadingAction !== null}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#006666] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
            >
              <ShieldCheck className="h-5 w-5" />
              {loadingAction === "whitelist" ? "Whitelisting..." : "Whitelist Issuer"}
            </button>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={loadingAction !== null}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white bg-[#f14419] text-white px-4 py-2 text-sm font-semibold hover:bg-[#f14419]/90 disabled:opacity-60 transition"
            >
              <ShieldX className="h-5 w-5 text-white" />
              {loadingAction === "remove" ? "Removing..." : "Remove Issuer"}
            </button>

          </div>
        </div>
      </div>
  )
}

export default WhitelistRemoveIssuer