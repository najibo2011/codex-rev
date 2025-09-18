import { NextRequest, NextResponse } from 'next/server';
import { createSignedDownloadUrl } from '@/lib/downloads';
import { products } from '@/lib/seed-data';

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'Produit requis' }, { status: 400 });
  }
  const product = products.find((item) => item.id === productId);
  if (!product) {
    return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
  }
  const downloadBase = process.env.S3_PUBLIC_BASE_URL ?? 'https://example-bucket.s3.eu-west-3.amazonaws.com/';
  const target = createSignedDownloadUrl(product.pdfKey, `${downloadBase}${product.pdfKey}`);

  console.info('download.request', {
    productId,
    ip: request.ip,
    userAgent: request.headers.get('user-agent'),
  });

  return NextResponse.redirect(target, { status: 302 });
}
