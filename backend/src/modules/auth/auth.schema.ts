import { z } from "zod";
import { SELF_SIGNUP_ROLES } from "../../constants/roles";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address."));

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[0-9]/, "Password must include at least 1 number.")
  .regex(/[^A-Za-z0-9]/, "Password must include at least 1 symbol.");

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(SELF_SIGNUP_ROLES).default("athlete"),
});

export const loginSchema = z.object({
  identity: z.string().trim().toLowerCase().min(1, "Email or username is required."),
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
