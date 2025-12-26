import { eq } from "drizzle-orm";
import { db, assertDbConnection } from "../main.js";
import { tasks } from "./schema.js";
export async function createTask(task) {
    assertDbConnection();
    const rows = await db.insert(tasks).values(task).returning();
    if (rows.length === 0) {
        throw new Error("Failed to create task");
    }
    return rows[0];
}
export async function getTasks(id) {
    assertDbConnection();
    if (id) {
        const rows = await db
            .select()
            .from(tasks)
            .where(eq(tasks.id, id));
        return rows.length > 0 ? rows[0] : null;
    }
    else {
        const rows = await db
            .select()
            .from(tasks);
        return await rows;
    }
}
export async function updateTask(updates = {}, id) {
    assertDbConnection();
    if (!id) {
        throw new Error("Task ID is required for update");
    }
    const rows = await db
        .update(tasks)
        .set(updates)
        .where(eq(tasks.id, id))
        .returning();
    if (rows.length === 0) {
        throw new Error("Failed to update task");
    }
    return rows[0];
}
export async function deleteTask(id) {
    assertDbConnection();
    const rows = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    if (rows.length === 0) {
        throw new Error("Failed to delete task");
    }
    return rows[0];
}
