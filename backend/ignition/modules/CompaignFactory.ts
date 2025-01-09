// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const CompaignFactoryModule = buildModule("CampaignFactoryModule", (m) => {
  const CompaignFactory = m.contract("CampaignFactory",[]);

  return { CompaignFactory };
});

export default CompaignFactoryModule;
