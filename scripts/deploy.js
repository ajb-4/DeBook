const { ethers } = require("hardhat");
const fs = require('fs');
const { abi: deBookABI } = require("../artifacts/contracts/DeBook.sol/DeBook.json");
const { abi: mockUSDCAbi } = require("../artifacts/contracts/MockUSDC.sol/MockUSDC.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/6e2153af26e340c0b0dc7c4d2e8d7829");
  const privateKey = "0f9250ece3c3eab0c3c9ee22247b84af0ffcd7314b96929e7d15373704a1ab13";

  const wallet = new ethers.Wallet(privateKey, provider);

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.connect(wallet).deploy();
  await mockUSDC.deployed();

  console.log("MockUSDC deployed to:", mockUSDC.address);

  const mockUSDCAbiString = JSON.stringify(mockUSDCAbi);
  fs.writeFileSync('./src/components/MockUSDCABI.json', mockUSDCAbiString);
  console.log("MockUSDC ABI written to MockUSDCABI.json");

  const DeBook = await ethers.getContractFactory("DeBook");
  const deBook = await DeBook.connect(wallet).deploy(mockUSDC.address);
  await deBook.deployed();

  console.log("DeBook deployed to:", deBook.address);
  console.log("DeBook object:", deBook);

  // Write DeBook ABI to a file
  const deBookAbiString = JSON.stringify(deBookABI);
  fs.writeFileSync('./src/components/DeBookABI.json', deBookAbiString);
  console.log("DeBook ABI written to DeBookABI.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


