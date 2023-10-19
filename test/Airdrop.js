const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployAirdropLockFixture() {
    const [owner, account2, account3] = await ethers.getSigners();

    const Simba = await ethers.getContractFactory("Simba");
    const simba = await Simba.deploy();

    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy(simba.target);

    return { simba, airdrop, owner, account2, account3 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { airdrop, owner } = await loadFixture(deployAirdropLockFixture);

      expect(await airdrop.runner.address).to.equal(owner.address);
    });
    it("Should set the right airdrop contract", async function () {
      const { airdrop, simba } = await loadFixture(deployAirdropLockFixture);

      expect(await airdrop.tokenAddr()).to.equal(simba.target);
    });
    it("Should update new token address", async () => {
      const { airdrop } = await loadFixture(deployAirdropLockFixture);

      const Simba = await ethers.getContractFactory("Simba");
      const simba = await Simba.deploy();

      await airdrop.updateTokenAddress(simba.target);
      expect(await airdrop.tokenAddr()).to.equal(simba.target);
    });
    it("should drop tokens", async () => {
      const { airdrop, account2, account3, owner, simba } = await loadFixture(
        deployAirdropLockFixture
      );

      await simba.transferSome(simba.target, airdrop.target, 1000);
      expect(await simba.balanceOf(airdrop.target)).to.equal(1000);

      const beforeBalanceOfAirdrop = await simba.balanceOf(airdrop.target);

      await airdrop
        .connect(owner)
        .dropTokens([account2.address, account3.address], [100, 100]);

      const afterBalanceOfAirdrop = await simba.balanceOf(airdrop.target);

      expect(beforeBalanceOfAirdrop - afterBalanceOfAirdrop).to.equal(200);
      expect(await simba.balanceOf(account2.address)).to.equal(100);
      expect(await simba.balanceOf(account3.address)).to.equal(100);
    });
  });
});
