import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { PrismaClient } from "@prisma/client";
import { clientError, clientSuccess, serverError } from "../utils/httpStatus";
import ApiError from "../errors/ApiError";

import { z } from "zod";
import { email, password, name } from "../schemas/z.schema";

import bcrypt from "bcrypt";
import {
    createAccessToken,
    createRefreshToken,
    isJWTExpired,
    TokenEnum,
    verifyToken,
} from "../lib/jwt.lib";
export const prisma = new PrismaClient();

const registerSchema = z.object({ name, email, password });
const loginSchema = z.object({ email, password });

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    /* check if form is valid */
    const {
        success,
        error,
        data: registerForm,
    } = registerSchema.safeParse({ name, email, password });
    if (!success) {
        throw new ApiError(
            clientError.NotAcceptable,
            JSON.stringify(error?.errors)
        );
    }
    /* check if user already exists */
    const existingEmail = await prisma.user.findUnique({
        where: {
            email: registerForm.email,
        },
    });
    if (existingEmail) {
        throw new ApiError(
            clientError.NotAcceptable,
            "User with this email already exists"
        );
    }
    /* create new user */
    const hashedPassword = await bcrypt.hash(registerForm.password, 10);
    await prisma.user.create({
        data: {
            name: registerForm.name,
            email: registerForm.email,
            password: hashedPassword,
        },
    });
    //
    res.status(clientSuccess.OK).json({
        success: true,
        message: "User Registered successfully",
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    /*check if form is valid*/
    const {
        success,
        error,
        data: loginForm,
    } = loginSchema.safeParse({ email, password });
    if (!success) {
        throw new ApiError(
            clientError.NotAcceptable,
            JSON.stringify(error?.errors)
        );
    }
    /* check if user exists */
    const user = await prisma.user.findUnique({
        where: {
            email: loginForm.email,
        },
    });
    if (user === null) {
        throw new ApiError(
            clientError.NotFound,
            "User with that email doesn't exist"
        );
    }

    /* check if password is correct */
    const isPasswordCorrect = await bcrypt.compare(
        loginForm.password,
        user.password
    );
    if (!isPasswordCorrect) {
        throw new ApiError(clientError.Conflict, "Password is incorrect");
    }
    //create token
    const refreshToken = createRefreshToken(user);
    const accessToken = createAccessToken(user);

    return res.status(clientSuccess.OK).json({
        success: true,
        data: {
            refresh_token: refreshToken,
            access_token: accessToken,
        },
    });
});
export const profile = asyncHandler(async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    if (!authorization || typeof authorization !== "string") {
        throw new ApiError(
            clientError.Unauthorized,
            "Authorization header missing or invalid"
        );
    }
    const refreshToken: string = authorization.split(" ")[1];
    const verifiedToken: any = verifyToken(refreshToken);
    if (!verifiedToken) {
        throw new ApiError(clientError.Unauthorized, "invalid token");
    }
    const isTokenExpired = isJWTExpired(verifiedToken);
    if (isTokenExpired) {
        throw new ApiError(clientError.Unauthorized, "token is Expired");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: verifiedToken.id,
        },
    });
    if (!user) {
        throw new ApiError(
            serverError.InternalServerError,
            "refreshToken is Expired"
        );
    }
    res.status(200).json({
        success: true,
    });
});
export const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        if (!refreshToken || typeof refreshToken !== "string") {
            throw new ApiError(
                clientError.Unauthorized,
                "refreshToken missing or invalid"
            );
        }
        const verifiedToken: any = verifyToken(refreshToken);
        if (verifiedToken.type !== TokenEnum.REFRESH) {
            throw new ApiError(
                clientError.Unauthorized,
                "refreshToken invalid"
            );
        }
        const isTokenExpired = isJWTExpired(verifiedToken);
        if (isTokenExpired) {
            throw new ApiError(
                clientError.Unauthorized,
                "refreshToken is Expired"
            );
        }
        //
        const user = await prisma.user.findUnique({
            where: {
                id: verifiedToken.id,
            },
        });
        if (!user) {
            throw new ApiError(
                serverError.InternalServerError,
                "refreshToken is Expired"
            );
        }
        //create token
        const NewRefreshToken = createRefreshToken(user);
        const NewAccessToken = createAccessToken(user);
        return res.status(clientSuccess.OK).json({
            success: true,
            data: {
                refresh_token: NewRefreshToken,
                access_token: NewAccessToken,
            },
        });
    }
);
