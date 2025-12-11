import { Router } from "express";
import { signIn, signUp } from "../controllers/auth/index.auth.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../validation/auth.validation.js";

const router = Router();

router.post("/sign-up", validate(userRegisterSchema), signUp);
router.post("/log-in", validate(userLoginSchema), signIn);

export default router;
