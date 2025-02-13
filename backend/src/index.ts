import { Hono } from "hono";
import { AppVariables } from "./types";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { auth } from "./config/auth";

const app = new Hono<{ Variables: AppVariables }>();

app.use(logger());

app.use(
  "/api/auth/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: process.env.CLIENT_BASE_URL!, // replace with your origin
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

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.basePath("/api/v1");

export default app;
