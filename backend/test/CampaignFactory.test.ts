import { Compaign, CampaignFactory } from "../typechain-types";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { BigNumberish } from 'ethers';
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import {anyValue} from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("CampaignFactory", function () {
  let campaignFactory: CampaignFactory ;
  let owner : HardhatEthersSigner;
  let addr1 : HardhatEthersSigner;
  let addr2 : HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the CampaignFactory contract
    const CampaignFactoryF = await ethers.getContractFactory("CampaignFactory");
    campaignFactory = await CampaignFactoryF.deploy();
    //await campaignFactory.deployed();
  });

  describe("Creating Campaigns", function () {
    it("Should create a new campaign", async function () {
      const tx = await campaignFactory.createCampaign(ethers.parseEther("0.1"));
      await tx.wait();

      const campaigns = await campaignFactory.getDeployedCampaigns();
      expect(campaigns.length).to.equal(1);
      expect(campaigns[0]).to.properAddress;
    });

    it("Should emit an event when a new campaign is created", async function () {
      await expect(campaignFactory.createCampaign(ethers.parseEther("0.1")))
        .to.emit(campaignFactory, "CampaignCreated")
        .withArgs(
          // We don't know the exact address, so use a placeholder for the campaign address
          anyValue, // campaignAddress
          owner.address, // manager
          ethers.parseEther("0.1") // minimumContribution
        );
    });
  });
});