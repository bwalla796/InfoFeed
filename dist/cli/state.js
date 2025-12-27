import { getCommands } from "./index.js";
import { createInterface } from "readline";
import { getTasks, updateTask, deleteTask, createTask } from "../db/tasks.js";
export function initState() {
    // Create a readline interface
    const rl = {
        interface: createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "TaskManager >"
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
