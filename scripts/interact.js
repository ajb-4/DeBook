const { ethers } = require('hardhat');

async function main() {
    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/6e2153af26e340c0b0dc7c4d2e8d7829");
    const privateKey = "12170a444ceec99dcea5abe34facacc8bb15f013cd13f86aa8699c530dbdaa8a";
  
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