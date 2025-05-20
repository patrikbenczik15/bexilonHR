import express from "express";
import { UserController } from "../controllers/index.ts";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

export default router;
