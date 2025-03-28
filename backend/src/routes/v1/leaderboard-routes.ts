import { Hono } from "hono";
import { AppVariables } from "../../types";
import { db } from "../../config/database";
import { users, posts, comments, votes } from "../../db/schema";
import { sql, eq } from "drizzle-orm";

const router = new Hono<{ Variables: AppVariables }>();

router.get("/", async (c) => {
  try {
    const WEIGHTS = {
      POST: 5,
      COMMENT: 2,
      UPVOTE: 1,
      DOWNVOTE: -1,
    };

    const leaderboard = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,

        postCount: sql<number>`COALESCE(COUNT(DISTINCT ${posts.id}), 0)`.as(
          "postCount"
        ),
        commentCount:
          sql<number>`COALESCE(COUNT(DISTINCT ${comments.id}), 0)`.as(
            "commentCount"
          ),
        upvotesReceived:
          sql<number>`COALESCE(SUM(${posts.upvotes} + ${comments.upvotes}), 0)`.as(
            "upvotesReceived"
          ),
        downvotesReceived:
          sql<number>`COALESCE(SUM(${posts.downvotes} + ${comments.downvotes}), 0)`.as(
            "downvotesReceived"
          ),

        score: sql<number>`
          COALESCE(COUNT(DISTINCT ${posts.id}) * ${WEIGHTS.POST}, 0) + 
          COALESCE(COUNT(DISTINCT ${comments.id}) * ${WEIGHTS.COMMENT}, 0) + 
          COALESCE(SUM(${posts.upvotes} + ${comments.upvotes}) * ${WEIGHTS.UPVOTE}, 0) + 
          COALESCE(SUM(${posts.downvotes} + ${comments.downvotes}) * ${WEIGHTS.DOWNVOTE}, 0)
        `.as("score"),
      })
      .from(users)
      .leftJoin(posts, eq(posts.userId, users.id))
      .leftJoin(comments, eq(comments.userId, users.id))
      .groupBy(users.id, users.name, users.username, users.image)
      .orderBy(sql`score DESC`)
      .limit(10);

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return c.json(
      {
        status: "success",
        message: "Leaderboard retrieved successfully",
        data: {
          leaderboard: rankedLeaderboard,
          scoringSystem: {
            postPoints: WEIGHTS.POST,
            commentPoints: WEIGHTS.COMMENT,
            upvotePoints: WEIGHTS.UPVOTE,
            downvotePoints: WEIGHTS.DOWNVOTE,
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

export { router as leaderboardRoutes };
