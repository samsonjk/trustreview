require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "sepolia",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/CdnHqBsCMeTWaZCfS3F6_70nD6xQlDJx",
      accounts: ["ae03d6c39241e5373b46dec0d5714259e8a9d3fac14f8d2b42bcf2d3143b36c2"],
      chainId: 11155111,
      gasPrice: 8000000000,
    },
    hardhat: {
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
