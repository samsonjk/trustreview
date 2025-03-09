// api/products/index.ts
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    console.log("productId : ", productId);

    if (productId) {
      // Fetch from the database
      const products = await query(
        'SELECT * FROM tr_products WHERE id = $1',
        [productId]
      );

      if (products.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json(products[0]);
    } else {
      // Fetch all active products
      const products = await query('SELECT * FROM tr_products');
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
