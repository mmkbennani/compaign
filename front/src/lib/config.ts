'use client';

import { http, createStorage, cookieStorage, fallback } from 'wagmi';
import { sepolia, bscTestnet, blastSepolia, hardhat, polygonAmoy} from 'wagmi/chains';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = "76bf8b3f0f63dbf2682c0b37a8f12c80";

const supportedChains: Chain[] = [polygonAmoy, hardhat, sepolia, bscTestnet, blastSepolia,  ];

export const config = getDefaultConfig({
   appName: "CampaignManagement",
   projectId,
   appIcon:'/images/carbonthink.svg',
   chains: supportedChains as any,
   ssr: true,
   storage: createStorage({
    storage: cookieStorage,
   }),
   transports: {
      [polygonAmoy.id]: http("https://polygon-amoy.g.alchemy.com/v2/j7ynzfH14BiCeCle8SjxcPfPN5RbCNVw", {
        batch: true,
        timeout: 60_000,
      }),
      [hardhat.id]: http("http://127.0.0.1:8545/", { batch: true, timeout: 60_000 }),
      [blastSepolia.id]: http(`${process.env.ALCHEMY_ENDPOINT_URL_BASE_MAINNET}${process.env.ALCHEMY_API_KEY}`, {
        batch: true,
        timeout: 60_000,
      }),
      
      [sepolia.id]: fallback([
        http(`${process.env.ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA}${process.env.ALCHEMY_API_KEY}`, {
          batch: true,
          timeout: 60_000,
        }),
        http(`https://base-sepolia-rpc.publicnode.com/`, { batch: true, timeout: 60_000 }),
      ]),
    }
 });