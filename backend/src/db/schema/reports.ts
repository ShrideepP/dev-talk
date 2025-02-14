import { pgEnum, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const reportStatusEnum = pgEnum("status", [
  "pending",
  "reviewed",
  "resolved",
]);

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id").references(() => comments.id, {
    onDelete: "cascade",
  }),
  reason: text("reason").notNull(),
  status: reportStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reportsInsertSchema = createInsertSchema(reports);
export const reportsSelectSchema = createSelectSchema(reports);
export const reportsUpdateSchema = createUpdateSchema(reports);
