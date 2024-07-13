import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { env } from "./env";

const { JWT_SECRET, REFRESH_TOKEN_EXPIRE_IN, EXCESS_TOKEN_EXPIRE_IN } = env;

export function createRefreshToken(payload: User) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRE_IN,
    });
}
export function createAccessToken(payload: User) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: EXCESS_TOKEN_EXPIRE_IN,
    });
}
export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}
