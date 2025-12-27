// repl.js actually refers to repl.ts
import readline from "node:readline";
import { getCommands, startREPL } from "./cli/index.js";
import { initState, State } from "./cli/state.js";
import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { handlerStats, handlerResetTasks } from "./admin.js";
import { handlerGetTasks, handlerUpsertTasks, handlerDeleteTasks } from "./api/taskHandlers.js";
import { handlerError } from "./errors.js";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

function main() {
  const state = initState();
  startREPL(state);
}

export const client = createClient({ url: process.env.DB_FILE_NAME! });
export const db = drizzle({ client });

const app = express();

export function assertDbConnection() {
  if (!db) {
    throw new Error("Database connection is not available");
  }
}



app.use(middlewareLogResponses);
app.use(express.json())
//app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerStats);
app.post("/admin/reset", handlerResetTasks);


app.get("/api/tasks/:id",  handlerGetTasks);
app.post("/api/tasks", middlewareLogResponses, handlerUpsertTasks);
app.delete("/api/tasks/:id", middlewareLogResponses, handlerDeleteTasks);
app.use(handlerError);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});



main();