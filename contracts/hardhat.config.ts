/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomicfoundation/hardhat-toolbox");
require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config({path:".env"})

// const { PrivateKey } = require('./secret.json');
const PRIVATE_KEY = process.env.PRIVATE_KEY;


module.exports = {
  defaultNetwork: 'testnet',

  networks: {
     hardhat: {
     },
     testnet: {
        url: 'https://rpc.test2.btcs.network',
        accounts: [PRIVATE_KEY],
        chainId: 1114,
     }
  },
  solidity: {
     compilers: [
       {
          version: '0.8.28',
          settings: {
             evmVersion: 'paris',
             optimizer: {
                enabled: true,
                runs: 200,
             },
          },
       },
     ],
  },
};
