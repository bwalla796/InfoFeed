import { getCommands } from "./index.js";
import { createInterface, type Interface } from "readline";

export type State = {
    interface: Interface;
    commands: Record<string, CLICommand>;
}

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
}

export function initState(): State {
    // Create a readline interface
    const rl = {
      interface:  createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "TaskManager >"
        }),
      commands: getCommands()
    }

    return rl;
}