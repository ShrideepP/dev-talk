import { Hono } from "hono";
import { AppVariables } from "../../types";
import { zValidator } from "@hono/zod-validator";
import {
  reportsInsertSchema,
  posts as postsTable,
  comments as commentsTable,
  reports as reportsTable,
  reportsUpdateSchema,
} from "../../db/schema";
import { db } from "../../config/database";
import { and, eq, count } from "drizzle-orm";

const router = new Hono<{ Variables: AppVariables }>();

router.post("/", zValidator("json", reportsInsertSchema), async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        {
          status: "error",
          message: "User not authenticated.",
        },
        401
      );
    }

    if (user.banned) {
      return c.json(
        {
          status: "error",
          message: "User banned from reporting content.",
        },
        403
      );
    }

    const validatedReport = c.req.valid("json");
    validatedReport.userId = user.id;
    validatedReport.reportedBy = user.name;

    const { postId, commentId } = validatedReport;

    if ((postId && commentId) || (!postId && !commentId)) {
      return c.json(
        {
          status: "error",
          message: "Exactly one of postId or commentId must be provided.",
        },
        400
      );
    }

    const table = postId ? postsTable : commentsTable;
    const id = postId || commentId;
    const idColumn = postId ? postsTable.id : commentsTable.id;
    const userIdColumn = postId ? postsTable.userId : commentsTable.userId;

    const contentCheck = await db
      .select({ id: idColumn, userId: userIdColumn })
      .from(table)
      .where(and(...(id ? [eq(idColumn, id)] : [])))
      .limit(1);

    if (!contentCheck.length) {
      return c.json(
        {
          status: "error",
          message: `${postId ? "Post" : "Comment"} does not exist.`,
        },
        404
      );
    }

    if (contentCheck[0].userId === user.id) {
      return c.json(
        {
          status: "error",
          message: "You cannot report your own content.",
        },
        403
      );
    }

    const conditions = [eq(reportsTable.userId, user.id)];

    if (postId) {
      conditions.push(eq(reportsTable.postId, postId));
    } else if (commentId) {
      conditions.push(eq(reportsTable.commentId, commentId));
    }

    const existingReport = await db
      .select({ id: reportsTable.id })
      .from(reportsTable)
      .where(and(...conditions))
      .limit(1);

    if (existingReport.length) {
      return c.json(
        {
          status: "error",
          message: "You have already reported this content.",
        },
        409
      );
    }

    const reports = await db
      .insert(reportsTable)
      .values(validatedReport)
      .returning();

    return c.json(
      {
        status: "success",
        message: "Report submitted successfully.",
        data: reports[0],
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        status: "error",
        message: "Something went wrong on our end.",
      },
      500
    );
  }
});

router.get("/", async (c) => {
  try {
    const { page = "1", limit = "10", status = undefined } = c.req.query();
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        {
          status: "error",
          message: "Authentication required.",
        },
        401
      );
    }

    if (user.role !== "admin")
      return c.json(
        {
          status: "error",
          message: "Access denied. Admins only.",
        },
        403
      );

    const reports = await db
      .select()
      .from(reportsTable)
      .offset(offset)
      .limit(parseInt(limit))
      .where(
        status
          ? eq(
              reportsTable.status,
              status as "pending" | "reviewed" | "resolved"
            )
          : undefined
      );

    const [{ count: totalReports }] = await db
      .select({ count: count() })
      .from(reportsTable)
      .where(
        status
          ? eq(
              reportsTable.status,
              status as "pending" | "reviewed" | "resolved"
            )
          : undefined
      );

    const totalPages = Math.ceil(totalReports / parseInt(limit));

    return c.json(
      {
        status: "success",
        message: "Reports retrieved successfully.",
        data: {
          reports,
          pagination: {
            totalItems: totalReports,
            totalPages,
            currentPage: parseInt(page),
            pageSize: parseInt(limit),
            hasNextPage: parseInt(page) * parseInt(limit) < totalReports,
            hasPrevPage: parseInt(page) > 1,
          },
        },
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        status: "error",
        message: "Something went wrong on our end.",
      },
      500
    );
  }
});

router.patch(
  "/:reportId",
  zValidator("json", reportsUpdateSchema),
  async (c) => {
    try {
      const { reportId } = c.req.param();

      const session = c.get("session");
      const user = c.get("user");

      if (!session || !user) {
        return c.json(
          {
            status: "error",
            message: "Authentication required.",
          },
          401
        );
      }

      if (user.role !== "admin")
        return c.json(
          {
            status: "error",
            message: "Access denied. Admins only.",
          },
          403
        );

      const validatedReport = c.req.valid("json");

      const reports = await db
        .select()
        .from(reportsTable)
        .where(eq(reportsTable.id, reportId));

      if (!reports.length)
        return c.json(
          {
            status: "error",
            message: "Report not found.",
          },
          404
        );

      const updatedReport = await db
        .update(reportsTable)
        .set(validatedReport)
        .where(eq(reportsTable.id, reportId))
        .returning();

      return c.json(
        {
          status: "success",
          message: "Report status updated successfully.",
          data: updatedReport[0],
        },
        200
      );
    } catch (error) {
      return c.json(
        {
          status: "error",
          message: "Something went wrong on our end.",
        },
        500
      );
    }
  }
);

router.delete("/:reportId", async (c) => {
  try {
    const { reportId } = c.req.param();

    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        {
          status: "error",
          message: "Authentication required.",
        },
        401
      );
    }

    if (user.role !== "admin")
      return c.json(
        {
          status: "error",
          message: "Access denied. Admins only.",
        },
        403
      );

    const reports = await db
      .select()
      .from(reportsTable)
      .where(eq(reportsTable.id, reportId));

    if (!reports.length)
      return c.json(
        {
          status: "error",
          message: "Report not found.",
        },
        404
      );

    const deletedReport = await db
      .delete(reportsTable)
      .where(eq(reportsTable.id, reportId))
      .returning();

    return c.json(
      {
        status: "success",
        message: "Report deleted successfully.",
        data: deletedReport[0],
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        status: "error",
        message: "Something went wrong on our end.",
      },
      500
    );
  }
});

export { router as reportsRoutes };
