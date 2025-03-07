// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TrustScoreReview is ERC20, Ownable {
    constructor(
        address initialOwner
    ) ERC20("TrustScoreReview", "TSR") Ownable(initialOwner) {}

    struct Review {
        uint256 reviewId;
        address reviewer;
        uint256 productId;
        uint256 rating; // 1 to 5 stars
        string comment;
        uint256 timestamp;
    }

    // Product => List of Reviews
    mapping(uint256 => Review[]) public reviews;

    // User => Trust Score
    mapping(address => uint256) public trustScore;

    // Review ID counter (simple incrementer)
    uint256 private _reviewIdCounter = 0;

    uint256[] private productIds;

    // Event to track review submissions
    event ReviewSubmitted(
        uint256 reviewId,
        address indexed reviewer,
        uint256 productId,
        uint256 rating,
        string comment
    );

    function submitReview(
        uint256 productId,
        uint256 rating,
        string memory comment
    ) external returns (uint256 reviewId) {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        // Generate unique reviewId
        reviewId = _reviewIdCounter++;

        if (reviews[productId].length == 0) {
            productIds.push(productId); //  Add product ID if it's the first review
        }

        // Add review
        reviews[productId].push(
            Review(
                reviewId,
                msg.sender,
                productId,
                rating,
                comment,
                block.timestamp
            )
        );

        // Update Trust Score
        trustScore[msg.sender] += rating;

        // Emit event with reviewId
        emit ReviewSubmitted(reviewId, msg.sender, productId, rating, comment);

        return reviewId;
    }

    // @notice Get all reviews for a product
    function getReviewsbyproductId(
        uint256 productId
    ) external view returns (Review[] memory) {
        return reviews[productId];
    }

    /// function to get all reviews
    function getAllReviews() external view returns (Review[] memory allReviews) {
        uint256 totalReviewCount = 0;

        // Count total reviews
        for (uint256 i = 0; i < productIds.length; i++) {
            totalReviewCount += reviews[productIds[i]].length;
        }

        allReviews = new Review[](totalReviewCount);
        uint256 index = 0;

        // Collect all reviews
        for (uint256 i = 0; i < productIds.length; i++) {
            Review[] memory productReviews = reviews[productIds[i]];
            for (uint256 j = 0; j < productReviews.length; j++) {
                allReviews[index] = productReviews[j];
                index++;
            }
        }
    }

}
