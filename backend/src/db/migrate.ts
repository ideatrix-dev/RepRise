import fs from "node:fs";
import path from "node:path";
import { closePool, query } from "../config/db";

async function migrate(): Promise<void> {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  await query(sql);
  console.log("Database schema applied successfully.");
}

migrate()
  .catch((error) => {
    console.error("Database migration failed:", error);
    process.exitCode = 1;
  })
  .finally(() => closePool());
