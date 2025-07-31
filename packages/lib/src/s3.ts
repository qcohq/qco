import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { env } from "./env";
import { extname } from "node:path";
import type {
  GetObjectCommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { lookup } from "mime-types";

export const s3 = new S3Client({
  endpoint: env.STORAGE_ENDPOINT_URL,
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
  },
  maxAttempts: 3,
  retryMode: "adaptive",
});

export async function createPresignedUrl(
  key: string,
  type: "get" | "put" = "put",
  download = false,
) {
  const ext = extname(key);
  const mimeType = download
    ? "application/octet-stream"
    : lookup(ext) || "application/octet-stream";
  if (type === "get") {
    const objectParams: GetObjectCommandInput = {
      Bucket: env.STORAGE_BUCKET_NAME,
      Key: key,
      ResponseContentType: mimeType,
    };
    const command = new GetObjectCommand(objectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return { key, url };
  }
  const objectParams: PutObjectCommandInput = {
    Bucket: env.STORAGE_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  };
  const command = new PutObjectCommand(objectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return { key, url };
}

export async function deleteFile(key: string) {
  const input = {
    Bucket: env.STORAGE_BUCKET_NAME,
    Key: key,
  };
  const command = new DeleteObjectCommand(input);
  try {
    await s3.send(command);
  } catch (e) {
    throw e;
  }
}

export async function getFile(key: string) {
  const command = new GetObjectCommand({
    Bucket: env.STORAGE_BUCKET_NAME,
    Key: key,
  });
  return await s3.send(command);
}

export async function moveFile(oldKey: string, newKey: string) {
  const ext = extname(newKey);

  const input = {
    Bucket: env.STORAGE_BUCKET_NAME,
    CopySource: `${env.STORAGE_BUCKET_NAME}/${oldKey}`,
    Key: newKey,
    ContentType: lookup(ext) || "application/octet-stream",
  };
  const command = new CopyObjectCommand(input);
  try {
    await s3.send(command);
    await deleteFile(oldKey);
  } catch (e) {
    throw e;
  }
}

export async function uploadFile(
  key: string,
  contentType: string,
  fileBuffer: Buffer,
) {
  try {
    const upload = new Upload({
      params: {
        Bucket: env.STORAGE_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ACL: "private",
        CacheControl: "public, max-age=31536000, immutable",
        ContentType: contentType,
      },
      client: s3,
      queueSize: 1,
    });
    await upload.done();
  } catch (e) {
    throw e;
  }
}

export function getFileUrl(key: string) {
  return `${env.STORAGE_CDN_URL}/${key}`;
}
