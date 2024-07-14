import { Router } from "express";
import { universal } from "../controllers/universal.controller";
const router = Router();

router.route("*").get(universal);

export default router;
