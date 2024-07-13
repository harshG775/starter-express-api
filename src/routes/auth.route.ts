import { Router } from "express";
import { login, profile, refreshAccessToken, register } from "../controllers/auth.controller";
const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(profile);
router.route("/refresh-token").get(refreshAccessToken);

export default router;
