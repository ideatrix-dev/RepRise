import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrandMark } from "@/components/landing/BrandMark";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { MaterialIcon } from "@/components/landing/MaterialIcon";
import { TelemetryCard } from "@/components/landing/TelemetryCard";
import { ThemeToggle } from "@/components/landing/ThemeToggle";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const compact = height < 740;

  return (
    <View className="flex-1 bg-surface dark:bg-[#121316]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex-1 justify-between px-margin pb-1">
          <View className="w-full flex-row items-center justify-end pb-1 pt-2">
            <ThemeToggle />
          </View>

          <BrandMark compact={compact} />
          <FeatureCard compact={compact} />
          <TelemetryCard />

          <View className="w-full gap-space-sm">
            <Pressable
              accessibilityRole="button"
              onPress={() => router.navigate("/auth/sign-up")}
              style={{
                shadowColor: "rgba(140, 122, 107, 0.25)",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 14,
                elevation: 4,
              }}
              className="active:scale-95 relative w-full flex-row items-center justify-center gap-2 overflow-hidden rounded-full bg-on-surface px-gutter py-3.5 shadow-md dark:bg-surface-container-lowest"
            >
              <Text className="font-body-bold text-label-lg uppercase tracking-wider text-surface dark:text-on-surface">
                Build My Training Plan
              </Text>
              <MaterialIcon
                name="arrow_forward"
                medium
                className="text-[20px] text-secondary-fixed dark:text-secondary"
              />
            </Pressable>

            <View className="w-full pb-0.5 pt-1.5">
              <Text className="text-center font-body text-body-sm text-on-surface-variant dark:text-[#A1A1AA]">
                Already have an account?{" "}
                <Text
                  onPress={() => router.navigate("/auth/sign-in")}
                  className="font-body-semibold text-secondary underline dark:text-secondary-fixed"
                >
                  Sign in
                </Text>
              </Text>
            </View>
          </View>

          <View className="w-full flex-row items-center justify-center pb-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-body-semibold text-label-sm uppercase tracking-widest text-on-surface-variant/70 dark:text-[#A1A1AA]">
                Train
              </Text>
              <View className="h-1 w-1 rounded-full bg-secondary dark:bg-secondary-fixed" />
              <Text className="font-body-semibold text-label-sm uppercase tracking-widest text-on-surface-variant/70 dark:text-[#A1A1AA]">
                Track
              </Text>
              <View className="h-1 w-1 rounded-full bg-secondary dark:bg-secondary-fixed" />
              <Text className="font-body-semibold text-label-sm uppercase tracking-widest text-on-surface-variant/70 dark:text-[#A1A1AA]">
                Rise
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
