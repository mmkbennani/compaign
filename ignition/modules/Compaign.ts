// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { BigNumberish } from 'ethers';


const CompaignModule = buildModule("CompaignModule", (m) => {
  const valueMinimum: BigNumberish = 50;
  const Compaign = m.contract("Compaign",[valueMinimum],{from:'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'});

  return { Compaign };
});

export default CompaignModule;
