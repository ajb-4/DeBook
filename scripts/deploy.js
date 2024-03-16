const { ethers } = require("hardhat");
const fs = require('fs');
const { abi } = require("../artifacts/contracts/DeBook.sol/DeBook.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/6e2153af26e340c0b0dc7c4d2e8d7829"); // Update with Sepolia RPC URL
  const privateKey = "0f9250ece3c3eab0c3c9ee22247b84af0ffcd7314b96929e7d15373704a1ab13"; // Replace with your private key on the Sepolia network

  const wallet = new ethers.Wallet(privateKey, provider);

  const DeBook = await ethers.getContractFactory("DeBook");

  const deBook = await DeBook.connect(wallet).deploy();
  await deBook.deployed();

  console.log("DeBook deployed to:", deBook.address);
  console.log("DeBook object:", deBook);

  if (abi) {
    const abiString = JSON.stringify(abi);
    fs.writeFileSync('./src/components/DeBookABI.json', abiString);
    console.log("ABI written to DeBookABI.json");
  } else {
    console.error("ABI not found in artifact.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

