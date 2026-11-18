import { Platform } from "react-native";
import type { UserRole } from "@/constants/roles";

export type ApiUser = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type AuthPayload = {
  user: ApiUser;
  accessToken: string;
  tokenType: "Bearer";
};

type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = {
  success: false;
  error: { message: string; details?: Record<string, string> };
};
type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  readonly status: number;
  readonly details?: Record<string, string>;

  constructor(status: number, message: string, details?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const fallbackBaseUrl =
  Platform.select({
    android: "http://10.0.2.2:5000",
    default: "http://localhost:5000",
  }) ?? "http://localhost:5000";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? fallbackBaseUrl
).replace(/\/+$/, "");

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch {
    throw new ApiError(
      0,
      "Cannot reach the server. Check your connection and that the backend is running.",
    );
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload || payload.success === false) {
    const error = payload && payload.success === false ? payload.error : null;
    throw new ApiError(
      response.status,
      error?.message ?? "Something went wrong. Please try again.",
      error?.details,
    );
  }

  return payload.data;
}
