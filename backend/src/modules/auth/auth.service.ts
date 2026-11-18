import type { UserRole } from "../../constants/roles";
import { AppError } from "../../lib/errors";
import { signAccessToken } from "../../lib/jwt";
import { hashPassword, verifyPassword } from "../../lib/password";
import {
  createUser,
  findUserByIdentity,
  toPublicUser,
  usernameExists,
  type PublicUser,
} from "../users/users.service";

export type AuthResult = {
  user: PublicUser;
  accessToken: string;
  tokenType: "Bearer";
};

async function generateUniqueUsername(email: string): Promise<string> {
  const base =
    email
      .split("@")[0]
      ?.toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .slice(0, 20) || "user";
  const seed = base.length >= 3 ? base : `${base}user`;

  if (!(await usernameExists(seed))) {
    return seed;
  }

  for (let attempt = 2; attempt <= 50; attempt += 1) {
    const candidate = `${seed}${attempt}`.slice(0, 24);
    if (!(await usernameExists(candidate))) {
      return candidate;
    }
  }

  return `${seed}${Date.now().toString(36)}`.slice(0, 24);
}

export async function registerUser(input: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<AuthResult> {
  const username = await generateUniqueUsername(input.email);
  const passwordHash = await hashPassword(input.password);

  const user = await createUser({
    fullName: input.fullName,
    email: input.email,
    username,
    passwordHash,
    role: input.role,
  });

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { user: toPublicUser(user), accessToken, tokenType: "Bearer" };
}

export async function loginUser(input: {
  identity: string;
  password: string;
}): Promise<AuthResult> {
  const user = await findUserByIdentity(input.identity);

  if (!user) {
    throw new AppError(401, "Invalid email/username or password.");
  }

  const passwordMatches = await verifyPassword(input.password, user.password_hash);
  if (!passwordMatches) {
    throw new AppError(401, "Invalid email/username or password.");
  }

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { user: toPublicUser(user), accessToken, tokenType: "Bearer" };
}
