"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ReviewForm from "@/components/ReviewForm";

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { address } = useAccount();

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/product?productId=${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchProduct();
  }, [productId]);

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return "text-red-500";
    if (rating === 3) return "text-orange-500";
    return "text-green-500";
  };

  if (loading) return <div className="p-8">Loading product details...</div>;
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
        {product.reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="border p-4 rounded">
                <p>
                  <strong>Rating:</strong>{" "}
                  <span className={getRatingColor(review.rating)}>
                    {"★".repeat(review.rating)}
                  </span>
                </p>
                <p>
                  <strong>Comment:</strong> {review.comment}
                </p>
                <p className="text-sm text-gray-500">
                  By: {review.reviewer} at{" "}
                  {isClient ? new Date(review.timestamp * 1000).toLocaleString() : "Loading..."}
                </p>
                {review.txnId && (
                  <p className="text-sm text-blue-600">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${review.txnId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View Transaction
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Submit a Review</h2>
        {address ? (
          <ReviewForm productId={product.id} onReviewSubmitted={() => fetchProduct()} />
        ) : (
          <p>Please connect your wallet to submit a review.</p>
        )}
      </section>
    </main>
  );
}
