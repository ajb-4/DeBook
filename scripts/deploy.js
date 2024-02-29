const { ethers } = require("hardhat");
const fs = require('fs');
const { abi } = require("../artifacts/contracts/DeBook.sol/DeBook.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/6e2153af26e340c0b0dc7c4d2e8d7829"); // Use your local node URL or Infura URL
  const privateKey = "12170a444ceec99dcea5abe34facacc8bb15f013cd13f86aa8699c530dbdaa8a"; // Replace with your MetaMask private key

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

