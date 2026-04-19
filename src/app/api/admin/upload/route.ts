import type { NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/api/response";
import { isAdmin } from "@/lib/auth/guard";

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return fail("Unauthorized", 401, "UNAUTHORIZED");
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return fail("No file provided", 400, "NO_FILE");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return fail("Invalid file type", 400, "INVALID_TYPE");
  }

  if (file.size > 5 * 1024 * 1024) {
    return fail("File too large (max 5MB)", 400, "FILE_TOO_LARGE");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = createAdminSupabase();
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return fail("Upload failed", 500, "UPLOAD_ERROR");
  }

  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return ok({ url: urlData.publicUrl, fileName });
}
