import { Pool, type QueryResult, type QueryResultRow } from "pg";
import { env, isProduction } from "./env";

const requiresSsl =
  isProduction || /sslmode=(require|verify-ca|verify-full)/.test(env.DATABASE_URL);

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ...(requiresSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function closePool(): Promise<void> {
  await pool.end();
}
