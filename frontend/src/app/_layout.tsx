import "../../global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { ROLE_HOME } from "@/constants/roles";
import { useAuthStore } from "@/store/auth";

export default function RootLayout() {
  const role = useAuthStore((state) => state.role);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydrate = useAuthStore((state) => state.hydrate);
  const authenticatedRedirect = role ? ROLE_HOME[role] : "/auth/sign-in";

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!role} redirectTo={authenticatedRedirect}>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      <Stack.Protected
        guard={role === "athlete"}
        redirectTo={authenticatedRedirect}
      >
        <Stack.Screen name="athlete" />
      </Stack.Protected>

      <Stack.Protected
        guard={role === "coach"}
        redirectTo={authenticatedRedirect}
      >
        <Stack.Screen name="coach" />
      </Stack.Protected>

      <Stack.Protected
        guard={role === "manager"}
        redirectTo={authenticatedRedirect}
      >
        <Stack.Screen name="manager" />
      </Stack.Protected>

      <Stack.Protected
        guard={role === "admin"}
        redirectTo={authenticatedRedirect}
      >
        <Stack.Screen name="admin" />
      </Stack.Protected>
    </Stack>
  );
}
