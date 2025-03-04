// SPDX-License-Identifier: UNLICENSED 
pragma solidity >=0.8.0 <0.9.0;

// Import the ERC20 interface from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Smart contract to facilitate a token-based betting game
contract claimTokens {
    // ERC20 token used for betting
    IERC20 public token;
    
    // Addresses of the two players participating in the game
    address public player1;
    address public player2;
    
    // Amount of tokens each player bets
    uint256 public betAmount;
    
    // Flag to indicate whether the game has started
    bool public gameStarted;

    // Events to log important actions
    event GameStarted(address indexed player1, address indexed player2, uint256 betAmount);
    event TokensDeposited(address indexed player, uint256 amount);
    event WinnerDeclared(address indexed winner, uint256 prizeAmount);
    event GameReset();

    // Modifier to restrict access to only registered players
    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "Not a registered player");
        _;
    }

    // Constructor initializes the contract with the token address
    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    // Function for players to join the game by depositing tokens
    function joinGame(uint256 amount) public {
        require(!gameStarted, "Game already started"); // Ensure game hasn't started
        require(amount > 0, "Bet amount must be greater than zero"); // Ensure valid bet amount
        require(token.allowance(msg.sender, address(this)) >= amount, "Allowance too low"); // Check token allowance

        // Transfer tokens from player to contract
        token.transferFrom(msg.sender, address(this), amount);
        emit TokensDeposited(msg.sender, amount);

        // Assign player slots and start the game when two players have joined
        if (player1 == address(0)) {
            player1 = msg.sender;
        } else if (player2 == address(0)) {
            require(msg.sender != player1, "Player 1 already registered");
            player2 = msg.sender;
            betAmount = amount;
            gameStarted = true;
            emit GameStarted(player1, player2, betAmount);
        } else {
            revert("Game already has two players");
        }
    }

    // Function to declare the winner and transfer the total bet amount
    function declareWinner(address winner) public onlyPlayers {
        require(gameStarted, "Game has not started"); // Ensure game has started
        require(winner == player1 || winner == player2, "Invalid winner"); // Ensure winner is a valid player

        uint256 prizeAmount = betAmount * 2; // Calculate prize pool
        token.transfer(winner, prizeAmount); // Transfer prize to winner
        emit WinnerDeclared(winner, prizeAmount);

        // Reset the game state for the next round
        resetGame();
    }

    // Internal function to reset game state
    function resetGame() internal {
        player1 = address(0);
        player2 = address(0);
        betAmount = 0;
        gameStarted = false;
        emit GameReset();
    }

    // Function to check the contract's token balance
    function checkContractBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // Function to check a player's token balance
    function checkPlayerBalance(address player) public view returns (uint256) {
        return token.balanceOf(player);
    }
}
