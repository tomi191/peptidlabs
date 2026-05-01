import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth/guard";
import { ok, fail } from "@/lib/api/response";
import {
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
  updateBlogPost,
} from "@/lib/blog-writer";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await isAdmin(req))) return fail("Unauthorized", 401, "AUTH");
  const { id } = await params;

  let body: {
    action?: "publish" | "unpublish";
    patch?: {
      title_bg?: string;
      title_en?: string;
      content_bg?: string;
      content_en?: string;
      tags?: string[];
      slug?: string;
    };
  };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400, "BAD_REQUEST");
  }

  try {
    if (body.action === "publish") {
      await publishBlogPost(id);
      return ok({ id, status: "published" });
    }
    if (body.action === "unpublish") {
      await unpublishBlogPost(id);
      return ok({ id, status: "draft" });
    }
    if (body.patch) {
      await updateBlogPost(id, body.patch);
      return ok({ id, updated: true });
    }
    return fail("Specify either { action } or { patch }", 400, "BAD_REQUEST");
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Update failed",
      500,
      "UPDATE_FAILED",
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!(await isAdmin(req))) return fail("Unauthorized", 401, "AUTH");
  const { id } = await params;
  try {
    await deleteBlogPost(id);
    return ok({ id, deleted: true });
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Delete failed",
      500,
      "DELETE_FAILED",
    );
  }
}
