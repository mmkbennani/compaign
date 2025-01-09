// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import '../utils/Utils.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract Compaign {

    Utils public utils;

    struct Request {
        uint id_request;
        string description;
        uint amount;
        address receipent;
        bool complete;
        uint approvalCount;
    }

    mapping(uint => mapping(address => bool)) approvals;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint approversCount;
    Request[] public requests;

    event ContributionReceived(address sender, uint256 value);
    event RequestCreated( string description, uint256 value, address receipent);

    constructor(uint minimum,address owner) payable {
        manager = owner;
        minimumContribution = minimum;
    }


    modifier isManager(){
        require(msg.sender==manager, "You must be the manager to manage request");
        _;
    }



    function contribute() public payable {
        require(msg.value>=minimumContribution,"thanxs to send greater than");
        approvers[msg.sender] = true;
        approversCount++;
        emit ContributionReceived(msg.sender, msg.value);
    }


    function createRequest(string memory description, uint amount, address receipent) public isManager{

        uint id_request = uint(keccak256(abi.encodePacked(block.prevrandao)));
        Request memory newRquest = Request(
            {
                id_request : id_request,
                description : description,
                amount : amount,
                receipent : receipent,
                complete:false,
                approvalCount:0
            }
        );
        requests.push(newRquest);
        approvals[id_request][address(0)] = false;

        emit RequestCreated(description, amount, receipent);

    }


    function approveRequest(uint index) public {

        require(requests.length>index,string.concat("You have to choose index less than ", Strings.toString(requests.length)));
        Request storage request = requests[index];

        require(approvers[msg.sender],"The approvers must donate before approve request");
        require(!approvals[request.id_request][msg.sender], "You can't vote twice");

        approvals[request.id_request][msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public isManager {

        require(requests.length>index,string.concat("You have to choose index less than ", Strings.toString(requests.length)));
        Request storage request = requests[index];
        require(!request.complete, "This request is already complete");
        bool ratio = request.approvalCount > approversCount/2;
        require(ratio, "Have to be at least 50% of approvers true");
        payable(request.receipent).transfer(request.amount);
        request.complete = true;
    }

}