require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/6e2153af26e340c0b0dc7c4d2e8d7829",
      accounts: ['12170a444ceec99dcea5abe34facacc8bb15f013cd13f86aa8699c530dbdaa8a'],
    },
  },
};

