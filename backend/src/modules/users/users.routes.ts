import { Router } from "express";
import { AppError } from "../../lib/errors";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validateBody } from "../../middleware/error";
import { listUsersQuerySchema, updateMeSchema } from "./users.schema";
import { findUserById, listUsers, toPublicUser, updateUser } from "./users.service";

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get("/me", async (req, res) => {
  const user = await findUserById(req.user!.id);
  if (!user) {
    throw new AppError(404, "User not found.");
  }
  res.json({ success: true, data: toPublicUser(user) });
});

usersRouter.patch("/me", validateBody(updateMeSchema), async (req, res) => {
  const user = await updateUser(req.user!.id, req.body);
  res.json({ success: true, data: toPublicUser(user) });
});

usersRouter.get("/", requireRole("admin"), async (req, res) => {
  const parsed = listUsersQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    const details: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "query";
      if (!details[key]) {
        details[key] = issue.message;
      }
    }
    throw new AppError(422, "Invalid query parameters.", details);
  }

  const { page, limit } = parsed.data;
  const { users, total } = await listUsers(limit, (page - 1) * limit);

  res.json({
    success: true,
    data: {
      items: users.map(toPublicUser),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});
