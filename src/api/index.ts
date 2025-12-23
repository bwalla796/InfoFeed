import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "../middleware";
import { handlerStats, handlerResetTasks } from "../admin";
import { handlerGetTasks, handlerUpsertTasks, handlerDeleteTasks } from "../tasks";
import { handlerError } from "../errors";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: process.env.DB_FILE_NAME! });
const db = drizzle({ client });

const app = express();

const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json())
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerStats);
app.post("/admin/reset", handlerResetTasks);


app.get("/api/tasks/:id",  handlerGetTasks);
app.post("/api/tasks", middlewareLogResponses, handlerUpsertTasks);
app.delete("/api/tasks/:id", middlewareLogResponses, handlerDeleteTasks);
app.use(handlerError);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});