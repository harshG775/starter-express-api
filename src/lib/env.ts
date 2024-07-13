import dotenv from "dotenv";
import { z } from "zod";
dotenv.config({
    path: "./.env",
});
const envSchema = z.object({
    PORT: z.string().min(1, { message: "ENV PORT" }),
    DATABASE_URL: z.string().min(1, { message: "ENV DATABASE_URL" }),
    JWT_SECRET: z.string().min(1, { message: "ENV JWT_SECRET" }),
    REFRESH_TOKEN_EXPIRE_IN: z.string().min(1, { message: "ENV REFRESH_TOKEN_EXPIRE_IN" }),
    EXCESS_TOKEN_EXPIRE_IN: z.string().min(1, { message: "ENV EXCESS_TOKEN_EXPIRE_IN" }),
    CORS_ORIGINS: z.string().min(1, { message: "ENV CORS_ORIGINS URLs" }),
    DELETE_EXPIRE_TOKEN_IN:z.string().min(1, { message: "ENV DELETE_EXPIRE_TOKEN_MILLISECONDS" }),
});

export const env = envSchema.parse(process.env);
