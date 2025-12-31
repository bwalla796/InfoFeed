import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { UnauthroizedError } from "./errors.js";
import type { Request } from "express";
import crypto from "crypto";
import { db } from "./main.js";
import { refreshTokens } from "./db/schema.js";
import { sql, eq } from "drizzle-orm";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return argon2.verify(hash, password);
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(
  userId: string,
  expiresIn: number,
  secret: string,
): string {
  const payload: payload = {
    iss: "tasky",
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  const str = jwt.sign(payload, secret);
  return str;
}

export function validateJWT(token: string, secret: string): string {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded.iss || decoded.iss !== "tasky" || !decoded.sub) {
      throw new UnauthroizedError("Invalid token");
    }
    return decoded.sub as string;
  } catch (err) {
    throw new UnauthroizedError(`Invalid token: ${err}`);
  }
}

export function getBearerToken(req: Request): string {
  try {
    const token = req.get("Authorization")?.split(" ")[1] as string;
    return token;
  } catch (err) {
    throw new UnauthroizedError(`Invalid token: ${err}`);
  }
}

export async function makeRefreshToken(userId: string, expiresAt: Date) {
  const hex = crypto.randomBytes(32).toString("hex");

  const [result] = await db
    .insert(refreshTokens)
    .values({ token: hex, userId: userId, expiresAt: expiresAt })
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getRefreshToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));

  return result;
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({
      revokedAt: sql`CURRENT_TIMESTAMP`,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(refreshTokens.token, token));
}

export async function getAPIKey(req: Request) {
  const header = req.get("Authorization")?.split(" ");
  try {
    if (!header || header[0] !== "ApiKey" || !header[1]) {
      throw new UnauthroizedError("Invalid API Key");
    }
    const apiKey = header[1];
    return apiKey;
  } catch (err) {
    throw new UnauthroizedError(`Invalid API Key: ${err}`);
  }
}
