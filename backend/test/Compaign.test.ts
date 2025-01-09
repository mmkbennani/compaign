import { Compaign } from "../typechain-types";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { BigNumberish } from 'ethers';
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("CompaignContract", function () {
  let hardhatCompaign : Compaign;
  let owner :HardhatEthersSigner;
  let addr1 : HardhatEthersSigner;
  let addr2 : HardhatEthersSigner;
  let addr3 : HardhatEthersSigner;
  let addr4 : HardhatEthersSigner;
  let minimumContribution: any;


  async function deployCompaignFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, address1, address2, adresse3, adresse4] = await hre.ethers.getSigners();
    const Compaign = await hre.ethers.getContractFactory("Compaign");
    const valueMinimum = ethers.parseEther("20");
    const hardhatCompaign = await Compaign.deploy(valueMinimum, owner);

    return { hardhatCompaign, valueMinimum, owner, address1, address2, adresse3, adresse4};
  }


  beforeEach(async () => {
    const fixture = await loadFixture(deployCompaignFixture);
    hardhatCompaign = fixture.hardhatCompaign;
    owner = fixture.owner;
    addr1 = fixture.address1;
    addr2 = fixture.address2;
    addr3 = fixture.adresse3;
    addr4 = fixture.adresse4;
    minimumContribution = fixture.valueMinimum;
    
  })
  
  

  describe("contribute function", function () {
    it("should allow a user to contribute if the value is greater than or equal to the minimum", async function () {
      await expect(hardhatCompaign.connect(addr1).contribute({ value: minimumContribution }))
        .to.emit(hardhatCompaign, "ContributionReceived")
        .withArgs(addr1.address, minimumContribution);
        
      const approverStatus = await hardhatCompaign.approvers(addr1.address);
      expect(approverStatus).to.equal(true);
    });

    it("should not allow a user to contribute if the value is less than the minimum", async function () {
      const smallAmount = ethers.parseEther("0.5"); // Less than minimumContribution

      await expect(hardhatCompaign.connect(addr1).contribute({ value: smallAmount }))
        .to.be.revertedWith("thanxs to send greater than");

      const approverStatus = await hardhatCompaign.approvers(addr1.address);
      expect(approverStatus).to.equal(false); // The approver status should remain false
    });

    it("should allow multiple users to contribute", async function () {
      await hardhatCompaign.connect(addr1).contribute({ value: minimumContribution });
      await hardhatCompaign.connect(addr2).contribute({ value: minimumContribution });

      const approverStatus1 = await hardhatCompaign.approvers(addr1.address);
      const approverStatus2 = await hardhatCompaign.approvers(addr2.address);

      expect(approverStatus1).to.equal(true);
      expect(approverStatus2).to.equal(true);
    });
  });


  describe("createRequest function", function () {
    it("should allow only the manager to create a request", async function () {
      const description = "Test Request by Manager";
      const amount = ethers.parseEther("1");
      const recipient = addr2.address;

      // The manager (owner) should be able to create a request
      await expect(
        hardhatCompaign.connect(owner).createRequest(description, amount, recipient)
      )
        .to.emit(hardhatCompaign, "RequestCreated") // Assuming you emit an event "RequestCreated"
        .withArgs(description, amount, recipient);

      // Check the requests array to see if the request was added
      const requests = await hardhatCompaign.requests(0);  // Assumes the request is the first one
      expect(requests.description).to.equal(description);
      expect(requests.amount).to.equal(amount);
      expect(requests.receipent).to.equal(recipient);
      expect(requests.complete).to.equal(false);
      expect(requests.approvalCount).to.equal(0);


    });

    it("should not allow non-managers to create a request", async function () {
      const description = "Test Request by Non-Manager";
      const amount = ethers.parseEther("1");
      const recipient = addr2.address;

      // addr1 is not the manager, so it should fail
      await expect(
        hardhatCompaign.connect(addr1).createRequest(description, amount, recipient)
      ).to.be.revertedWith("You must be the manager to manage request");

      // addr2 (also not the manager) should also fail
      await expect(
        hardhatCompaign.connect(addr2).createRequest(description, amount, recipient)
      ).to.be.revertedWith("You must be the manager to manage request");
    });

    it("should generate a unique id for each request", async function () {
      const description1 = "First Request";
      const amount1 = ethers.parseEther("1");
      const recipient1 = addr2.address;

      const description2 = "Second Request";
      const amount2 = ethers.parseEther("2");
      const recipient2 = addr2.address;

      // The manager (owner) can create requests
      await hardhatCompaign.connect(owner).createRequest(description1, amount1, recipient1);
      await hardhatCompaign.connect(owner).createRequest(description2, amount2, recipient2);

      const request1 = await hardhatCompaign.requests(0);  // First request
      const request2 = await hardhatCompaign.requests(1);  // Second request

      expect(request1.description).to.equal(description1);
      expect(request2.description).to.equal(description2);

      // The IDs should be unique as they are generated via utils.generateRandomString(15)
      expect(request1.id_request).to.not.equal(request2.id_request);
    });
  });


  describe("approveRequest", function () {


    beforeEach(async function () {
      await hardhatCompaign.connect(addr3).contribute({ value: minimumContribution }); // addr3 contributes
      await hardhatCompaign.connect(addr1).contribute({ value: minimumContribution }); // addr1 contributes
  
      // Create a request
      await hardhatCompaign.connect(owner).createRequest("Test Request", ethers.parseEther("40"), addr2.address);
    });


    it("should revert if the index is out of bounds", async function () {
      // Try to approve a request with an index greater than the length of the requests array
      await expect(hardhatCompaign.connect(addr1).approveRequest(1))
        .to.be.revertedWith("You have to choose index less than 1");
    });

    it("should revert if the sender has not donated (not an approver)", async function () {
      // addr2 has not contributed, so they cannot approve requests
      await expect(hardhatCompaign.connect(addr2).approveRequest(0))
        .to.be.revertedWith("The approvers must donate before approve request");
    });

    it("should revert if the sender has already voted (can't vote twice)", async function () {
      // addr1 has contributed, so they can approve, but we call approveRequest twice
      await hardhatCompaign.connect(addr1).approveRequest(0);

      // Now they should not be able to approve again
      await expect(hardhatCompaign.connect(addr1).approveRequest(0))
        .to.be.revertedWith("You can't vote twice");
    });

    it("should increment approvalCount correctly", async function () {
      // addr1 is an approver, so they can approve the request
      await hardhatCompaign.connect(addr1).approveRequest(0);
      
      const request = await hardhatCompaign.requests(0);
      expect(request.approvalCount).to.equal(1); // approvalCount should be 1

      // addr2 is also an approver, they should be able to approve as well
      await hardhatCompaign.connect(addr3).approveRequest(0);

      const updatedRequest = await hardhatCompaign.requests(0);
      expect(updatedRequest.approvalCount).to.equal(2); // approvalCount should be 2
    });
  });

  describe("finalizeRequest", function () {
    beforeEach(async function () {
      await hardhatCompaign.connect(addr4).contribute({ value: minimumContribution }); // addr4 contributes
      await hardhatCompaign.connect(addr3).contribute({ value: minimumContribution }); // addr3 contributes
      await hardhatCompaign.connect(addr1).contribute({ value: minimumContribution }); // addr1 contributes
  
      // Create a request
      await hardhatCompaign.connect(owner).createRequest("Test Request", ethers.parseEther("40"), addr2.address);
    });


    describe("finalizeRequest", function () {
      it("should revert if the index is out of bounds", async function () {
        // Try to finalize a request with an index greater than the length of the requests array
        await expect(hardhatCompaign.connect(owner).finalizeRequest(1))
          .to.be.revertedWith("You have to choose index less than 1");
      });
  
      it("should revert if the request has already been completed", async function () {
        // Mark the request as completed
        await hardhatCompaign.connect(addr3).approveRequest(0);
        await hardhatCompaign.connect(addr1).approveRequest(0);
        await hardhatCompaign.connect(owner).finalizeRequest(0);
        
        // Attempt to finalize the same request again
        await expect(hardhatCompaign.connect(owner).finalizeRequest(0))
          .to.be.revertedWith("This request is already complete");
      });
  
      it("should revert if the approval count is less than 50% of the approvers", async function () {
        // Only 1 approver (owner) has approved, while there are 2 approvers
        await hardhatCompaign.connect(addr3).approveRequest(0);
  
        // The approval count is 1 and approversCount is 2, so the function should revert
        await expect(hardhatCompaign.connect(owner).finalizeRequest(0))
          .to.be.revertedWith("Have to be at least 50% of approvers true");
      });
  
      it("should finalize the request if the approval count is >= 50% of the approvers", async function () {
        // Both addr1 and owner approve the request
        await hardhatCompaign.connect(addr3).approveRequest(0);
        await hardhatCompaign.connect(addr1).approveRequest(0);
  
        // Ensure the request is not complete yet
        const requestBefore = await hardhatCompaign.requests(0);
        expect(requestBefore.complete).to.equal(false);
        
        const recipientBalanceBefore = await ethers.provider.getBalance(addr2.address);
        
        // Assuming that the amount to transfer is exactly 2 ETH (requestAmount)
        await hardhatCompaign.connect(owner).finalizeRequest(0);
        const requestAfter = await hardhatCompaign.requests(0);
        expect(requestAfter.complete).to.equal(true);
  
        const recipientBalanceAfter = await ethers.provider.getBalance(addr2.address);
        expect(recipientBalanceAfter-recipientBalanceBefore).to.equal(requestBefore.amount);
      });
    });


  });
});