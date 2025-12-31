import { deleteTask, getTasks } from "../db/tasks.js";
import { Request, Response, NextFunction } from "express";

export async function handlerStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tasks = await getTasks();

  const taskCount = Array.isArray(tasks) ? tasks.length : 0;

  res.status(200).json({ count: taskCount });

  next();
}

export async function handlerResetTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  deleteTask();

  res.status(204).json({ message: "All tasks have been reset" });

  next();
}
