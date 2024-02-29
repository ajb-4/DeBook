const { ethers } = require('hardhat');
const { expect } = require('chai');

describe("DeBook contract", function () {
  let DeBook;
  let deBook;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    DeBook = await ethers.getContractFactory("DeBook");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    deBook = await DeBook.deploy();
    await deBook.deployed();
  });

  it("Should allow address one to create a wager", async function () {
    const amount = ethers.utils.parseEther("1");
    const gameId = 12345;
    const wagerType = 0;
    const margin = 10;
    const outcome = "Team A";
    
    await deBook.connect(addr1).createWager(amount, gameId, wagerType, margin, outcome);
    
    const wager = await deBook.wagers(1);
    expect(wager.creator).to.equal(addr1.address);
    expect(wager.amount.toString()).to.equal(amount.toString());
    expect(wager.gameId).to.equal(gameId);
    expect(wager.wagerType).to.equal(wagerType);
    expect(wager.margin).to.equal(margin);
    expect(wager.outcome).to.equal(outcome);
    expect(wager.isAccepted).to.equal(false);
  });

  it("Should allow address two to accept the wager with correct amount of ETH", async function () {
    const amount = ethers.utils.parseEther("1");
    const gameId = 12345;
    const wagerType = 0;
    const margin = 10;
    const outcome = "Team A";

    await deBook.connect(addr1).createWager(amount, gameId, wagerType, margin, outcome);

    const ethRequired = ethers.utils.parseEther("1");

    await expect(
      deBook.connect(addr2).acceptWager(1, { value: ethRequired })
    ).to.emit(deBook, 'WagerAccepted').withArgs(addr2.address, amount, gameId, wagerType, margin, outcome);
  });

  it("Should revert if address two does not send enough ETH to accept the wager", async function () {
    const amount = ethers.utils.parseEther("1");
    const gameId = 12345;
    const wagerType = 0;
    const margin = 10;
    const outcome = "Team A";
  
    await deBook.connect(addr1).createWager(amount, gameId, wagerType, margin, outcome);
  
    const ethRequired = ethers.utils.parseEther("1");
  
    await expect(
      deBook.connect(addr2).acceptWager(1, { value: ethRequired.sub(ethers.utils.parseEther("0.5")) })
    ).to.be.revertedWith("Incorrect wager amount");
  
    const wager = await deBook.wagers(1);
    expect(wager.acceptor).to.equal(ethers.constants.AddressZero);
    expect(wager.isAccepted).to.equal(false);
  });
});
