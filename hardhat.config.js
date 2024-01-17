require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
};

module.exports = {
  networks: {
    goerli: {
      url: "http://localhost:8545",
      accounts: [],
    },
  },
  solidity: {
    version: "0.8.0",
    compilers: [
      {
        version: "0.8.0",
      },
    ],
  },  
};