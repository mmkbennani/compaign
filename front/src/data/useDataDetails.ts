'use client';

import { useAccount, useBlockNumber, useConfig, useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi';

import { DataType, EventLog } from '@/contexts/data-provider';
import { compaign } from '@/contracts/compaign.contract';
import { useEffect, useState } from 'react';
import { baseSepolia, hardhat } from 'viem/chains';

export function useDataCamapaign(): DataType {

  const compaignOwner= "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);
  const [campaignIdToFetch, setcampaignIdToFetch] = useState<number | undefined>(undefined);
  const [campaignsPage, setcampaignsPage] = useState<number | undefined>(undefined);
  const[campaigns, setCampaigns] = useState<`0x${string}`[]>([]);
  const[currentCampaigns, setCurrentCampaigns] = useState<`0x${string}`[]>([]);
  const wagmiConfig = useConfig();
  const { isConnected, address: accountAddress, chainId: accountChainId = hardhat.id } = useAccount();

  const chainId = wagmiConfig.chains.map((chain) => chain.id).includes(accountChainId)
    ? accountChainId
    : baseSepolia.id;

  const { data: blockNumber } = useBlockNumber({ chainId, query: { refetchInterval: 20_000 } });

  const compaignContract = compaign(chainId);

  useEffect(() => {
    // At chain change, reset data.
    setEventLogs(undefined);
  }, [chainId]);

  useWatchContractEvent({
    ...compaignContract,
    chainId,
    enabled: !!chainId && blockNumber != null,
    eventName: 'logs' as any, // Hack eventName because typescript is incorrect.
    fromBlock: BigInt(Math.max(Number(blockNumber ?? 0) - 49_000, 0)), // Depth of 50_000 max on testnet RPC.
    onError() {
      if (eventLogs === undefined) {
        setEventLogs([]);
      }
    },
    onLogs: (logs) => setEventLogs(logs.reverse() as EventLog[]),
    syncConnectedChain: true,
  });

  const { data: getDeployedCampaigns } = useReadContract({
    ...compaignContract,
    chainId,
    functionName: 'getDeployedCampaigns',
  });

  const deployedCampaigns = getDeployedCampaigns as `0x${string}`[] | undefined;

  const { data: getCampaignCount } = useReadContract({
    ...compaignContract,
    chainId,
    functionName: 'getCampaignCount',
  });


  function fetchcampaignsPage(page: number) {
    setcampaignsPage(page);
    refetchcampaignsBatch();
  }

  
  
  const CAMPAIGNS_PAGE_SIZE = 10;
  const {
    data: campaignsBatch,
    refetch: refetchcampaignsBatch,
    isLoading: campaignsBatchIsLoading,
    isSuccess: campaignsBatchisSuccess,
  } = useReadContracts({
    contracts: Array.from({ length: CAMPAIGNS_PAGE_SIZE }).map((_, index) => ({
      ...compaignContract,
      args: [BigInt(Number(getCampaignCount ?? 0) - index - ((campaignsPage ?? 1) - 1) * CAMPAIGNS_PAGE_SIZE - 1)],
      chainId,
      functionName: 'get',
    })),
    query: {
      enabled: campaignsPage != null,
      // TODO: select transform data here
    },
  });

  useEffect(() => {
    let newcampaigns = [...campaigns];
    let fetchedCampaigns: ((prevState: `0x${string}`[]) => `0x${string}`[]) | string[] = [];
    let index = campaigns.length;
    campaignsBatch?.forEach((row) => {
      if (row.result) {
        const campaignAddress = row.result as unknown as `0x${string}`;
        index++;
        newcampaigns.push(campaignAddress);
        fetchedCampaigns.push(campaignAddress);
        //newcampaigns[index] = campaignAddress;
      }
    });
    const deployedCampaigns = newcampaigns as `0x${string}`[] ;
    const deployedcampaignsBatch = fetchedCampaigns as `0x${string}`[] ;
    setCampaigns(deployedCampaigns);
    setCurrentCampaigns(deployedcampaignsBatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignsBatch]);


  return {
    account: {
      address: accountAddress,
      isConnected,
      isOwner: accountAddress === compaignOwner && accountAddress != null,
    },
    chainId,
    contracts: {
      compaignContract,
    },
    queries: {
      campaignsBatchIsLoading,
      campaignsBatchisSuccess,
    },
    data: {
      campaigns,
      currentCampaigns,
      eventLogs,
      campaignManagerOwner: compaignOwner,
      deployedCampaigns,
      getCampaignCount,
    },
    fetchcampaignsPage,
  };
}
