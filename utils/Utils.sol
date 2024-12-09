
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

contract Utils {


    function getRandomNumber(uint256 _min, uint256 _max) public view returns (uint256) {
        // Generate a seed from the block hash
        uint256 seed = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp)));

        // Use the seed to generate a random number within the range
        uint256 randomNumber = seed % (_max - _min + 1) + _min;

        return randomNumber;
    }

    function generateRandomString(uint256 length) public view returns (string memory) {
        bytes memory randomBytes = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            randomBytes[i] = bytes1(uint8(uint256(keccak256(abi.encodePacked(block.prevrandao, getRandomNumber(0, length), i))) % 26) + 97);
        }
        return string(randomBytes);
    }


    function generateRandomStringV2(uint256 length) public view returns (string memory) {
        // Define a list of possible characters (hexadecimal characters in this case)
        bytes16 _alphabet = "0123456789abcdef";
        // Initialize a dynamic byte array to store the random string
        bytes memory randomString = new bytes(length);
        for (uint i = 0; i < length; i++) {
            // Pseudo-randomly select an index from _alphabet based on block data
            uint randomIndex = uint(keccak256(abi.encodePacked(block.prevrandao, msg.sender, i)));
            // Assign the character to the random string at position i
            randomString[i] = _alphabet[randomIndex];
        }
        // Convert the byte array to a string and return it
        return string(randomString);
    }


}