import { randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.js";

export class ConflictError extends Error {
    constructor(message = "Email already in use") {
        super(message);
        this.name = "ConflictError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message = "Invalid email or password") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export async function registerUser(input: RegisterInput) {
    try {
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, input.email));

        if (existingUser) {
            throw new ConflictError();
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const [user] = await db
            .insert(users)
            .values({
                email: input.email,
                password: hashedPassword,
            })
            .returning({
                id: users.id,
                email: users.email,
            });

        return user;
    } catch (error) {
        throw error;
    }
}

export async function loginUser(input: LoginInput) {
    try {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, input.email));

        const passwordMatches = user
            ? await bcrypt.compare(input.password, user.password)
            : false;

        if (!user || !passwordMatches) {
            throw new UnauthorizedError();
        }

        const token = randomBytes(32).toString("hex");

        const [session] = await db
            .update(users)
            .set({ token })
            .where(eq(users.id, user.id))
            .returning({
                id: users.id,
                token: users.token,
            });

        return session;
    } catch (error) {
        throw error;
    }
}

export async function validateToken(token: string) {
    try {
        if (!token) {
            throw new UnauthorizedError("Invalid token");
        }

        const [user] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.token, token));

        if (!user) {
            throw new UnauthorizedError("Invalid token");
        }

        return user;
    } catch (error) {
        throw error;
    }
}
