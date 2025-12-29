import { relative } from "node:path";
import { stdin, stdout } from "node:process";
import Stream from "node:stream";
import * as readline from 'node:readline/promises';
import { middlewareLogResponses, middlewareMetricsInc } from "../middleware";
import { handlerStats, handlerResetTasks } from "../api/adminHandlers";
import * as cmds from "./commands.js"
import { CLICommand } from "./state.js";
import { State } from "./state.js";
import { getUserByEmail, createUser } from "../db/users.js";
import { hashPassword, checkPasswordHash } from "../auth.js";
import crypto from "crypto";
import * as readlineSync from "readline-sync";

export async function loginUser(state: State): Promise<void> {
  while(!state.userId) {
    const input_email = await state.interface.question('Please enter your email: ');
    let potential_user = await getUserByEmail(input_email);
    if (potential_user) {
      let input_password = await readlineSync.question('Please enter your password: ', {
        hideEchoBack: true
      });
      const pwd_match = await checkPasswordHash(input_password, potential_user.hashedPassword);
      if (!pwd_match) {
        console.log("Incorrect password. Please try again.");
        continue;
      }
      console.log(`Welcome back, ${input_email}!`);
      state.userId = potential_user.id;
    } else {
      console.log("User not found.");
      const create_new = await state.interface.question(`Would you like to create a new user profile using ${input_email}? (y/n): `);
      if (create_new.toLowerCase() === 'y') {
        let input_password = await readlineSync.question('Please enter a password: ', {
          hideEchoBack: true
        });
        let hashed_password = await hashPassword(input_password);
        potential_user = await createUser({
          id: crypto.randomUUID(),
          email: input_email,
          hashedPassword: hashed_password,
          apiKey: crypto.randomUUID(), // TODO: add JWT logic
        });
        state.userId = potential_user.id;
        console.log(`User profile created. Welcome!`);
      } else {
        console.log("Okay, let's try again.");
        continue;
      }
    }
  }
}

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: "exit",
      description: "Exits Tasks",
      callback: cmds.exit
    },
    help: {
      name: "help",
      description: "Displays a help message",
      callback: cmds.help
    },
    list: {
      name: "list",
      description: "Lists tasks",
      callback: cmds.list
    },
    upsert: {
      name: "upsert",
      description: "Creates a task or updates an existing task if given a valid ID",
      callback: cmds.upsert
    },
    delete: {
      name: "delete",
      description: "Deletes a task by ID",
      callback: cmds.remove
    }
  }
}

export function cleanInput(input: string): string[] {
  return input.trim().toLowerCase().split(" ").filter(elem => elem.length != 0);
}

const commands = getCommands();

export async function startREPL(state: State): Promise<void> {
  console.log("Welcome to Task Manager! Please login. A user profile will be created if one does not already exist.");
  await loginUser(state);

  state.interface.prompt();

  state.interface.on("line", async (input) => {
    let cl_inp = cleanInput(input)
        if (cl_inp.length == 0) {
          state.interface.prompt()
          return;
        }
        const commandName = cl_inp[0]
        const commands = state.commands;
        const cmd = commands[commandName];
        if(commandName == "delete") {
          if (cl_inp.length == 2) {
            state.taskId = cl_inp[1];
          } else {
            console.log(
              `Invalid command arguments: "${commandName}". Format should be "${commandName} {name/ID}"`,
            );
            state.interface.prompt();
            return;
          }
        }
        if(commandName == "upsert") {
          if (cl_inp.length >= 2) {
            state.taskId = cl_inp[1];
          }
          state.taskTitle = await state.interface.question("Please enter a title for the task:");
          state.taskDescription = await state.interface.question("Please enter a description for the task:");
          state.taskStatus = await state.interface.question("Please enter a status for the task:");
        }
        if (!cmd) {
          console.log(
            `Unknown command: "${commandName}". Type "help" for a list of commands.`,
          );
          state.interface.prompt();
          return;
        }

        try {
          await cmd.callback(state);
        } catch (e) {
          console.log(e);
        }
        state.interface.prompt();
        return;
    });
    
}