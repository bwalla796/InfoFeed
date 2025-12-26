import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql `(unixepoch())`),
    updatedAt: integer("updated_at", { mode: 'timestamp' })
        .notNull()
        .default(sql `(unixepoch())`)
        .$onUpdate(() => sql `(unixepoch())`),
    email: text("email", { length: 256 }).unique().notNull(),
    hashedPassword: text("hashed_password", { length: 512 }).default("unset").notNull(),
    apiKey: text("api_key", { length: 512 }).unique().notNull(),
});
export const tasks = sqliteTable("tasks", {
    id: text("id").primaryKey(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql `(unixepoch())`),
    updatedAt: integer("updated_at", { mode: 'timestamp' })
        .notNull()
        .default(sql `(unixepoch())`)
        .$onUpdate(() => sql `(unixepoch())`),
    title: text("title", { length: 124 }).default("Default").notNull(),
    description: text("body", { length: 512 }).default("No Description").notNull(),
    status: text("status", { length: 124 }).default("pending").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' })
});
