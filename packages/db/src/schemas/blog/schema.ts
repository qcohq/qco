import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  json,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { files } from "../file";
import { admins } from "../admin";

// Enum для статуса поста
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "scheduled",
  "archived",
]);

// Enum для типа поста
export const postTypeEnum = pgEnum("post_type", [
  "post",
  "page",
]);

// Enum для видимости поста
export const postVisibilityEnum = pgEnum("post_visibility", [
  "public",
  "members",
  "paid",
  "private",
]);

// Таблица постов блога
export const blogPosts = pgTable("blog_posts", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  // Основная информация
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: json("content").notNull(), // Slate JSON content (Plate.js)
  contentHtml: text("content_html").notNull(), // HTML контент

  // Статус и видимость
  status: postStatusEnum("status").notNull().default("draft"),
  type: postTypeEnum("type").notNull().default("post"),
  visibility: postVisibilityEnum("visibility").notNull().default("public"),

  // Публикация
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),

  // SEO и метаданные
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  metaKeywords: json("meta_keywords").$type<string[]>(),
  canonicalUrl: text("canonical_url"),

  // Изображения
  featuredImageId: text("featured_image_id").references(() => files.id),
  ogImageId: text("og_image_id").references(() => files.id),

  // Авторство
  authorId: text("author_id").notNull().references(() => admins.id),

  // Настройки
  isFeatured: boolean("is_featured").notNull().default(false),
  isSticky: boolean("is_sticky").notNull().default(false),
  allowComments: boolean("allow_comments").notNull().default(true),

  // Статистика
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),

  // Системные поля
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => admins.id),
  updatedBy: text("updated_by").references(() => admins.id),
});

// Таблица тегов
export const blogTags = pgTable("blog_tags", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => admins.id),
  updatedBy: text("updated_by").references(() => admins.id),
});

// Таблица категорий
export const blogCategories = pgTable("blog_categories", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  parentId: text("parent_id").references((): any => blogCategories.id),
  imageId: text("image_id").references(() => files.id),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => admins.id),
  updatedBy: text("updated_by").references(() => admins.id),
});

// Связующая таблица постов и тегов
export const blogPostTags = pgTable("blog_post_tags", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  postId: text("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => blogTags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Связующая таблица постов и категорий
export const blogPostCategories = pgTable("blog_post_categories", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  postId: text("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  categoryId: text("category_id").notNull().references(() => blogCategories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Таблица комментариев
export const blogComments = pgTable("blog_comments", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  postId: text("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  parentId: text("parent_id").references((): any => blogComments.id),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  authorWebsite: text("author_website"),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  isSpam: boolean("is_spam").notNull().default(false),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  approvedBy: text("approved_by").references(() => admins.id),
  approvedAt: timestamp("approved_at"),
});

// Определение отношений
export const blogPostsRelations = relations(blogPosts, ({ many, one }) => ({
  author: one(admins, {
    fields: [blogPosts.authorId],
    references: [admins.id],
  }),
  featuredImage: one(files, {
    fields: [blogPosts.featuredImageId],
    references: [files.id],
  }),
  ogImage: one(files, {
    fields: [blogPosts.ogImageId],
    references: [files.id],
  }),
  createdByAdmin: one(admins, {
    fields: [blogPosts.createdBy],
    references: [admins.id],
  }),
  updatedByAdmin: one(admins, {
    fields: [blogPosts.updatedBy],
    references: [admins.id],
  }),
  postTags: many(blogPostTags),
  postCategories: many(blogPostCategories),
  comments: many(blogComments),
}));

export const blogTagsRelations = relations(blogTags, ({ many, one }) => ({
  postTags: many(blogPostTags),
  createdByAdmin: one(admins, {
    fields: [blogTags.createdBy],
    references: [admins.id],
  }),
  updatedByAdmin: one(admins, {
    fields: [blogTags.updatedBy],
    references: [admins.id],
  }),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many, one }) => ({
  parent: one(blogCategories, {
    fields: [blogCategories.parentId],
    references: [blogCategories.id],
  }),
  children: many(blogCategories),
  postCategories: many(blogPostCategories),
  image: one(files, {
    fields: [blogCategories.imageId],
    references: [files.id],
  }),
  createdByAdmin: one(admins, {
    fields: [blogCategories.createdBy],
    references: [admins.id],
  }),
  updatedByAdmin: one(admins, {
    fields: [blogCategories.updatedBy],
    references: [admins.id],
  }),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(blogTags, {
    fields: [blogPostTags.tagId],
    references: [blogTags.id],
  }),
}));

export const blogPostCategoriesRelations = relations(blogPostCategories, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostCategories.postId],
    references: [blogPosts.id],
  }),
  category: one(blogCategories, {
    fields: [blogPostCategories.categoryId],
    references: [blogCategories.id],
  }),
}));

export const blogCommentsRelations = relations(blogComments, ({ many, one }) => ({
  post: one(blogPosts, {
    fields: [blogComments.postId],
    references: [blogPosts.id],
  }),
  parent: one(blogComments, {
    fields: [blogComments.parentId],
    references: [blogComments.id],
  }),
  replies: many(blogComments),
  approvedByAdmin: one(admins, {
    fields: [blogComments.approvedBy],
    references: [admins.id],
  }),
})); 
