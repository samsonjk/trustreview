// app/page.tsx

"use client";

import { products } from "@/lib/products";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProvider } from "@/lib/alchemy";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { ethers } from "ethers";

// Define the review type at the top or above the component
type ContractReviews = {
  productId: number;
  rating: number;
};


export default function HomePage() {

  const [reviewsData, setReviewsData] = useState<{
    [productId: number]: { totalRating: number; reviewCount: number };
  }>({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const provider = getProvider();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const allReviews = await contract.getAllReviews();

        const reviewStats: { [productId: number]: { totalRating: number; reviewCount: number } } = {};

        allReviews.forEach((review: ContractReviews) => {
          const productId = Number(review.productId);
          const rating = Number(review.rating);

          if (!reviewStats[productId]) {
            reviewStats[productId] = { totalRating: 0, reviewCount: 0 };
          }

          reviewStats[productId].totalRating += rating;
          reviewStats[productId].reviewCount += 1;
        });

        setReviewsData(reviewStats);
      } catch (error: unknown){
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);
  
  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const stats = reviewsData[product.id] || { totalRating: 0, reviewCount: 0 };
        const averageRating =
          stats.reviewCount > 0 ? stats.totalRating / stats.reviewCount : 0;

        return (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-lg object-cover mb-4"
              unoptimized
            />
            <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(averageRating) ? "gold" : "none"}
                  stroke="gold"
                  strokeWidth={1.5}
                />
              ))}
              <span className="text-gray-600 ml-2">
                ({stats.reviewCount})
              </span>
            </div>
          </Link>
        );
      })}
    </main>
  );
}
