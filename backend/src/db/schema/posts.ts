import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";
import { sql } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const contentTypeEnum = pgEnum("content_type", [
  "text",
  "image",
  "video",
  "link",
]);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  contentType: contentTypeEnum("content_type").notNull(),
  url: text("url"),
  mediaUrl: text("media_url"),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`NOW()`),
});

export const postsInsertSchema = createInsertSchema(posts);
export const postsSelectSchema = createSelectSchema(posts);
export const postsUpdateSchema = createUpdateSchema(posts);
