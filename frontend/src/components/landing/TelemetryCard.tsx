import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { TELEMETRY_STAGES } from "@/constants/landing";

export function TelemetryCard() {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let value = 15;

    const tick = () => {
      if (value < 100) {
        value = Math.min(100, value + Math.floor(Math.random() * 3) + 2);
        setProgress(value);
        timer = setTimeout(tick, 60 + Math.random() * 40);
        return;
      }

      timer = setTimeout(() => {
        value = 12;
        setProgress(value);
        tick();
      }, 4200);
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);

  const status = [...TELEMETRY_STAGES]
    .reverse()
    .find((stage) => progress >= stage.at)?.label;

  return (
    <View className="mb-4 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3.5 py-2.5 shadow-sm dark:border-[#2c2b32] dark:bg-[#1C1B1F]">
      <View className="mb-1.5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="relative h-2 w-2">
            <View className="absolute h-2 w-2 rounded-full bg-[#cba052] opacity-75" />
            <View className="relative h-2 w-2 rounded-full bg-[#b38538] dark:bg-[#dec2a4]" />
          </View>
          <Text
            className="max-w-[210px] font-body-medium text-[11px] tracking-wide text-on-surface dark:text-gray-200"
            numberOfLines={1}>
            {status}
          </Text>
        </View>
        <Text className="font-body-bold text-[11px] text-[#8a621c] dark:text-[#dec2a4]">
          {progress}%
        </Text>
      </View>

      <View className="h-1.5 w-full rounded-full border border-outline-variant/20 bg-surface-container p-[1px] dark:border-[#2e2d33] dark:bg-[#121316]">
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 9999,
            overflow: "hidden",
            shadowColor: "#cba052",
            shadowOpacity: 0.5,
            shadowRadius: 8,
          }}>
          <Svg width="100%" height="100%" viewBox="0 0 100 4" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="telemetryFill" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#b38538" />
                <Stop offset="50%" stopColor="#dec2a4" />
                <Stop offset="100%" stopColor="#f5decd" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100" height="4" rx="2" fill="url(#telemetryFill)" />
          </Svg>
        </View>
      </View>
    </View>
  );
}
