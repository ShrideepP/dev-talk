import { Hono } from "hono";
import { db } from "../../config/database";
import { categories as categoriesTable } from "../../db/schema";
import { count } from "drizzle-orm";

const router = new Hono();

router.get("/", async (c) => {
  try {
    // const { page = "1", limit = "10" } = c.req.query();
    // const offset = (parseInt(page) - 1) * parseInt(limit);

    const categories = await db.select().from(categoriesTable);
    // .offset(offset)
    // .limit(parseInt(limit));

    const [{ count: totalCategories }] = await db
      .select({ count: count() })
      .from(categoriesTable);

    // const totalPages = Math.ceil(totalCategories / parseInt(limit));

    return c.json(
      {
        status: "success",
        message: "Categories retrieved successfully",
        data: {
          categories,
          // pagination: {
          //   totalItems: totalCategories,
          //   totalPages,
          //   currentPage: parseInt(page),
          //   pageSize: parseInt(limit),
          //   hasNextPage: parseInt(page) * parseInt(limit) < totalCategories,
          //   hasPrevPage: parseInt(page) > 1,
          // },
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

export { router as categoriesRoutes };
