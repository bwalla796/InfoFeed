import { eq, and } from "drizzle-orm";
import { db, assertDbConnection } from "../main.js";
import { tasks, NewTask } from "./schema.js";
import { UUID } from "node:crypto";

export async function createTask(task: NewTask) {
  assertDbConnection();
  const rows = await db!.insert(tasks).values(task).returning();
  if (rows.length === 0) {
    throw new Error("Failed to create task");
  }

  return rows[0];
}

export async function getTasks(id?: string, userId?: string, title?: string) {
  assertDbConnection();
  const rows = await db!
    .select()
    .from(tasks)
    .where(and(
      id ? eq(tasks.id, id) : undefined,
      userId ? eq(tasks.userId, userId) : undefined,
      title ? eq(tasks.title, title) : undefined
    ));
  if (id || title) {
    return rows.length > 0 ? rows[0] : null;
  } else {
    return rows;
  }
}

export async function updateTask(updates: Partial<NewTask> = {}, id?: string) {
  assertDbConnection();
  if (!id) {
    throw new Error("Task ID is required for update");
  }
  const rows = await db!
    .update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();
  if (rows.length === 0) {
    throw new Error("Failed to update task");
  }

  return rows[0];
}

export async function deleteTask(id?: string) {
  assertDbConnection();
  if (!id) {
    const rows = await db!.delete(tasks).returning();
    return rows;
  }
  const rows = await db!.delete(tasks).where(eq(tasks.id, id)).returning();
  if (rows.length === 0) {
    throw new Error("Failed to delete task");
  }

  return rows[0];
}