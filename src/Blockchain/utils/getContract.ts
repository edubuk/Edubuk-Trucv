import { getContract } from 'viem';
import { useChainId, usePublicClient } from 'wagmi';
import { ABI } from '../constants/constant';
import { getContractAddress } from '../constants/constant';

export const useMyContractInstance = () => {
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId });

  const address = getContractAddress(chainId);

  if (!address || !publicClient) return null;

  return getContract({
    address,
    abi: ABI,
    client: publicClient,
  });
};
