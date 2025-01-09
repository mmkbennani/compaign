import { base, baseSepolia, hardhat, polygonAmoy } from 'viem/chains';

export const compaign = (chainId: number) => {
  const address: Record<string, `0x${string}`> = {
    [hardhat.id]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [baseSepolia.id]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [polygonAmoy.id]: '0x0F29FA33A67c859332e5631C358E006AF2c737F5',
    [base.id]: '0x', // TODO: put base mainnet address here
  };

  const fromBlock: Record<string, bigint> = {
    [hardhat.id]: BigInt(0),
    [baseSepolia.id]: BigInt(12312198), // TODO: put baseSepolia fromBlock here
    [polygonAmoy.id]: BigInt(0),
    [base.id]: BigInt(0), // TODO: put base mainnet fromBlock here
  };

  const ownerAddress: Record<string, `0x${string}`> = {
    [hardhat.id]: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    [baseSepolia.id]: '0x2dfd3525f51D105CFB4688E744109dcd5716b29B', 
    [polygonAmoy.id]: '0x2dfd3525f51D105CFB4688E744109dcd5716b29B',
    [base.id]: '0x2dfd3525f51D105CFB4688E744109dcd5716b29B', 
  };

  return {
    abi,
    address: chainId ? address[chainId] : address[baseSepolia.id],
    fromBlock: chainId ? fromBlock[chainId] : fromBlock[baseSepolia.id],
    ownerAddress,
  };
};

const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "campaignAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "manager",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "minimumContribution",
        "type": "uint256"
      }
    ],
    "name": "CampaignCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "minimumContribution",
        "type": "uint256"
      }
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "get",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCampaignCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDeployedCampaigns",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalProjects",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
