// api/products/index.ts
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';

const CACHE_KEY_ALL_PRODUCTS = 'products';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    console.log("productId : ", productId);

    if (productId) {
      const cacheKey = `product_${productId}`;
      // Check cache for specific product
      const cachedProduct = getCache(cacheKey);
      if (cachedProduct) {
        return NextResponse.json(cachedProduct);
      }

      // Fetch from the database
      const products = await query(
        'SELECT * FROM tr_products WHERE id = $1',
        [productId]
      );

      if (products.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const product = products[0];

      // Cache the product
      setCache(cacheKey, product);

      return NextResponse.json(product);
    } else {
      // Check cache for all products
      const cachedProducts = getCache(CACHE_KEY_ALL_PRODUCTS);
      if (cachedProducts) {
        return NextResponse.json(cachedProducts);
      }

      // Fetch all active products
      const products = await query(
        'SELECT * FROM tr_products'
      );

      // Cache the result
      setCache(CACHE_KEY_ALL_PRODUCTS, products);

      return NextResponse.json(products);
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json(
      { error: 'Failed to fetch product(s)' },
      { status: 500 }
    );
  }
}
