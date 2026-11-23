import type { Request, Response } from "express";
import * as authService from "../services/auth.js";
import { ConflictError, UnauthorizedError } from "../services/auth.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.js";

export async function register(req: Request, res: Response) {
    try {
        const body = req.body as RegisterInput;
        const user = await authService.registerUser(body);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof ConflictError) {
            res.status(409).json({ error: "Email already in use" });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const body = req.body as LoginInput;
        const session = await authService.loginUser(body);
        res.status(200).json(session);
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
