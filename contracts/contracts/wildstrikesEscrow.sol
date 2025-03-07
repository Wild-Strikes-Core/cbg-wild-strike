// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract WildStrike {
    using SafeERC20 for IERC20;

    struct Match {
        address player1;
        address player2;
        address winner;
        uint256 betAmount;
        bool finished;
        uint256 depositDeadline; // New: Timeout for deposits
    }

    mapping(uint256 => Match) public matches;
    mapping(uint256 => mapping(address => bool)) public hasDeposited;
    uint256 public numberOfMatches;
    IERC20 public token;

    event MatchCreated(uint256 matchId, address player1, address player2, uint256 betAmount);
    event BetDeposited(uint256 matchId, address player, uint256 amount);
    event MatchFinished(uint256 matchId, address winner, uint256 prizeAmount);
    event DepositRefunded(uint256 matchId, address player, uint256 amount);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function createMatch(address player2, uint256 betAmount) external {
        require(player2 != address(0), "Invalid player2");
        require(player2 != msg.sender, "Cannot play against yourself");
        require(betAmount > 0, "Bet amount must be > 0");

        matches[numberOfMatches] = Match({
            player1: msg.sender,
            player2: player2,
            winner: address(0),
            betAmount: betAmount,
            finished: false,
            depositDeadline: block.timestamp + 60 seconds // 1 minute deposit window
        });

        emit MatchCreated(numberOfMatches, msg.sender, player2, betAmount);
        numberOfMatches++;
    }

    function depositBet(uint256 matchId) external {
        require(matchId < numberOfMatches, "Invalid match ID");
        Match storage _match = matches[matchId];
        require(block.timestamp <= _match.depositDeadline, "Deposit period expired");
        require(msg.sender == _match.player1 || msg.sender == _match.player2, "Unauthorized");
        require(!hasDeposited[matchId][msg.sender], "Already deposited");

        token.safeTransferFrom(msg.sender, address(this), _match.betAmount);
        hasDeposited[matchId][msg.sender] = true;
        emit BetDeposited(matchId, msg.sender, _match.betAmount);
    }

    function finishMatch(uint256 matchId, address winner) external {
        require(matchId < numberOfMatches, "Invalid match ID");
        Match storage _match = matches[matchId];
        require(!_match.finished, "Match finished");
        require(hasDeposited[matchId][_match.player1] && hasDeposited[matchId][_match.player2], "Deposits missing");
        require(winner == _match.player1 || winner == _match.player2, "Invalid winner");


        _match.winner = winner;
        _match.finished = true;
        uint256 prizeAmount = _match.betAmount * 2;
        token.safeTransfer(winner, prizeAmount);
        emit MatchFinished(matchId, winner, prizeAmount);
    }

    function refundDeposit(uint256 matchId) external {
        require(matchId < numberOfMatches, "Invalid match ID");
        Match storage _match = matches[matchId];
        require(block.timestamp > _match.depositDeadline, "Deposit period active");
        require(!_match.finished, "Match finished");
        require(msg.sender == _match.player1 || msg.sender == _match.player2, "Unauthorized");

        bool player1Deposited = hasDeposited[matchId][_match.player1];
        bool player2Deposited = hasDeposited[matchId][_match.player2];
        require(!(player1Deposited && player2Deposited), "Both deposited");

        if (msg.sender == _match.player1 && player1Deposited) {
            token.safeTransfer(_match.player1, _match.betAmount);
        } else if (msg.sender == _match.player2 && player2Deposited) {
            token.safeTransfer(_match.player2, _match.betAmount);
        } else {
            revert("No deposit to refund");
        }
        emit DepositRefunded(matchId, msg.sender, _match.betAmount);
    }
}