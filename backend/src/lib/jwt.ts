import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { ROLES, type UserRole } from "../constants/roles";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

const accessTokenSchema = z.object({
  sub: z.uuid(),
  email: z.email(),
  role: z.enum(ROLES),
});

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload.");
  }

  return accessTokenSchema.parse({
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  });
}
