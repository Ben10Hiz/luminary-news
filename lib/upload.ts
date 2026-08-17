import { put } from "@vercel/blob";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
]);

/** Where the local fallback keeps uploads. Served by /media/[file]. */
export const LOCAL_MEDIA_DIR = path.join(process.cwd(), ".data", "uploads");

export function isImage(type: string) {
  return ALLOWED.has(type);
}

function safeName(name: string) {
  const ext = path.extname(name).toLowerCase().slice(0, 10) || ".bin";
  const stem =
    path
      .basename(name, path.extname(name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "image";
  return `${stem}-${randomBytes(4).toString("hex")}${ext}`;
}

/**
 * Stores an uploaded image.
 *
 * In production this uses Vercel Blob. Without a Blob token we fall back to
 * writing under .data/uploads and serving through /media — good enough for
 * local development, but it will not survive a serverless deploy, so the
 * error below is deliberately explicit about that.
 */
export async function storeImage(file: File): Promise<{ url: string }> {
  if (!isImage(file.type)) {
    throw new Error(
      `Unsupported image type${file.type ? `: ${file.type}` : ""}. Use JPG, PNG, WebP, GIF or AVIF.`
    );
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That image is larger than 12 MB.");
  }

  const filename = safeName(file.name || "image");

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`stories/${filename}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return { url: blob.url };
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Image uploads need Vercel Blob storage. Add a Blob store to this project so BLOB_READ_WRITE_TOKEN is set, then redeploy."
    );
  }

  await mkdir(LOCAL_MEDIA_DIR, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(LOCAL_MEDIA_DIR, filename), buf);
  return { url: `/media/${filename}` };
}
