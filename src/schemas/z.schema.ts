import { z } from "zod";
export const username = z
    .string()
    .min(1, { message: "Username must be at least 1 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" });
export const email = z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" });
export const password = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" });
