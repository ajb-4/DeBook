const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/"); // Use your local node URL or Infura URL
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Replace with your MetaMask private key

  const wallet = new ethers.Wallet(privateKey, provider);

  // Load the compiled contract artifact
  const DeBook = await ethers.getContractFactory("DeBook");

  // Deploy the contract
  const deBook = await DeBook.connect(wallet).deploy();
  await deBook.deployed();

  console.log("DeBook deployed to:", deBook.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

