"use client";

import { useState } from "react";
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { WalletClient } from "viem";

export default function ReviewForm({
  productId,
  onReviewSubmitted,
}: {
  productId: number;
  onReviewSubmitted: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const { data: walletClient } = useWalletClient();

  async function getSignerFromWalletClient(walletClient: WalletClient) {
    const ethersProvider = new ethers.BrowserProvider(walletClient.transport);
    return ethersProvider.getSigner();
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      if (!walletClient) {
        alert("Connect your wallet!");
        setIsPending(false);
        return;
      }

      const signer = await getSignerFromWalletClient(walletClient);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.submitReview(BigInt(productId), BigInt(rating), comment);
      const receipt = await tx.wait();

      console.log("Transaction successful:", receipt.hash);

      // Fetch latest review details
      const reviews = await contract.getReviewsbyproductId(productId);
      const latestReview = reviews[reviews.length - 1];

      const review = {
        reviewId: Number(latestReview.reviewId),
        rating,
        comment,
        reviewer: await signer.getAddress(),
        timestamp: Math.floor(Date.now() / 1000), // Unix timestamp
        txnId: tx.hash,
      };

      // Update backend database via API
      const response = await fetch("/api/products/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, review }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product review");
      }

      console.log("Review updated in database");
      setRating(5);
      setComment("");
      setIsSuccess(true);
      onReviewSubmitted(); // ✅ Refresh reviews
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={submitReview} className="space-y-4">
      <div>
        <label>Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {star}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isPending ? "Transaction in Progress..." : "Submit Review"}
      </button>
      {isSuccess && <p className="text-green-600">Review submitted successfully!</p>}
      {isError && <p className="text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}
