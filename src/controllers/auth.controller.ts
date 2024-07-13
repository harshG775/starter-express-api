import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { PrismaClient } from "@prisma/client";
import { clientError, clientSuccess } from "../utils/httpStatus";
import ApiError from "../errors/ApiError";

import { z } from "zod";
import { email, password, name } from "../schemas/z.schema";

import bcrypt from "bcrypt";
import { createRefreshToken } from "../lib/jwt.lib";
import { parseDuration } from "../utils/parseDuration";
import { env } from "../lib/env";
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
    const expiresIn = new Date(
        Date.now() + parseDuration(env.EXCESS_TOKEN_EXPIRE_IN)
    );
    const createAndUpdateToken = await prisma.token.upsert({
        where: {
            userId: user.id,
        },
        update: {
            refreshToken: refreshToken,
            expiresAt: expiresIn,
        },
        create: {
            userId: user.id,
            refreshToken: refreshToken,
            expiresAt: expiresIn,
        },
    });

    return res.status(200).json({
        success: true,
        data: {
            refresh_token: `${refreshToken}`,
        },
    });
});
export const profile = asyncHandler(async (req: Request, res: Response) => {
    // const bearerToken = req.header
});
export const refreshAccessToken = asyncHandler( async (req: Request, res: Response) => {
    // const refreshToken = req.body.refreshToken
});
