import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'AgentSwarm Payment System',
  projectId: '04cbc5e45a5cf4728a973d99ef545c43', // WalletConnect Cloud project ID
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
  },
  ssr: false,
});
