import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./lib/env";
import { deleteExpiredRefreshTokens } from "./utils/deleteExpiredToken";
const app = express();

app.use(
    cors({
        origin: env.CORS_ORIGINS.split(","),
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

// middleware
// app.use("/api/v1/users", authenticateUser);

// routes import
import welcomeRoute from "./routes/welcome.route";
import authRouter from "./routes/auth.route";

app.use("/api/", welcomeRoute);
app.use("/api/v1/auth", authRouter);


export default app;
