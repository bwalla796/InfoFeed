import { getCommands } from "./index.js";
import { createInterface } from "node:readline/promises";
import { getTasks, updateTask, deleteTask, createTask } from "../db/tasks.js";
export function initState() {
    const rl = {
        interface: createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "Tasky >"
        }),
        commands: getCommands(),
        userId: undefined,
        taskId: undefined,
        taskTitle: undefined,
        taskDescription: undefined,
        taskStatus: undefined,
        db: {
            getTasks,
            updateTask,
            deleteTask,
            createTask,
        },
    };
    return rl;
}
