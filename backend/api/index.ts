import { handle } from "hono/vercel";

// @ts-expect-error
import app from "../dist/src/index.js";

export const runtime = "edge";

export const POST = handle(app);
export const GET = handle(app);
export const OPTIONS = handle(app);
