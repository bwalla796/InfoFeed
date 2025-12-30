import { UUID } from "crypto";
import { getCommands } from "./index.js";
import { createInterface, type Interface } from "node:readline/promises";
import { getTasks, updateTask, deleteTask, createTask } from "../db/tasks.js";
import { NewTask } from "../db/schema.js";

export type State = {
    interface: Interface;
    commands: Record<string, CLICommand>;
    userId: string | undefined,
    taskId: string | undefined,
    taskTitle: string | undefined,
    taskDescription: string | undefined,
    taskStatus: string | undefined,
    db: {
      getTasks: (id?: string) => Promise<any>;
      updateTask: (updates: Partial<any>, id?: string) => Promise<any>;
      deleteTask: (id: string) => Promise<NewTask | NewTask[]>;
      createTask: (task: NewTask) => Promise<NewTask>;
    };
}

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
}

export function initState(): State {
    const rl = {
      interface:  createInterface({
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
    }

    return rl;
}