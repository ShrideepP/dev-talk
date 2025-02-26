import { Hono } from "hono";
import { AppVariables } from "./types";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { auth } from "./config/auth";
import { v2 as cloudinary } from "cloudinary";
import { categoriesRoutes, postsRoutes, commentsRoutes } from "./routes/v1";

const app = new Hono<{ Variables: AppVariables }>();

app.use(logger());

app.use(
  "/api/*",
  cors({
    origin: process.env.CLIENT_BASE_URL!,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.use(async (_, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app
  .basePath("/api/v1")
  .route("/categories", categoriesRoutes)
  .route("/posts", postsRoutes)
  .route("/comments", commentsRoutes);

export default app;
