const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed factory address
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    const factory = await CampaignFactory.attach(factoryAddress);
  
    const tx = await factory.getCampaignCount();
    //await tx.wait();
  
    console.log("count of campaign " + tx);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });