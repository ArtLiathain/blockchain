import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("ScamToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const name = "Scam Token";
    const symbol = "SCAM";
    const decimals = 0;
    const initialSupply = 1000;
    const ScamToken = await ethers.getContractFactory("ScamToken");
    const scamToken = await ScamToken.deploy(
      name,
      symbol,
      decimals,
      initialSupply
    );

    const [owner, tester] = await ethers.getSigners();
    console.log("Signer 1 address: ", owner.address);
    return { scamToken, owner, tester };
  }

  it("should deploy and have most of the tokens on the contract", async function () {
    const { scamToken, owner } = await loadFixture(
      deployContractAndSetVariables
    );
    expect(await scamToken.balanceOf(scamToken.target)).to.equal(
      Number(await scamToken.totalSupply()) - 10
    );
    expect(await scamToken.balanceOf(owner.address)).to.equal(10);
  });
  it("should buy 10 tokens", async () => {
    const { scamToken, owner } = await loadFixture(
      deployContractAndSetVariables
    );
    const initialBalance = await scamToken.balanceOf(owner.address);
    const ethAmountToSend = Number(await scamToken.tokenCost()) * 10;

    await scamToken.connect(owner).buyToken({ value: ethAmountToSend });
    expect(await scamToken.balanceOf(owner.address)).to.equal(
      Number(initialBalance) + 10
    );
  });
  it("should transfer 10 tokens", async () => {
    const { scamToken, owner, tester } = await loadFixture(
      deployContractAndSetVariables
    );
    const ownerInitialBalance = await scamToken.balanceOf(owner.address);
    const testerInitialBalance = await scamToken.balanceOf(tester.address);
    await scamToken.connect(owner).transfer(tester.address, 10);
    expect(await scamToken.balanceOf(owner.address)).to.equal(
      Number(ownerInitialBalance) - 10
    );
    expect(await scamToken.balanceOf(tester.address)).to.equal(
      Number(testerInitialBalance) + 10
    );
  });
  it("should burn 10 tokens", async () => {
    const { scamToken, owner, tester } = await loadFixture(
      deployContractAndSetVariables
    );
    const ownerInitialBalance = await scamToken.balanceOf(owner.address);
    const contractTotalSupply = await scamToken.totalSupply();
    await scamToken.connect(owner).burn(10);
    expect(await scamToken.balanceOf(owner.address)).to.equal(
      Number(ownerInitialBalance) - 10
    );
    expect(await scamToken.totalSupply()).to.equal(
      Number(contractTotalSupply) - 10
    );
  });
  it("should refund 5 tokens after buying 10", async () => {
    const { scamToken, owner, tester } = await loadFixture(
      deployContractAndSetVariables
    );
    const ownerInitialTokenBalance = await scamToken.balanceOf(owner.address);

    const ethAmountToSend = Number(await scamToken.tokenCost()) * 10;

    await scamToken.connect(owner).buyToken({ value: ethAmountToSend });
    expect(await scamToken.balanceOf(owner.address)).to.equal(
      Number(ownerInitialTokenBalance) + 10
    );
    const ownerInitialEthBalance = await ethers.provider.getBalance(
      owner.address
    );
    await scamToken.connect(owner).refundToken(5);
    expect(await scamToken.balanceOf(owner.address)).to.equal(
      Number(ownerInitialTokenBalance) + 5
    );
    expect(
      Number(await ethers.provider.getBalance(owner.address))
    ).to.greaterThan(Number(ownerInitialEthBalance));
  });
});
