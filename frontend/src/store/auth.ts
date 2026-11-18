import {
  ApiError,
  apiRequest,
  type ApiUser,
  type AuthPayload,
} from "@/lib/api";
import {
  clearPersistedSession,
  loadPersistedSession,
  persistSession,
} from "@/lib/session";
import type { UserRole } from "@/constants/roles";
import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/schemas/auth";
import { create } from "zustand";

type FieldErrors = Partial<Record<"identity" | "password", string>>;
type ForgotErrors = Partial<Record<"email", string>>;
type SignUpRole = "athlete" | "coach";
type SignUpErrors = Partial<Record<"fullName" | "email" | "password", string>>;
type ToastIcon = "info" | "success" | "shield";
type ToastState = { message: string; icon: ToastIcon } | null;

type AuthState = {
  identity: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
  isSubmitting: boolean;
  role: UserRole | null;
  user: ApiUser | null;
  token: string | null;
  isHydrated: boolean;
  errors: FieldErrors;
  signUpRole: SignUpRole;
  signUpFullName: string;
  signUpEmail: string;
  signUpPassword: string;
  showSignUpPassword: boolean;
  signUpSubmitting: boolean;
  signUpErrors: SignUpErrors;
  forgotOpen: boolean;
  forgotEmail: string;
  forgotErrors: ForgotErrors;
  forgotSubmitting: boolean;
  toast: ToastState;
  hydrate: () => Promise<void>;
  setIdentity: (value: string) => void;
  setPassword: (value: string) => void;
  toggleRememberMe: () => void;
  toggleShowPassword: () => void;
  submitSignIn: () => Promise<UserRole | null>;
  setRole: (role: UserRole | null) => void;
  signOut: () => void;
  setSignUpRole: (role: SignUpRole) => void;
  setSignUpFullName: (value: string) => void;
  setSignUpEmail: (value: string) => void;
  setSignUpPassword: (value: string) => void;
  toggleShowSignUpPassword: () => void;
  submitSignUp: () => Promise<UserRole | null>;
  handleOAuth: (provider: string) => void;
  openForgotModal: () => void;
  closeForgotModal: () => void;
  setForgotEmail: (value: string) => void;
  submitForgotPassword: () => Promise<void>;
  showToast: (message: string, icon?: ToastIcon) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

function pickErrors<K extends string>(
  details: Record<string, string> | undefined,
  fields: readonly K[],
): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};
  if (!details) {
    return errors;
  }
  for (const field of fields) {
    if (details[field]) {
      errors[field] = details[field];
    }
  }
  return errors;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  identity: "",
  password: "",
  rememberMe: true,
  showPassword: false,
  isSubmitting: false,
  role: null,
  user: null,
  token: null,
  isHydrated: false,
  errors: {},
  signUpRole: "athlete",
  signUpFullName: "",
  signUpEmail: "",
  signUpPassword: "",
  showSignUpPassword: false,
  signUpSubmitting: false,
  signUpErrors: {},
  forgotOpen: false,
  forgotEmail: "",
  forgotErrors: {},
  forgotSubmitting: false,
  toast: null,

  hydrate: async () => {
    const stored = await loadPersistedSession();

    if (!stored) {
      set({ isHydrated: true });
      return;
    }

    try {
      const user = await apiRequest<ApiUser>("/api/auth/me", {
        token: stored.token,
      });
      await persistSession({ token: stored.token, user }, true);
      set({
        role: user.role,
        user,
        token: stored.token,
        isHydrated: true,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await clearPersistedSession();
        set({ role: null, user: null, token: null, isHydrated: true });
        return;
      }

      set({
        role: stored.user.role,
        user: stored.user,
        token: stored.token,
        isHydrated: true,
      });
    }
  },

  setIdentity: (value) =>
    set({ identity: value, errors: { ...get().errors, identity: undefined } }),

  setPassword: (value) =>
    set({ password: value, errors: { ...get().errors, password: undefined } }),

  toggleRememberMe: () => set({ rememberMe: !get().rememberMe }),

  toggleShowPassword: () => set({ showPassword: !get().showPassword }),

  setRole: (role) => set({ role }),

  signOut: () => {
    void clearPersistedSession();
    set({
      role: null,
      user: null,
      token: null,
      identity: "",
      password: "",
      errors: {},
    });
  },

  submitSignIn: async () => {
    const { identity, password, rememberMe } = get();
    const result = signInSchema.safeParse({ identity, password });

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === "identity" || field === "password") {
          errors[field] = issue.message;
        }
      }
      set({ errors });
      return null;
    }

    set({ errors: {}, isSubmitting: true });

    try {
      const payload = await apiRequest<AuthPayload>("/api/auth/login", {
        method: "POST",
        body: {
          identity: result.data.identity,
          password: result.data.password,
        },
      });

      await persistSession(
        { token: payload.accessToken, user: payload.user },
        rememberMe,
      );

      set({
        isSubmitting: false,
        role: payload.user.role,
        user: payload.user,
        token: payload.accessToken,
      });

      const firstName = payload.user.fullName.split(" ")[0] || "Athlete";
      get().showToast(
        `Welcome back, ${firstName}! Loading telemetry...`,
        "success",
      );
      return payload.user.role;
    } catch (error) {
      set({ isSubmitting: false });

      if (error instanceof ApiError) {
        if (error.status === 401) {
          set({ errors: { password: error.message } });
          get().showToast(error.message, "shield");
        } else if (error.status === 422 && error.details) {
          const errors = pickErrors(error.details, [
            "identity",
            "password",
          ] as const);
          set({ errors });
          get().showToast(error.message, "info");
        } else {
          get().showToast(error.message, "info");
        }
      } else {
        get().showToast("Unexpected error. Please try again.", "info");
      }

      return null;
    }
  },

  setSignUpRole: (role) => set({ signUpRole: role }),

  setSignUpFullName: (value) =>
    set({
      signUpFullName: value,
      signUpErrors: { ...get().signUpErrors, fullName: undefined },
    }),

  setSignUpEmail: (value) =>
    set({
      signUpEmail: value,
      signUpErrors: { ...get().signUpErrors, email: undefined },
    }),

  setSignUpPassword: (value) =>
    set({
      signUpPassword: value,
      signUpErrors: { ...get().signUpErrors, password: undefined },
    }),

  toggleShowSignUpPassword: () =>
    set({ showSignUpPassword: !get().showSignUpPassword }),

  submitSignUp: async () => {
    const {
      signUpRole,
      signUpFullName,
      signUpEmail,
      signUpPassword,
      rememberMe,
    } = get();
    const result = signUpSchema.safeParse({
      role: signUpRole,
      fullName: signUpFullName,
      email: signUpEmail,
      password: signUpPassword,
    });

    if (!result.success) {
      const errors: SignUpErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === "fullName" || field === "email" || field === "password") {
          errors[field] = issue.message;
        }
      }
      set({ signUpErrors: errors });
      return null;
    }

    set({ signUpErrors: {}, signUpSubmitting: true });

    try {
      const payload = await apiRequest<AuthPayload>("/api/auth/register", {
        method: "POST",
        body: {
          fullName: result.data.fullName,
          email: result.data.email,
          password: result.data.password,
          role: result.data.role,
        },
      });

      await persistSession(
        { token: payload.accessToken, user: payload.user },
        rememberMe,
      );

      set({
        signUpSubmitting: false,
        role: payload.user.role,
        user: payload.user,
        token: payload.accessToken,
      });

      const firstName = payload.user.fullName.split(" ")[0] || "Athlete";
      get().showToast(
        `Account ready, ${firstName}! Welcome to RepRise.`,
        "success",
      );
      return payload.user.role;
    } catch (error) {
      set({ signUpSubmitting: false });

      if (error instanceof ApiError) {
        if (error.status === 422 && error.details) {
          const errors = pickErrors(error.details, [
            "fullName",
            "email",
            "password",
          ] as const);
          set({ signUpErrors: errors });
          get().showToast(error.message, "info");
        } else if (error.status === 409) {
          get().showToast("An account with that email already exists.", "info");
        } else {
          get().showToast(error.message, "info");
        }
      } else {
        get().showToast("Unexpected error. Please try again.", "info");
      }

      return null;
    }
  },

  handleOAuth: (provider) => {
    get().showToast(`Connecting via ${provider}...`, "shield");
  },

  openForgotModal: () => {
    const { identity } = get();
    set({
      forgotOpen: true,
      forgotEmail: identity.includes("@") ? identity : "",
      forgotErrors: {},
    });
  },

  closeForgotModal: () => {
    set({ forgotOpen: false, forgotErrors: {} });
  },

  setForgotEmail: (value) => {
    set({ forgotEmail: value, forgotErrors: {} });
  },

  submitForgotPassword: async () => {
    const { forgotEmail } = get();
    const result = forgotPasswordSchema.safeParse({ email: forgotEmail });

    if (!result.success) {
      set({
        forgotErrors: {
          email:
            result.error.issues[0]?.message ?? "Enter a valid email address.",
        },
      });
      return;
    }

    set({ forgotErrors: {}, forgotSubmitting: true });

    try {
      const response = await apiRequest<{ message: string }>(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: { email: result.data.email },
        },
      );

      set({ forgotSubmitting: false, forgotOpen: false, forgotEmail: "" });
      get().showToast(response.message, "success");
    } catch (error) {
      set({ forgotSubmitting: false });

      if (error instanceof ApiError) {
        if (error.status === 422 && error.details?.email) {
          set({ forgotErrors: { email: error.details.email } });
          return;
        }
        get().showToast(error.message, "info");
      } else {
        get().showToast("Unexpected error. Please try again.", "info");
      }
    }
  },

  showToast: (message, icon = "info") => {
    set({ toast: { message, icon } });
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => set({ toast: null }), 2800);
  },
}));
