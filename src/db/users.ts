import { eq } from "drizzle-orm";
import { db } from "../main.js";
import { users, NewUser } from "./schema.js";

export async function createUser(user: NewUser) {
  const rows = await db.insert(users).values(user).returning();
  if (rows.length === 0) {
    throw new Error("Failed to create user");
  }

  return rows[0];
}

export async function getUser(apiKey: string) {
  const rows = await db.select().from(users).where(eq(users.apiKey, apiKey));
  return rows.length > 0 ? rows[0] : null;
}

export async function getUserByEmail(email: string) {
  const rows = await db.select().from(users).where(eq(users.email, email));
  return rows.length > 0 ? rows[0] : null;
}
