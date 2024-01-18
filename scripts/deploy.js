const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/6e2153af26e340c0b0dc7c4d2e8d7829"); // Use your local node URL or Infura URL
  const privateKey = "12170a444ceec99dcea5abe34facacc8bb15f013cd13f86aa8699c530dbdaa8a"; // Replace with your MetaMask private key

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

