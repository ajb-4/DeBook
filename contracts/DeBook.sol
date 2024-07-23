// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import './ChainlinkConsumer.sol'; //import

contract DeBook {

    ChainlinkConsumer public chainlinkConsumer; // declare contract

    enum WagerType { Spread, Moneyline, OverUnder }

    event WagerCreated(address indexed creator, uint256 amount, uint256 gameId, WagerType wagerType, int256 margin, string outcome);

    event WagerAccepted(address indexed acceptor, uint256 amount, uint256 gameId, WagerType wagerType, int256 margin, string outcome);

    event WagerSettled(address indexed creator, address indexed acceptor, uint256 amount, uint256 gameId, WagerType wagerType, int256 margin, string outcome, string result);

    struct Wager {
        address creator;
        uint256 amount;
        uint256 gameId;
        WagerType wagerType;
        int256 margin;
        string outcome;
        bool isAccepted;
        bool settled;
        address acceptor;
    }

    mapping(uint256 => Wager) public wagers;
    uint256 private wagerCounter;

    IERC20 public usdcToken;

    constructor(address _usdcAddress, address _chainlinkConsumer) {
        usdcToken = IERC20(_usdcAddress);
        chainlinkConsumer = ChainlinkConsumer(_chainlinkConsumer);
    }

    function getWagerCounter() external view returns (uint256) {
        return wagerCounter;
    }

    function createWager(uint256 gameId, WagerType wagerType, int256 margin, string memory outcome, uint256 usdcAmount) external {
        require(usdcAmount > 0, "Amount must be greater than 0");

        require(usdcToken.transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");

        wagerCounter++;
        Wager storage newWager = wagers[wagerCounter];
        newWager.creator = msg.sender;
        newWager.amount = usdcAmount;
        newWager.gameId = gameId;
        newWager.wagerType = wagerType;
        newWager.margin = margin;
        newWager.outcome = outcome;
        newWager.isAccepted = false;
        newWager.settled = false;

        emit WagerCreated(msg.sender, usdcAmount, gameId, wagerType, margin, outcome);
    }

    function acceptWager(uint256 wagerId) external {
        Wager storage existingWager = wagers[wagerId];
        require(!existingWager.isAccepted, "Wager has already been accepted");
        require(!existingWager.settled, "Wager has already been settled");

        require(usdcToken.transferFrom(msg.sender, address(this), existingWager.amount), "USDC transfer failed");

        existingWager.isAccepted = true;
        existingWager.acceptor = msg.sender;

        emit WagerAccepted(msg.sender, existingWager.amount, existingWager.gameId, existingWager.wagerType, existingWager.margin, existingWager.outcome);
    }

    function settleWager(uint256 wagerId) external {
        Wager storage existingWager = wagers[wagerId];
        require(existingWager.isAccepted, "Wager has not been accepted");
        require(!existingWager.settled, "Wager has already been settled");

        // Fetch the latest result from ChainlinkConsumer
        uint256 result = chainlinkConsumer.getLatestResult();

        // Add your logic here to compare the result and determine the winner
        // For simplicity, let's assume result == 1 means creator wins, result == 2 means acceptor wins
        if (result == 1) {
            require(usdcToken.transfer(existingWager.creator, existingWager.amount * 2), "USDC transfer to creator failed");
        } else if (result == 2) {
            require(usdcToken.transfer(existingWager.acceptor, existingWager.amount * 2), "USDC transfer to acceptor failed");
        }

        existingWager.settled = true;
        emit WagerSettled(existingWager.creator, existingWager.acceptor, existingWager.amount, existingWager.gameId, existingWager.wagerType, existingWager.margin, existingWager.outcome, result == 1 ? "creator wins" : "acceptor wins");
    }


    function requestWagerResult(uint256 wagerId, string memory url, string memory path) public {
        Wager storage existingWager = wagers[wagerId];
        require(existingWager.isAccepted, "Wager has not been accepted");

        chainlinkConsumer.requestData(url, path);
    }
}


