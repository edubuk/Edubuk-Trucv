import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia, sepolia } from 'viem/chains';

export const config = getDefaultConfig({
  appName: 'TruCV',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "eab12bd1a2511f9b3d7fb2d5757a2d30",
  chains: [sepolia, baseSepolia],
  ssr: false,
});
