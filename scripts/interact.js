const { ethers } = require('hardhat');

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
    const privateKey = process.env.DEBOOK_PRIVATE_KEY;
  
    const wallet = new ethers.Wallet(privateKey, provider);
  
    // Load the compiled contract artifact
    const DeBook = await ethers.getContractFactory("DeBook");
  
    // Connect to the deployed contract using its address
    const deBookAddress = process.env.REACT_APP_DEBOOK_CONTRACT_ADDRESS;
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