import * as cmds from "./commands.js";
export function getCommands() {
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
        update: {
            name: "update",
            description: "Updates a task",
            callback: cmds.upsert
        },
        delete: {
            name: "delete",
            description: "Deletes a task by id",
            callback: cmds.remove
        }
    };
}
export function cleanInput(input) {
    return input.trim().toLowerCase().split(" ").filter(elem => elem.length != 0);
}
let commands = getCommands();
export async function startREPL(state) {
    state.interface.prompt();
    state.interface.on("line", async (input) => {
        let cl_inp = cleanInput(input);
        if (cl_inp.length == 0) {
            state.interface.prompt();
            return;
        }
        const commandName = cl_inp[0];
        const commands = state.commands;
        const cmd = commands[commandName];
        if (commandName == "update" || commandName == "delete") {
            if (cl_inp.length == 2) {
                state.taskId = cl_inp[1];
            }
            else {
                console.log(`Invalid command arguments: "${commandName}". Format should be "${commandName} {name/ID}"`);
                state.interface.prompt();
                return;
            }
        }
        if (!cmd) {
            console.log(`Unknown command: "${commandName}". Type "help" for a list of commands.`);
            state.interface.prompt();
            return;
        }
        try {
            await cmd.callback(state);
        }
        catch (e) {
            console.log(e);
        }
        state.interface.prompt();
        return;
    });
}
