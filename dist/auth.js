import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UnauthroizedError } from "./errors.js";
import crypto from "crypto";
import { db } from "./main.js";
import { refreshTokens } from "./db/schema.js";
import { sql, eq } from "drizzle-orm";
export async function hashPassword(password) {
    return argon2.hash(password);
}
export async function checkPasswordHash(password, hash) {
    return argon2.verify(hash, password);
}
export function makeJWT(userId, expiresIn, secret) {
    const payload = {
        iss: "chirpy",
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    let str = jwt.sign(payload, secret);
    return str;
}
export function validateJWT(token, secret) {
    try {
        const decoded = jwt.verify(token, secret);
        if (!decoded.iss || decoded.iss !== "chirpy" || !decoded.sub) {
            throw new UnauthroizedError("Invalid token");
        }
        return decoded.sub;
    }
    catch (err) {
        throw new UnauthroizedError("Invalid token");
    }
}
export function getBearerToken(req) {
    try {
        let token = req.get("Authorization")?.split(" ")[1];
        return token;
    }
    catch (err) {
        throw new UnauthroizedError("Invalid token");
    }
}
export async function makeRefreshToken(userId, expiresAt) {
    let hex = crypto.randomBytes(32).toString('hex');
    const [result] = await db
        .insert(refreshTokens)
        .values({ token: hex, userId: userId, expiresAt: expiresAt })
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getRefreshToken(token) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token));
    return result;
}
export async function revokeRefreshToken(token) {
    await db
        .update(refreshTokens)
        .set({ revokedAt: sql `CURRENT_TIMESTAMP`, updatedAt: sql `CURRENT_TIMESTAMP` })
        .where(eq(refreshTokens.token, token));
}
export async function getAPIKey(req) {
    let header = req.get("Authorization")?.split(" ");
    try {
        if (!header || header[0] !== "ApiKey" || !header[1]) {
            throw new UnauthroizedError("Invalid API Key");
        }
        let apiKey = header[1];
        return apiKey;
    }
    catch (err) {
        throw new UnauthroizedError("Invalid API Key");
    }
}
