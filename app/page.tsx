// app/page.tsx

"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  
  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const starColor =
          product.star_rating == 0 ? "grey" :
          product.star_rating <= 2.4 ? "red" :
          product.star_rating <= 3.9 ? "orange" : "green";

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
                  fill={i < Math.round(product.star_rating) ? starColor : "none"}
                  stroke={starColor}
                  strokeWidth={1.5}
                />
              ))}
              <span className="text-gray-600 ml-2">({product.review_count})</span>
            </div>
          </Link>
        );
      })}
    </main>
  );
}
