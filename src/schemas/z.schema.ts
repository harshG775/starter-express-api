import { z } from "zod";
export const name = z
    .string()
    .min(1, { message: "Missing required field: Name" })
    .max(20, { message: "Name must be at most 20 characters long" });
export const email = z
    .string()
    .min(1, { message: "Missing required field: Email" })
    .email({ message: "Invalid email address" });
export const password = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" });
