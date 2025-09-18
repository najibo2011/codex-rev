import { NextResponse } from 'next/server';
import { createCheckoutSession, findCouponId } from '@/lib/stripe';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  let payload: any = {};
  if (contentType.includes('application/json')) {
    payload = await request.json();
  } else {
    const form = await request.formData();
    payload = Object.fromEntries(form.entries());
  }

  const coupon = typeof payload.coupon === 'string' ? findCouponId(payload.coupon) : undefined;

  try {
    if (payload.productId) {
      const session = await createCheckoutSession({ type: 'product', productId: payload.productId, coupon });
      return respond(session, contentType);
    }
    if (payload.bundleId) {
      const session = await createCheckoutSession({ type: 'bundle', bundleId: payload.bundleId, coupon });
      return respond(session, contentType);
    }
    if (payload.subscriptionId) {
      const session = await createCheckoutSession({ type: 'subscription', coupon });
      return respond(session, contentType);
    }
    return NextResponse.json({ error: 'Type de checkout inconnu' }, { status: 400 });
  } catch (error: unknown) {
    console.error('[checkout]', error);
    return NextResponse.json({ error: 'Impossible de créer la session de paiement' }, { status: 500 });
  }
}

function respond(session: { id: string; url?: string | null }, contentType: string) {
  if (!session.url) {
    return NextResponse.json({ id: session.id });
  }
  if (!contentType || contentType.includes('application/x-www-form-urlencoded')) {
    return NextResponse.redirect(session.url, { status: 303 });
  }
  return NextResponse.json({ id: session.id, url: session.url });
}
