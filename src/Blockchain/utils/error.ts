
// utils/parseContractError.ts
import { BaseError, ContractFunctionRevertedError } from "viem";

export function parseContractError(err: unknown): string {
  // 1. Viem contract revert (require messages + custom errors)
  if (err instanceof BaseError) {
    const revert = err.walk((e) => e instanceof ContractFunctionRevertedError);

    if (revert instanceof ContractFunctionRevertedError) {
      // require() string reason
      if (revert.reason) return revert.reason;

      // custom error e.g error NotAuthorized()
      if (revert.data?.errorName) {
        const customErrors: Record<string, string> = {
          NotAuthorized           : "You are not authorized to perform this action.",
          CallerNotIssuer         : "Only issuers can perform this action.",
          DocumentAlreadySubmitted: "This document has already been submitted.",
          DocumentNotPending      : "This document is no longer pending.",
        };
        return customErrors[revert.data.errorName] ?? `Contract error: ${revert.data.errorName}`;
      }
    }

    // User rejected in MetaMask
    if (err.message.includes("User rejected") || err.message.includes("user rejected")) {
      return "Transaction rejected by user.";
    }

    // Fallback to viem short message
    if (err.shortMessage) return err.shortMessage;
  }

  // 2. Manual throws e.g. if (!publicClient) throw new Error("Wallet not connected.")
  if (err instanceof Error) return err.message;

  // 3. Unknown
  return "Something went wrong. Please try again.";
}