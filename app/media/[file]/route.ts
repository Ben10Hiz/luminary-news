import { readFile } from "fs/promises";
import path from "path";
import { LOCAL_MEDIA_DIR } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

/**
 * Serves images written by the local upload fallback. In production images
 * live on Vercel Blob and never reach this route.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;

  // Reject anything that isn't a plain filename — no traversal, no nesting.
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(file) || file.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(file).toLowerCase();
  const type = TYPES[ext];
  if (!type) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(path.join(LOCAL_MEDIA_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
