import { z } from "zod";

const emailField = z.string().email().toLowerCase();
const passwordField = z.string().min(4);

export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
