const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  });
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const TrustScoreReview = await ethers.getContractFactory("TrustScoreReview");
  const trustScoreReview = await TrustScoreReview.deploy("0x9c80489e37fe3ebDe2c80b80ad7f003c24044C41");

  await trustScoreReview.waitForDeployment();

  console.log("TrustScoreReview deployed to:", trustScoreReview.target);
  console.log(`Sepolia Etherscan : https://sepolia.etherscan.io/address/${trustScoreReview.target}`)

  // Delay for Verification
  await sleep(45 * 1000);

  // Code for Verification
  console.log("Contract Verification Started...");
  hre.run("verify:verify", {
    address: trustScoreReview.target,
    constructorArguments: ['0x9c80489e37fe3ebDe2c80b80ad7f003c24044C41']
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
