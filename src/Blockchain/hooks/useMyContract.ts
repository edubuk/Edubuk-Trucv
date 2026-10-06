import {
  useWriteContract,
  useReadContract,
  } from 'wagmi';
import { stringToHex } from 'viem';
import {ABI, CONTRACT_ADDRESS } from '../constants/constant';
import { usePublicClient } from "wagmi";



//Type for Submission (from your struct)
export type Submission = {
  submitter: `0x${string}`;
  name: string;
  hash: `0x${string}`;
  docType: string;
  tokenUri: string;
  status: number; // enum → uint8
  submittedAt: bigint;
  rejectReason: string;
};

export type BlockchainDocument = {
  name: string;
  hash: string;      // bytes32 from chain
  issuer: string;    // address
  recipient: string; // address
  issuedAt: number;  // uint256 unix timestamp
  isValid: boolean;
  docType: string;
}

export const useContract = () => {
  const address = CONTRACT_ADDRESS;
  const publicClient = usePublicClient();

  const { writeContractAsync, isPending } = useWriteContract();

  
  //1. Submit Document

  const submitDocument = async ({
    name,
    hashString,
    docType,
    tokenUri,
    currAddress,
  }: {
    name: string;
    hashString: string;
    docType: string;
    tokenUri: string;
    currAddress: `0x${string}`;
  }) => {
    //const hashBytes32 = stringToHex(hashString, { size: 32 });
      if (!publicClient) throw new Error("Wallet not connected.");
    // Simulate first — reverts here before MetaMask opens
    await publicClient.simulateContract({
      address,
      abi: ABI,
      functionName: "submitDocument",
      args: [name, hashString, docType, tokenUri],
      account:currAddress, // current user's address
    });
    return await writeContractAsync({
      address,
      abi: ABI,
      functionName: 'submitDocument',
      args: [name, hashString, docType, tokenUri],
    });
  };

  //2.1 Whitelist Issuer


const whitelistIssuer = async (issuer: string, name: string,currAddress: `0x${string}`) => {
  if (!publicClient) throw new Error("Wallet not connected.");
  // Simulate first — reverts here before MetaMask opens
  await publicClient.simulateContract({
    address,
    abi: ABI,
    functionName: "whitelistIssuer",
    args: [issuer, name],
    account:currAddress, // current user's address
  });

  // Only reaches here if simulation passed
  return await writeContractAsync({
    address,
    abi: ABI,
    functionName: "whitelistIssuer",
    args: [issuer, name],
  });
};

  //2.2 Revoke Issuer
  const revokeIssuer = async (issuer: string,currAddress: `0x${string}`) => {
  if (!publicClient) throw new Error("Wallet not connected.");
  // Simulate first — reverts here before MetaMask opens
  await publicClient.simulateContract({
    address,
    abi: ABI,
    functionName: "revokeIssuer",
    args: [issuer],
    account:currAddress, // current user's address
  });
    return await writeContractAsync({
      address,
      abi: ABI,
      functionName: 'revokeIssuer',
      args: [issuer],
    });
  };

  //2.3 Get list of Issuer Names
  const useGetAllIssuers = (offset: number = 0, limit: number = 10) => {
    const { data, isLoading, error, refetch } = useReadContract({
      address,
      abi: ABI,
      functionName: 'getAllIssuers',
      args: [offset, limit],
    });
    return {
      data,
      isLoading,
      error,
      refetch,
    };
  };

  //3. Approve Document
  const approveDocument = async (hashString: string,currAddress: `0x${string}`) => {
    if (!publicClient) throw new Error("Wallet not connected.");
    // Simulate first — reverts here before MetaMask opens
    await publicClient.simulateContract({
      address,
      abi: ABI,
      functionName: "approveDocument",
      args: [hashString],
      account:currAddress, // current user's address
    });
      return await writeContractAsync({
        address,
        abi: ABI,
        functionName: 'approveDocument',
        args: [hashString],
      });
  };

  //4. Get User Submissions (READ)
  const useGetUserSubmissions = (user: `0x${string}`) => {
    const { data, isLoading, error, refetch } = useReadContract({
      address,
      abi: ABI,
      functionName: 'getUserSubmissions',
      args: [user],
    });
     
    return {
      submissions: data as Submission[] | undefined,
      isLoading,
      error,
      refetch,
    };
  };

  //5. Get Submission by Hash (READ)
  const useGetSubmissionByHash = (hashString: string) => {
    const hashBytes32 = stringToHex(hashString, { size: 32 });
    const { data, isLoading, error, refetch } = useReadContract({
      address,
      abi: ABI,
      functionName: 'getSubmission',
      args: [hashBytes32],
    });

    return {
      submission: data as Submission | undefined,
      isLoading,
      error,
      refetch,
    };
  };

  //6. Reject document
  const rejectDocument = async (hashString: string,currAddress: `0x${string}`,reason: string) => {
    if (!publicClient) throw new Error("Wallet not connected.");
    // Simulate first — reverts here before MetaMask opens
    await publicClient.simulateContract({
      address,
      abi: ABI,
      functionName: "rejectDocument",
      args: [hashString, reason],
      account:currAddress, // current user's address
    });
    return await writeContractAsync({
      address,
      abi: ABI,
      functionName: 'rejectDocument',
      args: [hashString, reason],
    });
  };

  //7. Revoke Document
  const revokeDocument = async (hashString: string) => {
    const hashBytes32 = stringToHex(hashString, { size: 32 });
    return await writeContractAsync({
      address,
      abi: ABI,
      functionName: 'revokeDocument',
      args: [hashBytes32],
    });
  };

  //8.list all tokenIds owned by an address
  const useGetUserTokens = async (user: string) => {
    const { data, isLoading, error, refetch } = useReadContract({
      address,
      abi: ABI,
      functionName: 'tokensOfOwner',
      args: [user],
    });

    return {
      tokenIds: data as bigint[] | undefined,
      isLoading,
      error,
      refetch,
    };
  };

  //9.Verify by hash directly
  const useVerifyDocument = (hashString: string) => {
  const { data, isLoading, error } = useReadContract({
    address,
    abi: ABI,
    functionName: 'verifyDocument',
    args: [hashString],
  });

  //destructure tuple safely
  //const [isValid, doc] = (data || []) as [boolean, Document];

  return {
    data: data as [boolean, BlockchainDocument] | undefined,
    isLoading,
    error,
  };
};


  //4. Export All
  return {
    // write
    submitDocument,
    whitelistIssuer,
    revokeIssuer,
    approveDocument,
    rejectDocument,
    revokeDocument,
    isPending,

    // read
    useGetUserSubmissions,
    useGetSubmissionByHash,
    useVerifyDocument,
    useGetUserTokens,
    useGetAllIssuers
  };
};