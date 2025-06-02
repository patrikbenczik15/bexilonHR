import express from "express";
import { UserController } from "../controllers/index.ts";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.post("/check-email", UserController.checkEmail);
export default router;
