import { z } from "zod";

export const signInSchema = z.object({
  identity: z.string().trim().min(1, "Email or username is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = z.object({
  role: z.enum(["athlete", "coach"]),
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Password must include at least 1 number.")
    .regex(/[^A-Za-z0-9]/, "Password must include at least 1 symbol."),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
});
