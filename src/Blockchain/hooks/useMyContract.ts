import {
  useWriteContract,
  useReadContract,
  } from 'wagmi';
import { stringToHex } from 'viem';
import {ABI, CONTRACT_ADDRESS } from '../constants/constant';

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

export const useContract = () => {
  const address = CONTRACT_ADDRESS;

  const { writeContractAsync, isPending } = useWriteContract();

  
  //1. Submit Document

  const submitDocument = async ({
    name,
    hashString,
    docType,
    tokenUri,
  }: {
    name: string;
    hashString: string;
    docType: string;
    tokenUri: string;
  }) => {
    const hashBytes32 = stringToHex(hashString, { size: 32 });

    return await writeContractAsync({
      address,
      abi: ABI,
      functionName: 'submitDocument',
      args: [name, hashBytes32, docType, tokenUri],
    });
  };

  //2. Whitelist Issuer
  const whitelistIssuer = async (issuer: `0x${string}`) => {
    return await writeContractAsync({
      address,
      abi: ABI,
      functionName: 'whitelistIssuer',
      args: [issuer],
    });
  };

  //3. Approve Document
  const approveDocument = async (hashString: string) => {
    const hashBytes32 = stringToHex(hashString, { size: 32 });

    return await writeContractAsync({
      address,
      abi: ABI,
      functionName: 'approveDocument',
      args: [hashBytes32],
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
  const rejectDocument = async (hashString: string, reason: string) => {
    const hashBytes32 = stringToHex(hashString, { size: 32 });
    return await writeContractAsync({
      address,
      abi: ABI,
      functionName: 'rejectDocument',
      args: [hashBytes32, reason],
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
  const hashBytes32 = stringToHex(hashString, { size: 32 });
  const { data, isLoading, error } = useReadContract({
    address,
    abi: ABI,
    functionName: 'verifyDocument',
    args: [hashBytes32],
  });

  //destructure tuple safely
  const [isValid, document] = (data || []) as [boolean, Document];

  return {
    isValid,
    document,
    isLoading,
    error,
  };
};


  //4. Export All
  return {
    // write
    submitDocument,
    whitelistIssuer,
    approveDocument,
    rejectDocument,
    revokeDocument,
    isPending,

    // read
    useGetUserSubmissions,
    useGetSubmissionByHash,
    useVerifyDocument,
    useGetUserTokens
  };
};