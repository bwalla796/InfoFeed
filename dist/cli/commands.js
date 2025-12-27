export async function exit(state) {
    console.log("Exiting Task Manager. Thanks for stopping by!");
    state.interface.close();
    process.exit(0);
}
export async function help(state) {
    console.log("Usage:\n");
    for (let command in state.commands) {
        if (state.commands[command].name === "upsert") {
            console.log(`${state.commands[command].name} <taskId?>: ${state.commands[command].description}\n`);
        }
        else if (state.commands[command].name === "delete") {
            console.log(`${state.commands[command].name} <taskId>: ${state.commands[command].description}\n`);
        }
        else {
            console.log(`${state.commands[command].name}: ${state.commands[command].description}\n`);
        }
    }
}
;
export async function list(state) {
    console.log("Listing all tasks:");
    const tasks = await state.db.getTasks();
    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }
    console.log("----------------------------------------------------------------------");
    console.log("|  Title               | Description                    | Status    |");
    console.log("----------------------------------------------------------------------");
    tasks.forEach((task) => {
        console.log(`| ${task.title}    | ${task.description}   | ${task.status} |`);
    });
}
export async function upsert(state) {
    if (!state.userId) {
        console.log("User ID is required to create or update a task.");
        return;
    }
    let upsertedTask;
    if (state.taskId) {
        upsertedTask = await state.db.updateTask({
            title: state.taskTitle,
            description: state.taskDescription,
            status: state.taskStatus,
        }, state.taskId);
    }
    else {
        upsertedTask = await state.db.createTask({
            id: crypto.randomUUID(),
            userId: state.userId,
            title: state.taskTitle,
            description: state.taskDescription,
            status: state.taskStatus,
        });
    }
    if (!state.taskId) {
        console.log(`Task created with ID: ${upsertedTask.id}`);
    }
    else {
        console.log(`Task with ID ${state.taskId} has been updated.`);
    }
}
export async function remove(state) {
    if (!state.taskId) {
        console.log("Task ID is required to delete a task.");
        return;
    }
    await state.db.deleteTask(state.taskId);
    console.log(`Task with ID ${state.taskId} has been deleted.`);
}
