import type { UserRole } from "../../constants/roles";
import { query } from "../../config/db";
import { AppError } from "../../lib/errors";

export type UserRow = {
  id: string;
  full_name: string;
  email: string;
  username: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
};

export type UserWithPasswordRow = UserRow & {
  password_hash: string;
};

export type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

const USER_COLUMNS =
  "id, full_name, email, username, role, created_at, updated_at";

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    username: row.username,
    role: row.role,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const { rows } = await query<UserRow>(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function findUserByIdentity(
  identity: string,
): Promise<UserWithPasswordRow | null> {
  const { rows } = await query<UserWithPasswordRow>(
    `SELECT ${USER_COLUMNS}, password_hash
     FROM users
     WHERE email = $1 OR username = $1
     LIMIT 1`,
    [identity],
  );
  return rows[0] ?? null;
}

export async function usernameExists(username: string): Promise<boolean> {
  const { rows } = await query<{ exists: boolean }>(
    "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1) AS exists",
    [username],
  );
  return rows[0]?.exists ?? false;
}

export async function createUser(input: {
  fullName: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
}): Promise<UserRow> {
  const { rows } = await query<UserRow>(
    `INSERT INTO users (full_name, email, username, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${USER_COLUMNS}`,
    [input.fullName, input.email, input.username, input.passwordHash, input.role],
  );

  const user = rows[0];
  if (!user) {
    throw new AppError(500, "Failed to create user.");
  }
  return user;
}

export async function updateUser(
  id: string,
  input: { fullName?: string; username?: string },
): Promise<UserRow> {
  const assignments: string[] = [];
  const values: unknown[] = [];

  if (input.fullName !== undefined) {
    values.push(input.fullName);
    assignments.push(`full_name = $${values.length}`);
  }

  if (input.username !== undefined) {
    values.push(input.username);
    assignments.push(`username = $${values.length}`);
  }

  if (assignments.length === 0) {
    const current = await findUserById(id);
    if (!current) {
      throw new AppError(404, "User not found.");
    }
    return current;
  }

  assignments.push("updated_at = now()");
  values.push(id);

  const { rows } = await query<UserRow>(
    `UPDATE users
     SET ${assignments.join(", ")}
     WHERE id = $${values.length}
     RETURNING ${USER_COLUMNS}`,
    values,
  );

  const user = rows[0];
  if (!user) {
    throw new AppError(404, "User not found.");
  }
  return user;
}

export async function listUsers(
  limit: number,
  offset: number,
): Promise<{ users: UserRow[]; total: number }> {
  const [usersResult, countResult] = await Promise.all([
    query<UserRow>(
      `SELECT ${USER_COLUMNS}
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    ),
    query<{ count: string }>("SELECT COUNT(*)::text AS count FROM users"),
  ]);

  return {
    users: usersResult.rows,
    total: Number(countResult.rows[0]?.count ?? 0),
  };
}
