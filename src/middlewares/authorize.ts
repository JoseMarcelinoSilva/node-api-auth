import type { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.js";
import { UnauthorizedError } from "../services/auth.js";

export async function authorize(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const token = extractBearerToken(req.header("authorization"));

        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await authService.validateToken(token);
        req.userId = user.id;
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

function extractBearerToken(header: string | undefined) {
    if (!header) {
        return null;
    }

    const [scheme, token, extra] = header.split(" ");

    if (scheme !== "Bearer" || !token || extra !== undefined) {
        return null;
    }

    return token;
}
