const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet contract", function() {

    this.beforeEach(async function() {
        // deploy the contract and get the instance
        faucet = await ethers.deployContract("Faucet");
    })


    it("Deployed contract should have a balance of zero", async function () {
        // call the getBalance method from the facuet contract and log it
        const faucetBalance = await faucet.getFaucetBalance();
        console.log("Balance of Faucet is: ", faucetBalance);

        expect(await faucetBalance).to.equal(0);
    });

    it("Deployed contract should have a correct balance when it receives funds", async function () {
        // define the amount to fund the faucet with
        const funds = ethers.parseEther("0.5");
        // retreive a Ethereum address
        const [owner] = await ethers.getSigners();

        // make a transaction to the faucet to fund it
        await owner.sendTransaction({
            to: faucet.getAddress(),
            value: funds
        });
        
        // get the balance and log it
        const faucetBalance = await faucet.getFaucetBalance();
        console.log("Balance of Faucet is: ", faucetBalance);

        expect(await faucetBalance).to.equal(funds);
    });

    it("Withdraw from the faucet contract", async function () {
        // define the amount to fund the faucet with
        const funds = ethers.parseEther("0.5");
       
        // Get an account
        const [owner] = await ethers.getSigners();
        
        // make a transaction to the faucet to fund it
        await owner.sendTransaction({
            to: faucet.getAddress(),
            value: funds
        });
        
        // call the withdraw method
        await faucet.withdraw();
        console.log("Attempting to withdraw from Faucet");

        const faucetBalance = await faucet.getFaucetBalance();
        console.log("Balance of Faucet is: ", faucetBalance);

        expect(await faucetBalance).to.equal(funds - ethers.parseEther("0.001"));
    });

    it("revert when trying to withdraw too soon", async function () {
        // define the amount to fund the faucet with
        const funds = ethers.parseEther("0.5");
       
        // Get an account
        const [owner] = await ethers.getSigners();
        
        // make a transaction to the faucet to fund it
        await owner.sendTransaction({
            to: faucet.getAddress(),
            value: funds
        });
        
        // call the withdraw method
        await faucet.withdraw();
        console.log("Attempting to withdraw from Faucet");
         
        // second withdraw call should be reverted 
        expect(await await faucet.withdraw()).to.be.revertedWith("You're only allowed 1 request per 24 hours. Come back tomorrow.");
    });
});