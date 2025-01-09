'use client';

import { useDataCamapaign } from '@/data/useData';
import { createContext } from 'react';
import { Log } from 'viem';
import { ReactNode } from 'react';

export type EventLog = Log & {
  args: Record<string, unknown>;
  eventName: string;
};

export type Contract = {
  abi: readonly any[];
  address: `0x${string}`;
  fromBlock: bigint;
};



export interface DataType {
  account: {
    address: `0x${string}` | undefined;
    isConnected: boolean;
    isOwner: boolean;
  };
  chainId: number | undefined;
  contracts: {
    compaignContract: Contract | undefined;
  };
  queries: {
    campaignsBatchIsLoading: boolean;
    campaignsBatchisSuccess: boolean;
    campaignCountSuccess: boolean;
  };
  data: {
    campaigns: `0x${string}`[] ;
    currentCampaigns : `0x${string}`[] ;
    eventLogs: EventLog[] | undefined;
    campaignManagerOwner: `0x${string}` | undefined;
    deployedCampaigns : `0x${string}`[] | undefined;
    getCampaignCount : bigint | undefined;
  };
  fetchcampaignsPage: (page: number) => void;
}

export const DataContext = createContext<DataType>({
  account: {
    address: undefined,
    isConnected: false,
    isOwner: false,
  },
  chainId: undefined,
  contracts: {
    compaignContract: undefined,
  },
  queries: {
    campaignsBatchIsLoading: false,
    campaignsBatchisSuccess: false,
    campaignCountSuccess: false,
  },
  data: {
    campaigns:[],
    currentCampaigns: [],
    eventLogs: undefined,
    campaignManagerOwner: undefined,
    deployedCampaigns : [],
    getCampaignCount : undefined,
  },
  fetchcampaignsPage:() => undefined,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const data = useDataCamapaign();
  console.log(data); // TODO: remove debug
  return <DataContext.Provider value={{ ...data }}>{children}</DataContext.Provider>;
}
