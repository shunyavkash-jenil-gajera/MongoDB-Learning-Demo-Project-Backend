import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../controllers/auth/authencation.controller.js";
import use from "../errorHandler/globle.error.handler.js";

const router = Router();

router.post("/register", use(registerUser));
router.post("/login", use(loginUser));

export default router;
