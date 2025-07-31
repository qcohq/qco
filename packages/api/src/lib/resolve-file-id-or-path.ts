import { TRPCError } from "@trpc/server";
import { files } from "@qco/db/schema";
import type { TRPCContext } from "../trpc";

export async function resolveFileIdOrPath({
  ctx,
  fileIdOrPath,
  fileType,
  uploadedBy,
  meta,
}: {
  ctx: TRPCContext;
  fileIdOrPath: string;
  fileType: "avatar" | "brand" | "brand_logo" | "brand_banner" | "product_image" | "category_image" | "collection_image" | "banner" | "blog_image";
  uploadedBy: string;
  meta?: { name?: string; mimeType?: string; size?: number };
}): Promise<string> {

  if (
    /^[a-zA-Z0-9_-]{10,}$/.test(fileIdOrPath) &&
    !fileIdOrPath.includes("/")
  ) {
    return fileIdOrPath;
  }
  let file = await ctx.db.query.files.findFirst({
    where: (fields, { eq }) => eq(fields.path, fileIdOrPath),
  });
  file ??= await ctx.db
    .insert(files)
    .values({
      path: fileIdOrPath,
      name: meta?.name ?? fileIdOrPath.split("/").pop() ?? "file",
      mimeType: meta?.mimeType ?? "",
      size: meta?.size ?? 0,
      type: fileType,
      uploadedBy,
    })
    .returning()
    .then((r: typeof files.$inferSelect[]) => r[0]);
  if (!file) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Файл не найден или не удалось создать файл",
    });
  }
  return file.id;
}
