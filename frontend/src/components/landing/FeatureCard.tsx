import { Text, View } from "react-native";
import { MaterialIcon } from "./MaterialIcon";

const FEATURES = [
  {
    icon: "fitness_center",
    title: "Strength",
    subtitle: "Track your lifts",
  },
  {
    icon: "trending_up",
    title: "Volume",
    subtitle: "Build your workload",
  },
  {
    icon: "speed",
    title: "Progress",
    subtitle: "Rise every session",
  },
] as const;

export function FeatureCard({ compact = false }: { compact?: boolean }) {
  return (
    <View
      className={`w-full rounded-xl border border-outline-variant/40 bg-surface-container-low shadow-sm dark:border-[#2c2b32] dark:bg-[#1C1B1F] ${compact ? "mb-2 p-2.5" : "mb-3 p-3.5"}`}>
      <View
        className={`flex-row items-center justify-between border-b border-outline-variant/30 dark:border-[#2c2b32] ${compact ? "mb-1.5 pb-1.5" : "mb-2.5 pb-2.5"}`}>
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-[#cba052] shadow-[0_0_8px_rgba(203,160,82,0.6)] dark:bg-[#dec2a4]" />
          <Text className="font-body-semibold text-label-sm uppercase tracking-widest text-on-surface-variant dark:text-gray-300">
            Your Fitness Journey
          </Text>
        </View>
        <View className="rounded-full border border-[#cba052]/30 bg-[#dec2a4]/35 px-2 py-0.5 dark:border-[#dec2a4]/20 dark:bg-[#cba052]/20">
          <Text className="font-body-bold text-[11px] uppercase tracking-wider text-[#8a621c] dark:text-[#ebd29f]">
            Ready
          </Text>
        </View>
      </View>

      <View className={compact ? "gap-1.5" : "gap-2"}>
        {FEATURES.map((feature) => (
          <View
            key={feature.title}
            className={`flex-row items-center justify-between rounded-lg border border-outline-variant/20 bg-surface dark:border-[#26252b] dark:bg-[#121316] ${compact ? "p-2" : "p-2.5"}`}>
            <View className="flex-row items-center gap-2.5">
              <View
                className={`items-center justify-center rounded-full bg-on-surface/5 dark:bg-white/10 ${compact ? "h-6 w-6" : "h-7 w-7"}`}>
                <MaterialIcon
                  name={feature.icon}
                  className={`text-primary dark:text-[#dec2a4] ${compact ? "text-[14px]" : "text-[16px]"}`}
                />
              </View>
              <View>
                <Text className="font-body-bold text-label-sm uppercase tracking-wider text-on-surface dark:text-white">
                  {feature.title}
                </Text>
                <Text className="font-body text-[12px] text-on-surface-variant dark:text-gray-400">
                  {feature.subtitle}
                </Text>
              </View>
            </View>
            <MaterialIcon
              name="check_circle"
              className="text-[18px] text-gold-600 dark:text-[#dec2a4]"
            />
          </View>
        ))}
      </View>
    </View>
  );
}
