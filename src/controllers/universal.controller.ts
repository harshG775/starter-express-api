import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../errors/ApiError";
import { clientError } from "../utils/httpStatus";

export const universal = asyncHandler(async (req: Request, res: Response) => {
    throw new ApiError(clientError.NotFound, "endpoint not found");
});
