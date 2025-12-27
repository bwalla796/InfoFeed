import { deleteTask, getTasks } from "src/db/tasks.js";

export async function handlerStats() {
    const tasks = await getTasks();

    return (Array.isArray(tasks)) ? tasks.length : 0;
}

export async function handlerResetTasks() {
    deleteTask();
    console.log("All tasks have been reset.");
}