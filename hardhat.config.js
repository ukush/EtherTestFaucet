require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_URL= process.env.ALCHEMY_URL;
const SEPOLIA_PRIVATE_KEY= process.env.SEPOLIA_KEY;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
   networks: {
    sepolia: {
      url: ALCHEMY_API_URL,
      accounts: [`0x${SEPOLIA_PRIVATE_KEY}`]
    }
  }

};
