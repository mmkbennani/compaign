const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  //0x0F29FA33A67c859332e5631C358E006AF2c737F5
    const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed factory address
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    const factory = await CampaignFactory.attach(factoryAddress);
  
    const tx = await factory.createCampaign(ethers.parseEther("0.3"));
    await tx.wait();
  
    console.log("Campaign created!");
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });