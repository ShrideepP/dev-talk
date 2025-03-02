import { Hono } from "hono";
import { AppVariables } from "../../types";
import { zValidator } from "@hono/zod-validator";
import {
  votesInsertSchema,
  posts as postsTable,
  comments as commentsTable,
  votes as votesTable,
} from "../../db/schema";
import { db } from "../../config/database";
import { and, eq } from "drizzle-orm";

const router = new Hono<{ Variables: AppVariables }>();

router.post("/", zValidator("json", votesInsertSchema), async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user)
      return c.json(
        {
          status: "error",
          message: "User not authenticated",
          data: null,
          errors: [],
        },
        401
      );

    if (user.banned)
      return c.json(
        {
          status: "error",
          message: "User banned from voting",
          data: null,
          errors: [],
        },
        403
      );

    const validatedVote = c.req.valid("json");
    validatedVote.userId = user.id;

    const { postId, commentId, voteType } = validatedVote;

    let existingVote;

    if (postId) {
      existingVote = await db
        .select()
        .from(votesTable)
        .where(
          and(eq(votesTable.userId, user.id), eq(votesTable.postId, postId))
        );
    } else if (commentId) {
      existingVote = await db
        .select()
        .from(votesTable)
        .where(
          and(
            eq(votesTable.userId, user.id),
            eq(votesTable.commentId, commentId)
          )
        );
    }

    const table = postId ? postsTable : commentsTable;
    const id = postId || commentId;

    if (!id)
      return c.json(
        {
          status: "error",
          message: "Either postId or commentId is required",
          data: null,
          errors: [],
        },
        400
      );

    const idColumn = postId ? postsTable.id : commentsTable.id;

    const records = await db.select().from(table).where(eq(idColumn, id));
    if (!records.length) {
      return c.json(
        {
          status: "error",
          message: "Post or comment does not exist",
          data: null,
          errors: [],
        },
        404
      );
    }

    const record = records[0];
    const isUpvote = voteType === "upvote";

    let values = {};
    let updatedColumn;

    if (existingVote && existingVote.length > 0) {
      const oldVote = existingVote[0];

      if (oldVote.voteType === voteType) {
        await db.delete(votesTable).where(eq(votesTable.id, oldVote.id));

        values = {
          [voteType === "upvote" ? "upvotes" : "downvotes"]:
            voteType === "upvote"
              ? Math.max(0, (record.upvotes ?? 0) - 1)
              : Math.max(0, (record.downvotes ?? 0) - 1),
        };

        updatedColumn = await db
          .update(table)
          .set(values)
          .where(eq(idColumn, id))
          .returning();

        return c.json(
          {
            status: "success",
            message: "Vote removed successfully",
            data: updatedColumn ? updatedColumn[0] : [],
            errors: [],
          },
          200
        );
      } else {
        await db
          .update(votesTable)
          .set({ voteType })
          .where(eq(votesTable.id, oldVote.id));

        values = {
          upvotes: isUpvote
            ? (record.upvotes ?? 0) + 1
            : Math.max(0, (record.upvotes ?? 0) - 1),
          downvotes: isUpvote
            ? Math.max(0, (record.downvotes ?? 0) - 1)
            : (record.downvotes ?? 0) + 1,
        };
      }
    } else {
      await db.insert(votesTable).values(validatedVote);

      values = {
        [isUpvote ? "upvotes" : "downvotes"]: isUpvote
          ? (record.upvotes ?? 0) + 1
          : (record.downvotes ?? 0) + 1,
      };
    }

    updatedColumn = await db
      .update(table)
      .set(values)
      .where(eq(idColumn, id))
      .returning();

    return c.json(
      {
        status: "success",
        message: "Vote recorded successfully",
        data: updatedColumn ? updatedColumn[0] : [],
        errors: [],
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        status: "error",
        message: "Something went wrong on our end.",
        data: null,
        error: [error],
      },
      500
    );
  }
});

export { router as votesRoutes };
