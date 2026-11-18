import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../lib/errors";

export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "body";
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      next(new AppError(422, "Validation failed.", fieldErrors));
      return;
    }

    req.body = result.data;
    next();
  };
}

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found.`));
}

type PostgresError = Error & { code?: string; detail?: string };

function isPostgresError(error: unknown): error is PostgresError {
  return error instanceof Error && typeof (error as PostgresError).code === "string";
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    });
    return;
  }

  if (isPostgresError(error) && error.code === "23505") {
    res.status(409).json({
      success: false,
      error: { message: "A record with those details already exists." },
    });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: { message: "Internal server error." },
  });
}
