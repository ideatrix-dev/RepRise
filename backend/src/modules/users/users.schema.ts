import { z } from "zod";

export const updateMeSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(120).optional(),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        /^[a-z0-9._-]{3,24}$/,
        "Username must be 3-24 characters (letters, numbers, dot, dash, underscore).",
      )
      .optional(),
  })
  .refine((value) => value.fullName !== undefined || value.username !== undefined, {
    message: "Provide at least one field to update.",
  });

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
