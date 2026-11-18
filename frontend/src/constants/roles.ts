import type { Href } from "expo-router";

export type UserRole = "athlete" | "coach" | "manager" | "admin";

export const ROLE_HOME: Record<UserRole, Href> = {
  athlete: "/athlete",
  coach: "/coach",
  manager: "/manager",
  admin: "/admin",
};

export const DEMO_ROLE_BY_IDENTITY: Record<string, UserRole> = {
  "lifter@reprise.fit": "athlete",
  "athlete@reprise.fit": "athlete",
  "coach@reprise.fit": "coach",
  "manager@reprise.fit": "manager",
  "admin@reprise.fit": "admin",
  athlete: "athlete",
  coach: "coach",
  manager: "manager",
  admin: "admin",
};

export function roleForIdentity(identity: string): UserRole {
  return DEMO_ROLE_BY_IDENTITY[identity.trim().toLowerCase()] ?? "athlete";
}
