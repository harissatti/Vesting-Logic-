require("@nomicfoundation/hardhat-toolbox");
// require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const { API_URL, PRIVATE_KEY,ETHERSCAN } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  paths:{
    artifacts:"./src/artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
     hardhat: {},
     goerli : { 
         url: API_URL,
         accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
     apiKey: ETHERSCAN
   },
    //   gasReporter: {
    //     enabled: true,
    //     currency: 'USD',
    //     coinmarketcap:process.env.ETHERSCAN_API_KEY,
    //   },
};
