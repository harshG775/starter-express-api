import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
        message: "register",
    });
});
