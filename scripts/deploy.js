const hre = require("hardhat");

async function main() {

  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying faucet contract with account", deployer.address);


 const faucet = await hre.ethers.deployContract("Faucet");

  //await faucet.deployed();

  console.log("Faucet deployed!\nAddress: ", await faucet.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
