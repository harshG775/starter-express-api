import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { PrismaClient, Role } from "@prisma/client";
import { clientError, clientSuccess } from "../utils/httpStatus";
import ApiError from "../errors/ApiError";

import { z } from "zod";
import { email, password, username } from "../schemas/z.schema";

import bcrypt from "bcrypt";
import createToken from "../utils/createTokenJWT";

export const prisma = new PrismaClient();

const registerSchema = z.object({ username, email, password, });
const loginSchema = z.object({ email, password, });

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    /* check if form is valid */
    const { success, error, data: registerForm, } = registerSchema.safeParse({ username, email, password, });
    if (!success) {
        throw new ApiError(clientError.Conflict, error?.errors[0].message);
    }
    /* check if user already exists */
    const existingEmail = await prisma.user.findUnique({
        where: {
            email: registerForm.email,
        },
    });
    if (existingEmail) {
        throw new ApiError(clientError.Conflict, "user with this email already exists");
    }
    const existingUsername = await prisma.user.findUnique({
        where: {
            username: registerForm.username,
        },
    });
    if (existingUsername) {
        throw new ApiError(clientError.Conflict, "user with this username already exists");
    }
    /* create new user */
    const hashedPassword = await bcrypt.hash(registerForm.password, 10);
    await prisma.user.create({
        data: {
            username: registerForm.username,
            email: registerForm.email,
            password: hashedPassword,
        }, 
    });
    //
    res.status(clientSuccess.OK).json({
        success: true,
        message: "User created successfully",
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    /*check if form is valid*/
    const { success, error, data: loginForm, } = loginSchema.safeParse({ email, password, });
    if (!success) {
        throw new ApiError(clientError.Conflict, error?.errors[0].message);
    }
    /* check if user exists */
    const user = await prisma.user.findUnique({
        where: {
            email: loginForm.email,
        },
        select: {
            email: true,
            password: true,
        }
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
    //

    // const token = createToken({
    //     tokenType: "accessToken",
    //     user: {
    //         username: user.username,
    //         email: user.email,
    //         password: user.password,
    //     },
    // });
    

    // res.cookie("refreshToken", user.refreshToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "lax",
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
    return res.status(200).json({
        success: true,
        message: "Login successfully",
    });
});
