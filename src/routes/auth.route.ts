import { Router } from "express";
import { login, profile, register } from "../controllers/auth.controller";
const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(profile);

export default router;
