// api/products/updateReview.ts

import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, review } = body;

    if (!productId || !review || !review.rating) {
      return NextResponse.json(
        { error: 'Missing required fields: productId or review data' },
        { status: 400 }
      );
    }

    // Fetch the existing product details
    const productResult = await query(
      'SELECT reviews, star_rating, review_count FROM tr_products WHERE id = $1',
      [productId]
    );

    if (productResult.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = productResult[0];
    const existingReviews = product.reviews || [];
    
    // Append new review
    const updatedReviews = [...existingReviews, review];

    // Recalculate star rating
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const updatedStarRating = totalRating / updatedReviews.length;

    // Update database
    await query(
      'UPDATE tr_products SET reviews = $1, star_rating = $2, review_count = $3 WHERE id = $4',
      [JSON.stringify(updatedReviews), updatedStarRating, updatedReviews.length, productId]
    );

    return NextResponse.json({
      message: 'Review updated successfully',
      updatedStarRating,
      updatedReviewCount: updatedReviews.length,
      updatedReviews
    });
  } catch (err) {
    console.error('Error updating review:', err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
