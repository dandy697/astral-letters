import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { webPublicReportsRoot } from "@/lib/paths";

const localPublicRoot = webPublicReportsRoot;

async function ensureLocalDirectory() {
  await mkdir(localPublicRoot, { recursive: true });
}

function getSupabaseAdmin() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.SUPABASE_STORAGE_BUCKET) {
    return null;
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function storeBinaryAsset({
  fileName,
  bytes,
  contentType
}: {
  fileName: string;
  bytes: Uint8Array;
  contentType: string;
}) {
  const supabase = getSupabaseAdmin();

  if (supabase && env.SUPABASE_STORAGE_BUCKET) {
    const filePath = `reports/${fileName}`;
    const { error } = await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(filePath, bytes, {
      contentType,
      upsert: true
    });

    if (!error) {
      const { data } = supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(filePath);
      return { url: data.publicUrl, storage: "supabase" as const, filePath };
    }
  }

  await ensureLocalDirectory();
  const absolutePath = path.join(localPublicRoot, fileName);
  await writeFile(absolutePath, bytes);
  return {
    url: `/generated/reports/${fileName}`,
    storage: "local" as const,
    filePath: absolutePath
  };
}
