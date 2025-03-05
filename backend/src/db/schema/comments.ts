import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name"),
  image: text("image"),
  username: text("username"),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").references((): AnyPgColumn => comments.id, {
    onDelete: "cascade",
  }),
  replyCount: integer("reply_count").default(0).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commentsInsertSchema = createInsertSchema(comments);
export const commentsSelectSchema = createSelectSchema(comments);
export const commentsUpdateSchema = createUpdateSchema(comments);
