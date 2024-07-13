import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { env } from "./env";

const { JWT_SECRET, REFRESH_TOKEN_EXPIRE_IN, ACCESS_TOKEN_EXPIRE_IN } = env;
export enum TokenEnum {
    REFRESH = "REFRESH",
    ACCESS = "ACCESS",
}
/**
 * Creates a refresh token for the given user.
 * @param user The user object from the database.
 * @returns The signed refresh token.
 */
export function createRefreshToken(user: User) {
    const payload = {
        id: user.id,
        type: TokenEnum.REFRESH,
    };
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRE_IN,
    });
}

/**
 * Creates an access token for the given user.
 * @param user The user object from the database.
 * @returns The signed access token.
 */
export function createAccessToken(user: User) {
    const payload = {
        id: user.id,
        role: user.role,
        name: user.name,
        verified: user.verified,
        type: TokenEnum.ACCESS,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE_IN });
}

/**
 * Verifies a given token.
 * @param token The token to verify.
 * @returns The decoded token if valid.
 */
export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}


/**
  * @param decodedJWT The verified token.
  * @returns is JWT Expired.
*/
export function isJWTExpired(decodedJWT: any) {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch
    return decodedJWT.exp < currentTime;
}