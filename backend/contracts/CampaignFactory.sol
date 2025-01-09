// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import './Compaign.sol';

contract CampaignFactory {
     // Array to store deployed campaign addresses
    //address[] public deployedCampaigns;

    mapping (uint => address) deployedCampaigns;

    uint256 public totalProjects=0;
    // Event emitted when a new campaign is created
    event CampaignCreated(address campaignAddress, address manager, uint minimumContribution);

    /**
     * @dev Creates a new Campaign contract and stores its address.
     * @param minimumContribution The minimum contribution required to participate in the campaign.
     */
    function createCampaign(uint256 minimumContribution) public {
        // Deploy a new Campaign contract and pass the minimum contribution and msg.sender as the manager
        Compaign newCampaign = new Compaign(minimumContribution, msg.sender);
        //deployedCampaigns.push(address(newCampaign));
        totalProjects= totalProjects+1;
        deployedCampaigns[totalProjects] = address(newCampaign);
        
        emit CampaignCreated(address(newCampaign), msg.sender, minimumContribution);
    }


    function get(uint256 projectId) external view returns (address) {
        return deployedCampaigns[projectId];
    }

    /**
     * @dev Returns the list of deployed campaign addresses.
     * @return An array of addresses of deployed campaigns.
     */
    function getDeployedCampaigns() public view returns (address[] memory) {

        address[] memory addresses = new address[](totalProjects);
        
        for (uint i = 0; i < totalProjects; i++) {
            addresses[i] = deployedCampaigns[i];
        }

        return addresses;
    }

    /**
     * @dev Returns the number of deployed campaigns.
     * @return The total count of deployed campaigns.
     */
    function getCampaignCount() public view returns (uint) {
        return totalProjects;
    }
}