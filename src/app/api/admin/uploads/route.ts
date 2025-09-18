import { NextResponse } from 'next/server';
import { createPresignedUpload } from '@/lib/s3';

export async function POST(request: Request) {
  const { key, contentType } = await request.json();
  if (!key || !contentType) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }
  if (!process.env.S3_BUCKET) {
    return NextResponse.json({ error: 'S3 non configuré' }, { status: 500 });
  }
  const url = await createPresignedUpload({ bucket: process.env.S3_BUCKET, key });
  return NextResponse.json({ url });
}
