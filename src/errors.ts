import { Request, Response, NextFunction } from "express";
import { makeJWT, getRefreshToken, revokeRefreshToken } from "./auth.js";
import { config } from "./config.js";

export async function handlerRefresh(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) {
      throw new UnauthroizedError(
        JSON.stringify({ error: "Invalid refresh token" }),
      );
    }
    const token_db = await getRefreshToken(token);
    if (
      !token_db ||
      new Date(token_db.expiresAt) < new Date() ||
      token_db.revokedAt !== null
    ) {
      throw new UnauthroizedError(
        JSON.stringify({ error: "Invalid refresh token" }),
      );
    } else {
      const new_token = await makeJWT(
        token_db.userId,
        60 * 60,
        config.api.jwt.secret ? config.api.jwt.secret : "",
      );
      res.status(200).send({ token: new_token });
    }
  } catch (error) {
    next(error);
  }
}

export async function handlerRevoke(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) {
      throw new UnauthroizedError(
        JSON.stringify({ error: "Invalid refresh token" }),
      );
    }
    const token_db = await getRefreshToken(token);
    if (!token_db || token_db.revokedAt) {
      throw new UnauthroizedError(
        JSON.stringify({ error: "Invalid refresh token" }),
      );
    } else {
      revokeRefreshToken(token);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
}

export function handlerError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);
  if (err instanceof BadRequestError) {
    res.status(400).json({
      error: "Chirp is too long. Max length is 140",
    });
  } else if (err instanceof UnauthroizedError) {
    res.status(401).json({
      error: err.message,
    });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({
      error: err.message,
    });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({
      error: "Not Found",
    });
  } else {
    res.status(500).json({
      error: "Something went wrong on our end",
    });
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class UnauthroizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
