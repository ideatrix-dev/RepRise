import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { setThemePreference } from "@/lib/theme";
import { MaterialIcon } from "./MaterialIcon";

const OPTION_SIZE = 28;
const TRACK_PADDING = 4;

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, { duration: 220 });
  }, [isDark, progress]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * OPTION_SIZE }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light theme" : "Switch to dark theme"}
      hitSlop={6}
      onPress={() => {
        const nextTheme = isDark ? "light" : "dark";
        setColorScheme(nextTheme);
        void setThemePreference(nextTheme);
      }}
      style={{
        width: OPTION_SIZE * 2 + TRACK_PADDING * 2 + 2,
        height: OPTION_SIZE + TRACK_PADDING * 2 + 2,
        padding: TRACK_PADDING,
        position: "relative",
      }}
      className="flex-row items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-low/80 dark:border-white/10 dark:bg-white/10">
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: TRACK_PADDING,
            left: TRACK_PADDING,
            width: OPTION_SIZE,
            height: OPTION_SIZE,
            borderRadius: 9999,
            backgroundColor: "rgba(203,160,82,0.28)",
          },
          indicatorStyle,
        ]}
      />

      <View style={{ width: OPTION_SIZE, height: OPTION_SIZE }} className="items-center justify-center">
        <MaterialIcon
          name="light_mode"
          className={`text-[17px] ${isDark ? "text-gray-400" : "text-[#8a621c]"}`}
        />
      </View>

      <View style={{ width: OPTION_SIZE, height: OPTION_SIZE }} className="items-center justify-center">
        <MaterialIcon
          name="dark_mode"
          className={`text-[17px] ${isDark ? "text-[#dec2a4]" : "text-gray-500"}`}
        />
      </View>
    </Pressable>
  );
}
