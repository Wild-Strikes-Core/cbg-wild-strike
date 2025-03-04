// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

// Importing OpenZeppelin's Ownable contract to manage ownership permissions
import "@openzeppelin/contracts/access/Ownable.sol";

// Contract to manage experience (EXP) points for players in a  game
contract addPoints is Ownable {
    // Mapping to store experience points (EXP) for each player's address
    mapping(address => uint256) public exp;

    // Event to notify when EXP is added to a player's account
    event ExpAdded(address indexed winner, uint256 amount);

    //  Ensure the constructor correctly initializes the Ownable contract
    constructor() Ownable(msg.sender) {}

    //  Restrict EXP modification to only the contract owner using `onlyOwner`
    function addExp(address winner) public onlyOwner {
        // Increases the winner's EXP by 200 points
        exp[winner] += 200;

        // Emits an event to log the addition of EXP for tracking
        emit ExpAdded(winner, 200);
    }

    // Function to retrieve a player's current EXP balance
    function getExp(address player) public view returns (uint256) {
        return exp[player];
    }
}
