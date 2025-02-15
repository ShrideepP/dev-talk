import {
  pgEnum,
  pgTable,
  uuid,
  text,
  varchar,
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
  userId: text("user_id")
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

export const postsInsertSchema = createInsertSchema(posts).refine(
  (data) => {
    if (data.contentType === "text" && !data.content) {
      return false;
    }
    if (
      (data.contentType === "image" || data.contentType === "video") &&
      !data.mediaUrl
    ) {
      return false;
    }
    if (data.contentType === "link" && !data.url) {
      return false;
    }
    return true;
  },
  {
    message: "Invalid data for the specified content type",
    path: ["contentType"], // Associate the error with the contentType field
  }
);
export const postsSelectSchema = createSelectSchema(posts);
export const postsUpdateSchema = createUpdateSchema(posts);
