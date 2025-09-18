import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.S3_REGION ?? 'eu-west-3';

const s3Client = new S3Client({
  region,
  credentials: process.env.S3_ACCESS_KEY
    ? {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY ?? '',
      }
    : undefined,
});

export async function uploadFile({
  bucket,
  key,
  body,
  contentType,
}: {
  bucket: string;
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
}) {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType });
  return s3Client.send(command);
}

export async function createPresignedUpload({
  bucket,
  key,
  expiresIn = 900,
}: {
  bucket: string;
  key: string;
  expiresIn?: number;
}) {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn });
}
