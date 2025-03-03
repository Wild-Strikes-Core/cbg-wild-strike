// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

// Import the ERC20 token standard implementation from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Define a new ERC20 token contract named Sample3WildToken
contract Sample3WildToken is ERC20 {
    // Immutable address of the creator (contract deployer)
    address public immutable creator;

    // Constructor to initialize the token with an initial supply
    constructor(uint256 initialSupply) ERC20("Sample3WildToken", "SW3") {
        creator = msg.sender; // Set the creator to the deployer's address
        _mint(msg.sender, initialSupply); // Mint the initial supply to the creator
    }
 
    // Function to generate new tokens and send them to a specified address
    // This function allows anyone to mint tokens without restriction
    function generateTokens(address destination, uint256 amount) public {
        _mint(destination, amount);
    }

    // Function to mint new tokens, but only the contract creator is allowed to use it
    function mint(address to, uint256 amount) public {
        require(msg.sender == creator, "Only creator can mint tokens"); // Ensure only the creator can mint
        _mint(to, amount); // Mint the specified amount of tokens to the given address
    }
}