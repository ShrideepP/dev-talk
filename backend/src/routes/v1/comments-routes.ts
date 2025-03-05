import { Hono } from "hono";
import { AppVariables } from "../../types";
import { zValidator } from "@hono/zod-validator";
import {
  commentsInsertSchema,
  posts as postsTable,
  comments as commentsTable,
} from "../../db/schema";
import { db } from "../../config/database";
import { eq, sql, and, isNull, count } from "drizzle-orm";

const router = new Hono<{ Variables: AppVariables }>();

router.post("/", zValidator("json", commentsInsertSchema), async (c) => {
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
          message: "User banned from commenting",
          data: null,
          errors: [],
        },
        403
      );

    const validatedComment = c.req.valid("json");
    validatedComment.userId = user.id;
    validatedComment.name = user.name;
    validatedComment.image = user.image;
    validatedComment.username = user.username;

    const { postId, parentId } = validatedComment;

    const posts = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, postId));

    if (!posts.length)
      return c.json(
        {
          status: "error",
          message: "Post does not exist",
          data: null,
          errors: [],
        },
        404
      );

    if (parentId) {
      const parentComments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.id, parentId));

      if (!parentComments.length)
        return c.json(
          {
            status: "error",
            message: "Parent comment does not exist",
            data: null,
            errors: [],
          },
          404
        );
    }

    const comments = await db
      .insert(commentsTable)
      .values(validatedComment)
      .returning();

    if (parentId) {
      await db
        .update(commentsTable)
        .set({
          replyCount: sql`${commentsTable.replyCount} + 1`,
        })
        .where(eq(commentsTable.id, parentId));
    }

    return c.json(
      {
        status: "success",
        message: "Comment added successfully",
        data: comments[0],
        errors: [],
      },
      201
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

router.get("/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");

    const { page = "1", limit = "10" } = c.req.query();
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const posts = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, postId));

    if (!posts.length)
      return c.json(
        {
          status: "error",
          message: "Post not found",
          data: null,
          errors: [],
        },
        404
      );

    const comments = await db
      .select()
      .from(commentsTable)
      .offset(offset)
      .limit(parseInt(limit))
      .where(
        and(eq(commentsTable.postId, postId), isNull(commentsTable.parentId))
      );

    const [{ count: totalComments }] = await db
      .select({ count: count() })
      .from(commentsTable)
      .where(
        and(eq(commentsTable.postId, postId), isNull(commentsTable.parentId))
      );

    const totalPages = Math.ceil(totalComments / parseInt(limit));

    return c.json(
      {
        status: "success",
        message: "Comments retrieved successfully",
        data: {
          comments,
          pagination: {
            totalItems: totalComments,
            totalPages,
            currentPage: parseInt(page),
            pageSize: parseInt(limit),
            hasNextPage: parseInt(page) * parseInt(limit) < totalComments,
            hasPrevPage: parseInt(page) > 1,
          },
        },
        error: [],
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

router.get("/:commentId/replies", async (c) => {
  try {
    const commentId = c.req.param("commentId");

    const { page = "1", limit = "10" } = c.req.query();
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const comments = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.id, commentId));

    if (!comments.length)
      return c.json(
        {
          status: "error",
          message: "Comment not found",
          data: null,
          errors: [],
        },
        404
      );

    const replies = await db
      .select()
      .from(commentsTable)
      .offset(offset)
      .limit(parseInt(limit))
      .where(eq(commentsTable.parentId, commentId));

    const [{ count: totalReplies }] = await db
      .select({ count: count() })
      .from(commentsTable)
      .where(eq(commentsTable.parentId, commentId));

    const totalPages = Math.ceil(totalReplies / parseInt(limit));

    return c.json(
      {
        status: "success",
        message: "Replies retrieved successfully",
        data: {
          replies,
          pagination: {
            totalItems: totalReplies,
            totalPages,
            currentPage: parseInt(page),
            pageSize: parseInt(limit),
            hasNextPage: parseInt(page) * parseInt(limit) < totalReplies,
            hasPrevPage: parseInt(page) > 1,
          },
        },
        error: [],
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

export { router as commentsRoutes };
