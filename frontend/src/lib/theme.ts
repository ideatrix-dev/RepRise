import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, type Theme } from "expo-router";

export const THEME = {
  light: {
    background: "hsl(36 33% 98%)",
    foreground: "hsl(60 3% 11%)",
    card: "hsl(0 0% 100%)",
    destructive: "hsl(0 74% 42%)",
    primary: "hsl(30 17% 35%)",
    border: "hsl(25 12% 78%)",
  },
  dark: {
    background: "hsl(240 5% 8%)",
    foreground: "hsl(0 0% 95%)",
    card: "hsl(240 5% 11%)",
    destructive: "hsl(0 62% 30%)",
    primary: "hsl(38 56% 74%)",
    border: "hsl(240 4% 18%)",
  },
};

export type ThemePreference = "light" | "dark";

const THEME_PREFERENCE_KEY = "reprisetttheme";

export async function getThemePreference(): Promise<ThemePreference | null> {
  const value = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function setThemePreference(theme: ThemePreference) {
  return AsyncStorage.setItem(THEME_PREFERENCE_KEY, theme).catch(() => undefined);
}

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
