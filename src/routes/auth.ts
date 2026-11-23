import { Router } from "express";
import * as authController from "../controllers/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../schemas/auth.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema, "body"),
    authController.register,
);
router.post("/login", validate(loginSchema, "body"), authController.login);

export default router;
