export const ROLES = ["athlete", "coach", "manager", "admin"] as const;

export type UserRole = (typeof ROLES)[number];

export const SELF_SIGNUP_ROLES = ["athlete", "coach"] as const;

export type SelfSignupRole = (typeof SELF_SIGNUP_ROLES)[number];
