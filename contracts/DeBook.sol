// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeBook {
    enum WagerType { Spread, Moneyline, OverUnder }

    event WagerCreated(address indexed creator, uint256 amount, uint256 gameId, WagerType wagerType, int256 margin);

    event WagerAccepted(address indexed acceptor, uint256 amount, uint256 gameId, WagerType wagerType, int256 margin);

    event WagerSettled(address indexed creator, address indexed acceptor, uint256 amount, uint256 gameId, WagerType wagerType, int256 margin, string result);

    struct Wager {
        address creator;
        uint256 amount;
        uint256 gameId;
        WagerType wagerType;
        int256 margin;
        bool isAccepted;
        address acceptor;
    }

    mapping(uint256 => Wager) public wagers;

    uint256 private wagerCounter;

    function createWager(uint256 amount, uint256 gameId, WagerType wagerType, int256 margin) external {
        wagerCounter++;
        Wager storage newWager = wagers[wagerCounter];
        newWager.creator = msg.sender;
        newWager.amount = amount;
        newWager.gameId = gameId;
        newWager.wagerType = wagerType;
        newWager.margin = margin;
        newWager.isAccepted = false;

        emit WagerCreated(msg.sender, amount, gameId, wagerType, margin);
    }

    function acceptWager(uint256 wagerId) external payable {
        Wager storage existingWager = wagers[wagerId];
        require(!existingWager.isAccepted, "Wager has already been accepted");
        require(msg.value == existingWager.amount, "Incorrect wager amount");

        existingWager.isAccepted = true;
        existingWager.acceptor = msg.sender;

        emit WagerAccepted(msg.sender, existingWager.amount, existingWager.gameId, existingWager.wagerType, existingWager.margin);
    }

    // Placeholder function for settling the wager (to be implemented later)
    function settleWager(uint256 wagerId, string memory result) external {
        Wager storage existingWager = wagers[wagerId];
        require(existingWager.isAccepted, "Wager has not been accepted");

        // Placeholder logic for settling the wager
        // This function can be extended with the actual settlement logic
        // For example, transferring funds to the winning party, etc.

        emit WagerSettled(existingWager.creator, existingWager.acceptor, existingWager.amount, existingWager.gameId, existingWager.wagerType, existingWager.margin, result);
    }
}
