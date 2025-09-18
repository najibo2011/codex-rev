import crypto from 'crypto';

export interface SignedUrlPayload {
  key: string;
  expiresAt: number;
}

const DEFAULT_TTL = 60 * 60 * 24; // 24h

function getSecret() {
  return process.env.DOWNLOAD_SIGNING_SECRET ?? 'local-secret-key';
}

export function createSignedDownloadUrl(key: string, baseUrl: string, ttlSeconds = DEFAULT_TTL) {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${key}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  const url = new URL(baseUrl);
  url.searchParams.set('key', key);
  url.searchParams.set('expires', String(expiresAt));
  url.searchParams.set('signature', signature);
  return url.toString();
}

export function verifySignedDownloadUrl(url: string) {
  const parsed = new URL(url);
  const key = parsed.searchParams.get('key');
  const expires = parsed.searchParams.get('expires');
  const signature = parsed.searchParams.get('signature');
  if (!key || !expires || !signature) return false;
  const expiresAt = Number(expires);
  if (Number.isNaN(expiresAt)) return false;
  if (expiresAt < Math.floor(Date.now() / 1000)) return false;
  const payload = `${key}:${expiresAt}`;
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function remainingDownloads(maxDownloads: number, alreadyDownloaded: number) {
  return Math.max(0, maxDownloads - alreadyDownloaded);
}
