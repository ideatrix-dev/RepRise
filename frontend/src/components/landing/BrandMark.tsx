import { useEffect } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useColorScheme } from "nativewind";
import { LOGO_URI, RADAR_COLORS } from "@/constants/landing";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const radarSize = compact ? 120 : 144;
  const haloSize = compact ? 136 : 176;
  const pingSize = compact ? 108 : 128;
  const logoSize = compact ? 72 : 96;
  const logoImageSize = compact ? 50 : 64;
  const center = radarSize / 2;
  const ringRadius = center - 6;

  const rotation = useSharedValue(0);
  const pingScale = useSharedValue(1);
  const pingOpacity = useSharedValue(0.7);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 7000, easing: Easing.linear }),
      -1,
      false,
    );
    pingScale.value = withRepeat(
      withTiming(1.18, { duration: 4000, easing: Easing.out(Easing.quad) }),
      -1,
      true,
    );
    pingOpacity.value = withRepeat(withTiming(0, { duration: 4000 }), -1, true);
  }, [rotation, pingScale, pingOpacity]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pingScale.value }],
    opacity: pingOpacity.value,
  }));

  return (
    <View
      className={`relative w-full items-center justify-center ${compact ? "pb-1 pt-2" : "pb-3 pt-5"}`}>
      <View
        className={`relative items-center justify-center ${compact ? "my-1" : "my-2"}`}
        style={{ width: haloSize, height: haloSize }}>
        <View
          className="absolute rounded-full"
          style={{
            width: haloSize,
            height: haloSize,
            backgroundColor: isDark ? RADAR_COLORS.darkHalo : RADAR_COLORS.lightHalo,
            opacity: isDark ? 0.15 : 0.25,
            shadowColor: isDark ? RADAR_COLORS.darkHalo : RADAR_COLORS.lightHalo,
            shadowOpacity: isDark ? 0.15 : 0.25,
            shadowRadius: 36,
          }}
        />

        <Animated.View
          style={[
            {
              position: "absolute",
              width: radarSize,
              height: radarSize,
              alignItems: "center",
              justifyContent: "center",
            },
            spinStyle,
          ]}>
          <Svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`}>
            <Defs>
              <LinearGradient id="goldRadarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={RADAR_COLORS.goldStart} stopOpacity="1" />
                <Stop offset="50%" stopColor={RADAR_COLORS.goldMiddle} stopOpacity="0.95" />
                <Stop offset="100%" stopColor={RADAR_COLORS.goldEnd} stopOpacity="0.1" />
              </LinearGradient>
            </Defs>
            <Circle
              cx={center}
              cy={center}
              r={ringRadius}
              fill="none"
              stroke={isDark ? RADAR_COLORS.darkRing : RADAR_COLORS.lightRing}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              strokeOpacity={isDark ? 1 : 0.3}
            />
            <Circle
              cx={center}
              cy={center}
              r={ringRadius}
              fill="none"
              stroke="url(#goldRadarGlow)"
              strokeWidth={3}
              strokeDasharray={compact ? "75 267" : "90 320"}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              width: pingSize,
              height: pingSize,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: isDark ? "rgba(222,194,164,0.4)" : "rgba(203,160,82,0.4)",
            },
            pingStyle,
          ]}
        />

        <View
          className="relative z-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#dfbc75]/40 bg-surface-container-lowest/95 dark:border-[#dec2a4]/30 dark:bg-[#1C1B1F]/95"
          style={{ width: logoSize, height: logoSize }}>
          <Image
            source={LOGO_URI}
            contentFit="contain"
            style={{ width: logoImageSize, height: logoImageSize }}
            accessibilityLabel="RepRise Athletic Sprinter Logo"
          />
        </View>
      </View>

      <View className={compact ? "mt-1.5 items-center" : "mt-3 items-center"}>
        <Text
          className={`font-body-bold leading-none tracking-tight text-on-surface dark:text-white ${compact ? "text-[26px]" : "text-[30px]"}`}>
          RepRise
        </Text>
      </View>
    </View>
  );
}
