import { app } from "./app";
import { closePool, query } from "./config/db";
import { env } from "./config/env";

async function start(): Promise<void> {
  await query("SELECT 1");

  const server = app.listen(env.PORT, () => {
    console.log(`RepRise API listening on http://localhost:${env.PORT}`);
  });

  let isShuttingDown = false;

  const shutdown = (signal: string): void => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;
    console.log(`${signal} received, shutting down...`);

    server.close(async () => {
      await closePool();
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch(async (error) => {
  console.error("Failed to start server:", error);
  await closePool().catch(() => undefined);
  process.exit(1);
});
