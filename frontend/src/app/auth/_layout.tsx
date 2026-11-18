import "../../../global.css";

import { useEffect, useRef, useState } from "react";
import { Stack, ThemeProvider } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { MaterialSymbols_400Regular } from "@expo-google-fonts/material-symbols/400Regular";
import { MaterialSymbols_500Medium } from "@expo-google-fonts/material-symbols/500Medium";
import { PlusJakartaSans_400Regular } from "@expo-google-fonts/plus-jakarta-sans/400Regular";
import { PlusJakartaSans_500Medium } from "@expo-google-fonts/plus-jakarta-sans/500Medium";
import { PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans/600SemiBold";
import { PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans/700Bold";
import { getThemePreference, NAV_THEME } from "@/lib/theme";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    MaterialSymbols_400Regular,
    MaterialSymbols_500Medium,
  });

  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeReady, setThemeReady] = useState(false);
  const setColorSchemeRef = useRef(setColorScheme);

  useEffect(() => {
    setColorSchemeRef.current = setColorScheme;
  }, [setColorScheme]);

  useEffect(() => {
    let cancelled = false;

    getThemePreference()
      .then((preference) => {
        if (cancelled) return;
        setColorSchemeRef.current(preference ?? "light");
        setThemeReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setColorSchemeRef.current("light");
        setThemeReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && themeReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, themeReady]);

  if ((!fontsLoaded && !fontError) || !themeReady) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </ThemeProvider>
  );
}
