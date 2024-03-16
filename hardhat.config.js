require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/6e2153af26e340c0b0dc7c4d2e8d7829",
      accounts: ['0f9250ece3c3eab0c3c9ee22247b84af0ffcd7314b96929e7d15373704a1ab13'],
    },
  },
};

