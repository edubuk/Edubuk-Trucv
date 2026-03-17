import { getContract } from 'viem';
import { usePublicClient } from 'wagmi';
import { ABI } from '../constants/constant';
import { CONTRACT_ADDRESS } from '../constants/constant';

export const useMyContractInstance = () => {
  const publicClient = usePublicClient();

  const address = CONTRACT_ADDRESS;

  return getContract({
    address,
    abi: ABI,
    client: publicClient as any,
  });
};