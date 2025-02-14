import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoriesInsertSchema = createInsertSchema(categories);
export const categoriesSelectSchema = createSelectSchema(categories);
export const categoriesUpdateSchema = createUpdateSchema(categories);
