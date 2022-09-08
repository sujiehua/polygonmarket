require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789"
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

module.exports = {
  defaultNetwork: "ganache",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    ganache: {
      url: 'http://127.0.0.1:7545',
      accounts: [`0x` + privateKey]
    },
    // localhost: {
    //   url: "http://127.0.0.1:7545"
    // },
    hardhat: {
      chainId: 1337
    },

    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      // url: "https://rpc-mumbai.matic.today",
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [privateKey]
    },

    polygon: {
      url: "https://polygon-mainnet.infura.io/v3/55f8ea63e7b74567a0e1c90cd6a8258c",
      accounts: ['6bf993df4e29426fd6863db11194acf6a1e4b08a2ba49c4d52449ca124c78572'],
    },

    mainnet: {
     // Infura
     url: `https://mainnet.infura.io/v3/55f8ea63e7b74567a0e1c90cd6a8258c`,
     // url: "https://polygon-rpc.com",
     accounts: ['0x6bf993df4e29426fd6863db11194acf6a1e4b08a2ba49c4d52449ca124c78572']
     //  httpHeaders: {
     //    "jsonrpc":"2.0",
     //    "method":"eth_blockNumber",
     //    "params":[],
     //    "id":1
     //  }
     // accounts: [process.env.privateKey]
   }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

