import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();
  const coupon = await prisma.coupon.create({ data });
  return NextResponse.json(coupon, { status: 201 });
}
