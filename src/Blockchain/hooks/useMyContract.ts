import {
  useChainId,
  useWriteContract,
  useReadContract,
  } from 'wagmi';
import { stringToHex } from 'viem';
import {
  ABI,
  CONTRACT_ADDRESS,
  getContractAddress,
  isContractChainSupported,
  SUPPORTED_CONTRACT_NETWORKS,
} from '../constants/constant';
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
  const chainId = useChainId();
  const address = getContractAddress(chainId) ?? CONTRACT_ADDRESS;
  const isSupportedChain = isContractChainSupported(chainId);
  const publicClient = usePublicClient({ chainId });

  const { writeContractAsync, isPending } = useWriteContract();

  const assertSupportedChain = () => {
    if (!isSupportedChain) {
      throw new Error(`Please switch your wallet to ${SUPPORTED_CONTRACT_NETWORKS}.`);
    }
    if (!publicClient) throw new Error("Wallet not connected.");

    return publicClient;
  };

  const waitForSuccessfulTransaction = async (
    client: NonNullable<typeof publicClient>,
    hash: `0x${string}`,
  ) => {
    const receipt = await client.waitForTransactionReceipt({ hash });
    if (receipt.status !== 'success') {
      throw new Error('The blockchain transaction failed. No data was saved.');
    }

    return receipt;
  };

  
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
    const client = assertSupportedChain();
    // Simulate first — reverts here before MetaMask opens
    await client.simulateContract({
      address,
      abi: ABI,
      functionName: "submitDocument",
      args: [name, hashString, docType, tokenUri],
      account:currAddress, // current user's address
    });
    const hash = await writeContractAsync({
      chainId,
      address,
      abi: ABI,
      functionName: 'submitDocument',
      args: [name, hashString, docType, tokenUri],
    });

    return await waitForSuccessfulTransaction(client, hash);
  };

  const getSubmission = async (hashString: `0x${string}`) => {
    const client = assertSupportedChain();
    return await client.readContract({
      address,
      abi: ABI,
      functionName: 'getSubmission',
      args: [hashString],
    }) as Submission;
  };

  //2.1 Whitelist Issuer


const whitelistIssuer = async (issuer: string, name: string,currAddress: `0x${string}`) => {
  const client = assertSupportedChain();
  // Simulate first — reverts here before MetaMask opens
  await client.simulateContract({
    address,
    abi: ABI,
    functionName: "whitelistIssuer",
    args: [issuer, name],
    account:currAddress, // current user's address
  });

  // Only reaches here if simulation passed
  return await writeContractAsync({
    chainId,
    address,
    abi: ABI,
    functionName: "whitelistIssuer",
    args: [issuer, name],
  });
};

  //2.2 Revoke Issuer
  const revokeIssuer = async (issuer: string,currAddress: `0x${string}`) => {
  const client = assertSupportedChain();
  // Simulate first — reverts here before MetaMask opens
  await client.simulateContract({
    address,
    abi: ABI,
    functionName: "revokeIssuer",
    args: [issuer],
    account:currAddress, // current user's address
  });
    return await writeContractAsync({
      chainId,
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
      query: { enabled: isSupportedChain },
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
    const client = assertSupportedChain();
    // Simulate first — reverts here before MetaMask opens
    await client.simulateContract({
      address,
      abi: ABI,
      functionName: "approveDocument",
      args: [hashString],
      account:currAddress, // current user's address
    });
      const hash = await writeContractAsync({
        chainId,
        address,
        abi: ABI,
        functionName: 'approveDocument',
        args: [hashString],
      });
      return await waitForSuccessfulTransaction(client, hash);
  };

  //4. Get User Submissions (READ)
  const useGetUserSubmissions = (user: `0x${string}`) => {
    const { data, isLoading, error, refetch } = useReadContract({
      address,
      abi: ABI,
      functionName: 'getUserSubmissions',
      args: [user],
      query: { enabled: isSupportedChain },
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
      query: { enabled: isSupportedChain },
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
    const client = assertSupportedChain();
    // Simulate first — reverts here before MetaMask opens
    await client.simulateContract({
      address,
      abi: ABI,
      functionName: "rejectDocument",
      args: [hashString, reason],
      account:currAddress, // current user's address
    });
    const hash = await writeContractAsync({
      chainId,
      address,
      abi: ABI,
      functionName: 'rejectDocument',
      args: [hashString, reason],
    });
    return await waitForSuccessfulTransaction(client, hash);
  };

  //7. Revoke Document
  const revokeDocument = async (hashString: string) => {
    assertSupportedChain();
    const hashBytes32 = stringToHex(hashString, { size: 32 });
    return await writeContractAsync({
      chainId,
      address,
      abi: ABI,
      functionName: 'revokeDocument',
      args: [hashBytes32],
    });
  };

  //8.list all tokenIds owned by an address
  const useGetUserTokens = (user: string) => {
    const { data, isLoading, error, refetch } = useReadContract({
      address,
      abi: ABI,
      functionName: 'tokensOfOwner',
      args: [user],
      query: { enabled: isSupportedChain },
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
    query: { enabled: isSupportedChain },
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
    getSubmission,
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
