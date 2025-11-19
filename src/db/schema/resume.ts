import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const resume = pgTable("resume", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
