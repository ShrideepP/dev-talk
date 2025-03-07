import { Hono } from "hono";
import { AppVariables } from "../../types";
import { zValidator } from "@hono/zod-validator";
import {
  reportsInsertSchema,
  posts as postsTable,
  comments as commentsTable,
  reports as reportsTable,
} from "../../db/schema";
import { db } from "../../config/database";
import { eq } from "drizzle-orm";

const router = new Hono<{ Variables: AppVariables }>();

router.post("/", zValidator("json", reportsInsertSchema), async (c) => {
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
          message: "User banned from posting",
          data: null,
          errors: [],
        },
        403
      );

    const validatedReport = c.req.valid("json");
    validatedReport.userId = user.id;

    const { postId, commentId } = validatedReport;

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

    if (postId) validatedReport.postId = postId;
    else validatedReport.commentId = commentId;

    const reports = await db
      .insert(reportsTable)
      .values(validatedReport)
      .returning();

    return c.json(
      {
        status: "success",
        message: "Report submitted successfully",
        data: reports[0],
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

export { router as reportsRoutes };
