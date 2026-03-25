import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, eni} from 'wagmi/chains';
import { defineChain } from 'viem';

export const myCustomChain = defineChain({
  id: 174, 
  name: 'ENI Testnet',
  network: 'eni-testnet',
  nativeCurrency: {
    name: 'EGAS',
    symbol: 'EGAS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.eniac.network'],
    },
    public: {
      http: ['https://rpc-testnet.eniac.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ENI Explorer',
      url: 'https://scan-testnet.eniac.network',
    },
  },
});

export const config = getDefaultConfig({
  appName: 'TruCV',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "eab12bd1a2511f9b3d7fb2d5757a2d30",
  chains: [mainnet, sepolia, polygon,eni,myCustomChain],
  ssr: false,
});


