import type { InferSelectModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { admins } from "../admin/schema";

export const fileTypeEnum = pgEnum("file_type", [
  "avatar",
  "brand",
  "brand_logo",
  "brand_banner",
  "product_image",
  "category_image",
  "collection_image",
  "banner",
  "blog_image",
]);

export type FileType = (typeof fileTypeEnum.enumValues)[number];

export const files = pgTable(
  "files",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    name: text("name").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    path: text("path").notNull(),
    type: fileTypeEnum("type").notNull(),
    uploadedBy: text("uploaded_by")
      .notNull()
      .references(() => admins.id, {
        onDelete: "set null",
      }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (file) => ({
    uploadedByIdx: index("files_uploaded_by_idx").on(file.uploadedBy),
  }),
);

export type File = InferSelectModel<typeof files>;

export const filesRelations = relations(files, ({ one }) => ({
  uploadedByAdmin: one(admins, {
    fields: [files.uploadedBy],
    references: [admins.id],
  }),
}));
