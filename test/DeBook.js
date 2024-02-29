const { ethers } = require("hardhat");

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
    const description = "Test wager";
    
    await deBook.connect(addr1).createWager(amount, description);
    
    const wager = await deBook.wagers(1);
    assert.equal(wager.creator, addr1.address, "Incorrect creator");
    assert.equal(wager.amount.toString(), amount.toString(), "Incorrect amount");
    assert.equal(wager.description, description, "Incorrect description");
    assert.equal(wager.isAccepted, false, "Wager should not be accepted");
  });

  it("Should allow address two to accept the wager", async function () {
    const amount = ethers.utils.parseEther("1");
    const description = "Test wager";

    await deBook.connect(addr1).createWager(amount, description);
    await deBook.connect(addr2).acceptWager(1, { value: amount });

    const wager = await deBook.wagers(1);
    assert.equal(wager.acceptor, addr2.address, "Incorrect acceptor");
    assert.equal(wager.isAccepted, true, "Wager should be accepted");
  });
});