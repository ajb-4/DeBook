// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeBook {
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
        address acceptor;
    }

    mapping(uint256 => Wager) public wagers;

    uint256 private wagerCounter;

    function getWagerCounter() external view returns (uint256) {
        return wagerCounter;
    }

    function createWager(uint256 gameId, WagerType wagerType, int256 margin, string memory outcome) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        uint256 amount = msg.value;
        wagerCounter++;
        Wager storage newWager = wagers[wagerCounter];
        newWager.creator = msg.sender;
        newWager.amount = amount;
        newWager.gameId = gameId;
        newWager.wagerType = wagerType;
        newWager.margin = margin;
        newWager.outcome = outcome;
        newWager.isAccepted = false;

        emit WagerCreated(msg.sender, amount, gameId, wagerType, margin, outcome);
    }

    function acceptWager(uint256 wagerId) external payable {
        Wager storage existingWager = wagers[wagerId];
        require(!existingWager.isAccepted, "Wager has already been accepted");
        require(msg.value == existingWager.amount, "Incorrect wager amount");

        existingWager.isAccepted = true;
        existingWager.acceptor = msg.sender;

        emit WagerAccepted(msg.sender, existingWager.amount, existingWager.gameId, existingWager.wagerType, existingWager.margin, existingWager.outcome);
    }

    function settleWager(uint256 wagerId, string memory result) external {
    Wager storage existingWager = wagers[wagerId];
    require(existingWager.isAccepted, "Wager has not been accepted");

    require(keccak256(bytes(result)) == keccak256(bytes(existingWager.outcome)), "Invalid outcome");

    // Compare the actual outcome with the wager outcome
    if (keccak256(bytes(result)) == keccak256(bytes(existingWager.outcome))) {
        // If the outcomes match, transfer funds to the creator
        payable(existingWager.creator).transfer(existingWager.amount);
    } else {
        // If the outcomes don't match, transfer funds to the acceptor
        payable(existingWager.acceptor).transfer(existingWager.amount);
    }

    // Emit event to indicate the wager has been settled
    emit WagerSettled(existingWager.creator, existingWager.acceptor, existingWager.amount, existingWager.gameId, existingWager.wagerType, existingWager.margin, existingWager.outcome, result);
    }
}
