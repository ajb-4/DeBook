const { ethers } = require("hardhat");
const fs = require('fs');
const { abi: mockUSDCAbi } = require("../artifacts/contracts/MockUSDC.sol/MockUSDC.json");
const { abi: chainlinkConsumerABI } = require("../artifacts/contracts/ChainlinkConsumer.sol/ChainlinkConsumer.json");
const { abi: deBookABI } = require("../artifacts/contracts/DeBook.sol/DeBook.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
  const privateKey = process.env.DEBOOK_PRIVATE_KEY

  const wallet = new ethers.Wallet(privateKey, provider);
  ///
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.connect(wallet).deploy();
  await mockUSDC.deployed();

  console.log("MockUSDC deployed to:", mockUSDC.address);

  const mockUSDCAbiString = JSON.stringify(mockUSDCAbi);
  fs.writeFileSync('./src/components/MockUSDCABI.json', mockUSDCAbiString);
  console.log("MockUSDC ABI written to MockUSDCABI.json");
  
  const ChainlinkConsumer = await ethers.getContractFactory("ChainlinkConsumer");
  const chainlinkConsumer = await ChainlinkConsumer.connect(wallet).deploy({
    gasLimit: 5000000
  });
  await chainlinkConsumer.deployed();

  console.log("ChainlinkConsumer deployed to:", chainlinkConsumer.address);

  const chainlinkConsumerAbiString = JSON.stringify(chainlinkConsumerABI);
  fs.writeFileSync('./src/components/ChainlinkConsumerABI.json', chainlinkConsumerAbiString);
  console.log("ChainlinkConsumer ABI written to ChainlinkConsumerABI.json");
    ///
  const DeBook = await ethers.getContractFactory("DeBook");
  const deBook = await DeBook.connect(wallet).deploy(mockUSDC.address, chainlinkConsumer.address);
  await deBook.deployed();

  console.log("DeBook deployed to:", deBook.address);

  const deBookAbiString = JSON.stringify(deBookABI);
  fs.writeFileSync('./src/components/DeBookABI.json', deBookAbiString);
  console.log("DeBook ABI written to DeBookABI.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


