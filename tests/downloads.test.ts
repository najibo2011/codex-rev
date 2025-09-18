import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { createSignedDownloadUrl, verifySignedDownloadUrl, remainingDownloads } from '@/lib/downloads';

describe('downloads signing', () => {
  const originalSecret = process.env.DOWNLOAD_SIGNING_SECRET;

  beforeEach(() => {
    process.env.DOWNLOAD_SIGNING_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env.DOWNLOAD_SIGNING_SECRET = originalSecret;
  });

  it('creates a verifiable signed URL', () => {
    const url = createSignedDownloadUrl('ebooks/test.pdf', 'https://files.example.com/ebooks/test.pdf', 60);
    expect(verifySignedDownloadUrl(url)).toBe(true);
  });

  it('detects tampering', () => {
    const url = createSignedDownloadUrl('ebooks/test.pdf', 'https://files.example.com/ebooks/test.pdf', 60);
    const tampered = url.replace('ebooks/test.pdf', 'ebooks/hack.pdf');
    expect(verifySignedDownloadUrl(tampered)).toBe(false);
  });

  it('expires properly', () => {
    const url = createSignedDownloadUrl('ebooks/test.pdf', 'https://files.example.com/ebooks/test.pdf', -1);
    expect(verifySignedDownloadUrl(url)).toBe(false);
  });
});

describe('remainingDownloads', () => {
  it('never returns negative values', () => {
    expect(remainingDownloads(5, 10)).toBe(0);
  });

  it('subtracts already downloaded count', () => {
    expect(remainingDownloads(5, 2)).toBe(3);
  });
});
