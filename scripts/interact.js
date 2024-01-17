const { ethers } = require('hardhat');

async function main() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/"); // Use your local node URL
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  
    const wallet = new ethers.Wallet(privateKey, provider);
  
    // Load the compiled contract artifact
    const DeBook = await ethers.getContractFactory("DeBook");
  
    // Connect to the deployed contract using its address
    const deBookAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    console.log("Connecting to contract at address:", deBookAddress);
    const deBook = DeBook.attach(deBookAddress);
  
    // Call the sayHello() function
    const result = await deBook.sayHello();
    console.log("Result from sayHello():", result);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });