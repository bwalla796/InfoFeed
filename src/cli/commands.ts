import type { State } from "./state";

export async function exit(state: State) {
  console.log("Exiting Tasks");
  state.interface.close();
  process.exit(0);
}

export async function help(state: State) {
    console.log("Welcome to the Pokedex!");
    console.log("Usage:\n");
  for (let command in state.commands) {
      console.log(`${state.commands[command].name}: ${state.commands[command].description}\n`)
  }
};

export async function list() {}

export async function update() {}

export async function remove() {}