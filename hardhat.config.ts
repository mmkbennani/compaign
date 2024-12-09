import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-verify';
import 'solidity-docgen';
import 'dotenv/config';
import 'tsconfig-paths/register'; // This adds support for typescript paths mappings

const { API_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  docgen: {
    outputDir: 'doc',
  },
  gasReporter: {
    enabled: true,
  },
  networks: {
    baseSepolia: {
      accounts: [`0x${PRIVATE_KEY}`],
      url: API_URL,
    },
    hardhat: {},
  },
  solidity: '0.8.28',
};

export default config;
