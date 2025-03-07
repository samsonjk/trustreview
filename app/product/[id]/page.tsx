"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { products } from "@/lib/products";
import ReviewForm from "@/components/ReviewForm";
import { ethers, AlchemyProvider } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { useCallback } from "react";

type ContractReview = {
  reviewId: number;
  rating: number;
  comment: string;
  reviewer: string;
  timestamp: number;
};

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);

  const product = products.find((p) => p.id === productId);

  const [reviews, setReviews] = useState<ContractReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const { address } = useAccount();

  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const provider = new AlchemyProvider("sepolia", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const reviewsData = await contract.getReviewsbyproductId(productId);
      setReviews(reviewsData);
    } catch (error) {
      console.log("Fetch Error", error);
    } finally {
      setLoadingReviews(false);
    }
  }, [productId]);


  useEffect(() => {
    setIsClient(true);
    fetchReviews();
  }, [fetchReviews]);


  const getRatingColor = (rating: number) => {
    if (rating <= 2) return "text-red-500";
    if (rating === 3) return "text-orange-500";
    return "text-green-500";
  };

  if (!product) return <div className="p-8">Product not found.</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={400}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-gray-600">{product.description}</p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => {
              // Find the txnId (transaction hash) from the product's reviews array
              const productReview = product.reviews.find(
                (r) => r.reviewId === Number(review.reviewId)
              );

              const txnHash = productReview?.txnId;

              return (
                <div key={index} className="border p-4 rounded">
                  <p>
                    <strong>Rating:</strong>{" "}
                    <span className={getRatingColor(Number(review.rating))}>
                      {"★".repeat(Number(review.rating))}
                    </span>
                  </p>
                  <p>
                    <strong>Comment:</strong> {review.comment}
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {review.reviewer} at{" "}
                    {isClient ? new Date(Number(review.timestamp) * 1000).toLocaleString() : "Loading..."}
                  </p>
                  {txnHash &&
                    <p className="text-sm text-blue-600">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${txnHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        View Transaction
                      </a>
                    </p>
                  }
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Submit a Review</h2>
        {address ? (
          <ReviewForm productId={product.id} onReviewSubmitted={fetchReviews} />
        ) : (
          <p>Please connect your wallet to submit a review.</p>
        )}
      </section>
    </main>
  );
}
