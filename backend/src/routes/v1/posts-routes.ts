import { Hono } from "hono";
import { AppVariables } from "../../types";
import { zValidator } from "@hono/zod-validator";
import {
  postsInsertSchema,
  categories as categoriesTable,
  posts as postsTable,
} from "../../db/schema";
import { db } from "../../config/database";
import { eq, count } from "drizzle-orm";
import { uploader } from "../../config/cloudinary";

const router = new Hono<{ Variables: AppVariables }>();

router.post("/", zValidator("form", postsInsertSchema), async (c) => {
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

    const validatedPost = c.req.valid("form");
    validatedPost.userId = user.id;
    validatedPost.name = user.name;
    validatedPost.image = user.image;
    validatedPost.username = user.username;

    const { categoryId, contentType } = validatedPost;

    const categories = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId));

    if (!categories.length)
      return c.json(
        {
          status: "error",
          message: "Category does not exist",
          data: null,
          errors: [],
        },
        404
      );

    if (contentType === "image" || contentType === "video") {
      const body = await c.req.parseBody();

      if (
        body["file"] &&
        body["file"] instanceof File &&
        body["file"].type.startsWith(contentType)
      ) {
        const { secure_url } = await uploader(body["file"], contentType);
        validatedPost.mediaUrl = secure_url;
      }
    }

    const posts = await db.insert(postsTable).values(validatedPost).returning();

    return c.json(
      {
        status: "success",
        message: "Post created successfully",
        data: posts[0],
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

router.get("/", async (c) => {
  try {
    const { page = "1", limit = "10", category = undefined } = c.req.query();
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let categoryId;

    if (category) {
      const categories = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, category));

      if (!categories[0])
        return c.json(
          {
            status: "error",
            message: "Category does not exist",
            data: null,
            errors: [],
          },
          404
        );

      categoryId = categories[0].id;
    }

    const posts = await db
      .select()
      .from(postsTable)
      .offset(offset)
      .limit(parseInt(limit))
      .where(categoryId ? eq(postsTable.categoryId, categoryId) : undefined);

    const [{ count: totalPosts }] = await db
      .select({ count: count() })
      .from(postsTable)
      .where(categoryId ? eq(postsTable.categoryId, categoryId) : undefined);

    const totalPages = Math.ceil(totalPosts / parseInt(limit));

    return c.json(
      {
        status: "success",
        message: "Posts retrieved successfully",
        data: {
          posts,
          pagination: {
            totalItems: totalPosts,
            totalPages,
            currentPage: parseInt(page),
            pageSize: parseInt(limit),
            hasNextPage: parseInt(page) * parseInt(limit) < totalPosts,
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

router.get("/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");

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

    return c.json(
      {
        status: "success",
        message: "Post retrieved successfully",
        data: posts[0],
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

export { router as postsRoutes };
