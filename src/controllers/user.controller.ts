import { Request, Response } from "express";
import { success } from "../utils/httpStatus";
import { asyncPromiseHandler } from "../utils/asyncHandler";

export const register = asyncPromiseHandler((req: Request, res: Response) => {
    throw new Error("test error");

    res.status(success.Created).json({
        message: "register",
    });
});
