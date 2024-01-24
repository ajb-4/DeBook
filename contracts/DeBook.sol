// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeBook {
    // Event emitted when a user creates a wager
    event WagerCreated(address indexed creator, uint256 amount, string description);

    // Event emitted when a user accepts a wager
    event WagerAccepted(address indexed acceptor, uint256 amount, string description);

    // Placeholder event for settling the wager
    event WagerSettled(address indexed creator, address indexed acceptor, uint256 amount, string description, string result);

    // Need to change the description to margin, type, and value
    struct Wager {
        address creator;
        uint256 amount;
        string description;
        bool isAccepted;
        address acceptor;
    }

    // Mapping to store wagers by a unique identifier
    mapping(uint256 => Wager) public wagers;

    // Counter for generating unique identifiers for wagers
    uint256 private wagerCounter;

    // Function to create a new wager
    function createWager(uint256 amount, string memory description) external {
        wagerCounter++;
        Wager storage newWager = wagers[wagerCounter];
        newWager.creator = msg.sender;
        newWager.amount = amount;
        newWager.description = description;
        newWager.isAccepted = false;

        // Emit event for wager creation
        emit WagerCreated(msg.sender, amount, description);
    }

    // Function to accept a wager
    function acceptWager(uint256 wagerId) external payable {
        Wager storage existingWager = wagers[wagerId];
        require(!existingWager.isAccepted, "Wager has already been accepted");
        require(msg.value == existingWager.amount, "Incorrect wager amount");

        existingWager.isAccepted = true;
        existingWager.acceptor = msg.sender;

        // Emit event for wager acceptance
        emit WagerAccepted(msg.sender, existingWager.amount, existingWager.description);
    }

    // Placeholder function for settling the wager (to be implemented later)
    function settleWager(uint256 wagerId, string memory result) external {
        Wager storage existingWager = wagers[wagerId];
        require(existingWager.isAccepted, "Wager has not been accepted");

        // Placeholder logic for settling the wager
        // This function can be extended with the actual settlement logic
        // For example, transferring funds to the winning party, etc.

        // Emit event for settling the wager
        emit WagerSettled(existingWager.creator, existingWager.acceptor, existingWager.amount, existingWager.description, result);
    }
}