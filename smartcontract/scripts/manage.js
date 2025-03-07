// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");

async function main() {


  console.log("provider url: ", hre.network.name);

  // Get the contract factory
  const ContractFactory = await hre.ethers.getContractFactory("TrustScoreReview");
  const signers = await hre.ethers.getSigners();

  const contract = ContractFactory.attach(
    //"0x865C6D38a8324d939ACC0C3e396dC1AeBEf6A042" // The deployed contract address
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"  //localhost
  );

  const productID = 3;

  // Submit Review
  await contract.submitReview(productID, 2, 'Worst product').then(data => {
    console.log('Review Submission successfully!');
  })
  
   // Fetch reviews for productId 1
   /* const reviews = await contract.getReviewsbyproductId(productID);

   console.log(`\n📦 Total Reviews for Product ID(${productID}): ${reviews.length}`);
 
   reviews.forEach((review, index) => {
     console.log(`\n📝 Review ${index + 1}:`);
     console.log(`Reviewer: ${review.reviewer}`);
     console.log(`Rating: ${review.rating.toString()}`);
     console.log(`Comment: ${review.comment}`);
     console.log(`Timestamp: ${new Date(Number(review.timestamp) * 1000).toLocaleString()}`);
   }); */


   // Fetch reviews for all products
   const reviews = await contract.getAllReviews();

   console.log(`\n📦 Total Reviews for All Products: ${reviews.length}`);
 
   reviews.forEach((review, index) => {
    
     console.log(`\n📝 Review ${index + 1}:`);
     console.log(`\n📝 Product ${review.productId}:`);
     console.log(`Reviewer: ${review.reviewer}`);
     console.log(`Rating: ${review.rating.toString()}`);
     console.log(`Comment: ${review.comment}`);
     console.log(`Timestamp: ${new Date(Number(review.timestamp) * 1000).toLocaleString()}`);
   });
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
