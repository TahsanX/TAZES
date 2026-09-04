import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export class UploadError extends Error {}

/**
 * Uploads an admin-provided image to Supabase Storage under a folder (e.g. "committee",
 * "hero", "achievements", "events", "teachers") and returns its public URL.
 * There is no public-facing equivalent of this function by design — all uploads are admin-only.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new UploadError(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError("File exceeds 5MB limit");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${folder}/${crypto.randomUUID()}.${ext}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new UploadError(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

/** Deletes a previously uploaded image given its public URL. Best-effort — failures are swallowed by callers that just want to clean up. */
export async function deleteImage(publicUrl: string): Promise<void> {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  const supabase = getSupabaseAdmin();
  await supabase.storage.from(BUCKET).remove([path]);
}

/**
 * Best-effort cleanup for images that are no longer referenced by any record.
 *
 * Called whenever a record holding an image is deleted, or when its image is
 * replaced by a different one. Storage cleanup must never fail the surrounding
 * database operation — the record is the source of truth, and an orphaned file
 * is a smaller problem than a delete that appears to fail — so every error is
 * logged and swallowed. Non-bucket URLs (e.g. seeded Unsplash links) are
 * ignored by deleteImage itself.
 */
export async function cleanupImages(...urls: (string | null | undefined)[]): Promise<void> {
  const targets = urls.filter((u): u is string => Boolean(u));
  await Promise.all(
    targets.map(async (url) => {
      try {
        await deleteImage(url);
      } catch (err) {
        console.error(`Failed to remove orphaned image ${url}:`, err);
      }
    })
  );
}

/** Deletes `oldUrl` only when an update actually swapped in a different image. */
export async function cleanupReplacedImage(
  oldUrl: string | null | undefined,
  newUrl: string | null | undefined
): Promise<void> {
  if (oldUrl && oldUrl !== newUrl) await cleanupImages(oldUrl);
}
