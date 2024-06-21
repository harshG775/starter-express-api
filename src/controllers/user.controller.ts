import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/httpStatus";

export const register = asyncHandler(async (req: Request, res: Response) => {
    res.status(success.Created).json({
        message: "register",
    });
});
