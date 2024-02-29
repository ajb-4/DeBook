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
    
    await deBook.connect(addr1).createWager(amount, gameId, wagerType, margin);
    
    const wager = await deBook.wagers(1);
    expect(wager.creator).to.equal(addr1.address);
    expect(wager.amount.toString()).to.equal(amount.toString());
    expect(wager.gameId).to.equal(gameId);
    expect(wager.wagerType).to.equal(wagerType);
    expect(wager.margin).to.equal(margin);
    expect(wager.isAccepted).to.equal(false);
  });

  it("Should allow address two to accept the wager", async function () {
    const amount = ethers.utils.parseEther("1");
    const gameId = 12345;
    const wagerType = 0;
    const margin = 10;

    await deBook.connect(addr1).createWager(amount, gameId, wagerType, margin);
    await deBook.connect(addr2).acceptWager(1, { value: amount });

    const wager = await deBook.wagers(1);
    expect(wager.acceptor).to.equal(addr2.address);
    expect(wager.isAccepted).to.equal(true);
  });
});
