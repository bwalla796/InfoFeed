import { Request, Response, NextFunction } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../db/tasks.js";

export async function handlerGetTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tasks = await getTasks();

  res.status(200).json(tasks);
  next();
}

export async function handlerUpsertTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.params.id) {
    const new_task = await createTask(req.body);
    res.status(201).json(new_task);
  } else {
    const task_to_update = await getTasks(req.params.id);
    if (!task_to_update) {
      res.status(404).json({ error: "Task not found" });
    }
    const updated_task = await updateTask(req.body, req.params.id);
    res.status(204).json(updated_task);
  }
  next();
}

export async function handlerDeleteTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.params.id) {
    res.status(400).json({ error: "Task ID is required" });
  }
  const deleted_task = await deleteTask(req.params.id);
  if (!deleted_task) {
    res.status(404).json({ error: "Task not found" });
  }
  res.json({ message: "Task deleted successfully", task: deleted_task });
  next();
}
