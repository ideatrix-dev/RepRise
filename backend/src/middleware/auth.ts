import type { RequestHandler } from "express";
import { query } from "../config/db";
import { AppError } from "../lib/errors";
import { verifyAccessToken } from "../lib/jwt";
import type { UserRole } from "../constants/roles";

type UserAuthRow = {
  id: string;
  email: string;
  role: UserRole;
};

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required."));
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    next(new AppError(401, "Invalid or expired token."));
    return;
  }

  const { rows } = await query<UserAuthRow>(
    "SELECT id, email, role FROM users WHERE id = $1",
    [payload.sub],
  );

  const user = rows[0];
  if (!user) {
    next(new AppError(401, "Account no longer exists."));
    return;
  }

  req.user = { id: user.id, email: user.email, role: user.role };
  next();
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, "Authentication required."));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, "You do not have permission to perform this action."));
      return;
    }

    next();
  };
}
