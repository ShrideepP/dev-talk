import { pgEnum, pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const voteTypeEnum = pgEnum("vote_type", ["upvote", "downvote"]);

export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id").references(() => comments.id, {
    onDelete: "cascade",
  }),
  voteType: voteTypeEnum("vote_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votesInsertSchema = createInsertSchema(votes);
export const votesSelectSchema = createSelectSchema(votes);
export const votesUpdateSchema = createUpdateSchema(votes);
