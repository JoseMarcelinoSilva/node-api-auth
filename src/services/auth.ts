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
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

function createSessionToken() {
  return randomBytes(32).toString("hex");
}

function toAuthUser(user: { id: string; email: string; token: string | null }) {
  return {
    id: user.id,
    email: user.email,
    token: user.token!,
  };
}

export async function register(input: RegisterInput) {
  try {
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email));

    if (existingUser) {
      throw new ConflictError();
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const token = createSessionToken();

    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        password: hashedPassword,
        token,
      })
      .returning({
        id: users.id,
        email: users.email,
        token: users.token,
      });

    return toAuthUser(user);
  } catch (error) {
    throw error;
  }
}

export async function login(input: LoginInput) {
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

    const token = createSessionToken();

    const [updatedUser] = await db
      .update(users)
      .set({ token })
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        email: users.email,
        token: users.token,
      });

    return toAuthUser(updatedUser);
  } catch (error) {
    throw error;
  }
}

export async function findUserByToken(token: string) {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.token, token));

    return user ?? null;
  } catch (error) {
    throw error;
  }
}
