import { Router } from "express";
import { AppError } from "../../lib/errors";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/error";
import { findUserById, toPublicUser } from "../users/users.service";
import { forgotPasswordSchema, loginSchema, registerSchema } from "./auth.schema";
import { loginUser, registerUser } from "./auth.service";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ success: true, data: result });
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
  const result = await loginUser(req.body);
  res.json({ success: true, data: result });
});

authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), async (_req, res) => {
  res.status(202).json({
    success: true,
    data: {
      message: "If an account exists for that email, a reset link will be sent.",
    },
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await findUserById(req.user!.id);
  if (!user) {
    throw new AppError(404, "User not found.");
  }
  res.json({ success: true, data: toPublicUser(user) });
});
