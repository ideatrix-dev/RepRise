import { AuthToast } from "@/components/auth/AuthToast";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { SocialButton } from "@/components/auth/SocialButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { AUTH_LOGO_MARK } from "@/constants/auth";
import { ROLE_HOME } from "@/constants/roles";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Eye from "lucide-react-native/icons/eye";
import EyeOff from "lucide-react-native/icons/eye-off";
import LoaderCircle from "lucide-react-native/icons/loader-circle";
import Lock from "lucide-react-native/icons/lock";
import Mail from "lucide-react-native/icons/mail";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const compact = height < 800;
  const veryCompact = height < 680;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const identity = useAuthStore((state) => state.identity);
  const password = useAuthStore((state) => state.password);
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const showPassword = useAuthStore((state) => state.showPassword);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const errors = useAuthStore((state) => state.errors);
  const setIdentity = useAuthStore((state) => state.setIdentity);
  const setPassword = useAuthStore((state) => state.setPassword);
  const toggleRememberMe = useAuthStore((state) => state.toggleRememberMe);
  const toggleShowPassword = useAuthStore((state) => state.toggleShowPassword);
  const submitSignIn = useAuthStore((state) => state.submitSignIn);
  const handleOAuth = useAuthStore((state) => state.handleOAuth);
  const openForgotModal = useAuthStore((state) => state.openForgotModal);
  const router = useRouter();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const role = await submitSignIn();
    if (role) {
      router.replace(ROLE_HOME[role]);
    }
  };

  return (
    <View className="flex-1 bg-surface dark:bg-[#121316]">
      <ForgotPasswordModal />

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View
          className="flex-1 px-margin"
          style={{
            paddingTop: insets.top + (veryCompact ? 6 : compact ? 8 : 10),
            paddingBottom: insets.bottom + (veryCompact ? 4 : compact ? 6 : 10),
          }}
        >
          {/* flex-1 + justify-center keeps content balanced on tall screens.
              Swap to justify-between to pin the social buttons to the bottom. */}
          <View
            className={`w-full flex-1 justify-center ${
              veryCompact ? "gap-1" : "gap-1.5"
            }`}
          >
            {/* Logo + badge */}
            <View
              className={`items-center justify-center ${
                veryCompact ? "mt-1" : compact ? "mt-1.5" : "mt-2"
              }`}
            >
              <Image
                source={AUTH_LOGO_MARK}
                contentFit="contain"
                style={{
                  width: veryCompact ? 96 : compact ? 128 : 160,
                  height: veryCompact ? 96 : compact ? 128 : 160,
                }}
                accessibilityLabel="RepRise Athletic Emblem"
              />
              <View
                className={`flex-row items-center gap-1 rounded-full border border-transparent bg-secondary-container dark:border-[#766147]/40 dark:bg-[#2C241E] ${
                  veryCompact ? "-mt-1 px-2 py-0.5" : "-mt-2 px-3 py-1"
                }`}
              >
                <Text
                  className={`font-body-semibold tracking-wide text-on-secondary-container dark:text-[#E2C799] ${
                    veryCompact ? "text-[10px]" : "text-label-sm"
                  }`}
                >
                  Train • Track • Rise
                </Text>
              </View>
            </View>

            {/* Heading block: centered, spacing grows with screen height */}
            <View
              className={`items-center ${compact ? "gap-0.5" : "gap-1.5"} ${
                veryCompact ? "mt-2" : compact ? "mt-3" : "mt-4"
              }`}
            >
              <Text
                className={`text-center font-body-bold tracking-tight text-on-surface dark:text-white ${
                  veryCompact
                    ? "text-headline-sm"
                    : compact
                      ? "text-headline-md"
                      : "text-headline-lg-mobile"
                }`}
              >
                Welcome Back
              </Text>
              <Text
                className={`max-w-xs text-center font-body text-on-surface-variant dark:text-[#A1A1AA] ${
                  compact ? "text-body-sm" : "text-body-md"
                }`}
              >
                Your workouts, personal records, and progress are waiting. Get
                back to training and keep pushing your limits.
              </Text>
            </View>

            {/* Form */}
            <View
              className={
                veryCompact ? "gap-1" : compact ? "gap-1.5" : "gap-3.5"
              }
            >
              <View className={compact ? "gap-1" : "gap-1.5"}>
                <Label className="font-body-semibold text-label-md text-on-surface dark:text-[#E5E7EB]">
                  Email or Username
                </Label>
                <View className="relative justify-center">
                  <Input
                    value={identity}
                    onChangeText={setIdentity}
                    placeholder="Username"
                    placeholderTextColor={isDark ? "#71717A" : "#7f756e"}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="username"
                    returnKeyType="next"
                    className={`rounded-xl border-outline-variant/30 bg-surface-container-low text-on-surface dark:border-white/10 dark:bg-[#1C1B1F] ${
                      veryCompact
                        ? "h-[42px] pl-10 pr-10 text-body-sm"
                        : compact
                          ? "h-[46px] pl-10 pr-11 text-body-sm"
                          : "h-[52px] pl-11 pr-12 text-body-md"
                    }`}
                  />
                  <View pointerEvents="none" className="absolute left-3">
                    <Icon
                      as={Mail}
                      size={compact ? 18 : 20}
                      className="text-outline dark:text-[#71717A]"
                    />
                  </View>
                </View>
                {errors.identity ? (
                  <Text className="text-[12px] text-destructive">
                    {errors.identity}
                  </Text>
                ) : null}
              </View>

              <View className={compact ? "gap-1" : "gap-1.5"}>
                <Label className="font-body-semibold text-label-md text-on-surface dark:text-[#E5E7EB]">
                  Password
                </Label>
                <View className="relative justify-center">
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor={isDark ? "#71717A" : "#7f756e"}
                    secureTextEntry={!showPassword}
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    className={`rounded-xl border-outline-variant/30 bg-surface-container-low text-on-surface dark:border-white/10 dark:bg-[#1C1B1F] ${
                      veryCompact
                        ? "h-[42px] pl-10 pr-10 text-body-sm"
                        : compact
                          ? "h-[46px] pl-10 pr-11 text-body-sm"
                          : "h-[52px] pl-11 pr-12 text-body-md"
                    }`}
                  />
                  <View pointerEvents="none" className="absolute left-3">
                    <Icon
                      as={Lock}
                      size={compact ? 18 : 20}
                      className="text-outline dark:text-[#71717A]"
                    />
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                    hitSlop={8}
                    onPress={toggleShowPassword}
                    className="absolute right-1.5 h-8 w-8 items-center justify-center rounded-lg"
                  >
                    <Icon
                      as={showPassword ? EyeOff : Eye}
                      size={compact ? 18 : 20}
                      className="text-outline dark:text-[#71717A]"
                    />
                  </Pressable>
                </View>
                {errors.password ? (
                  <Text className="text-[12px] text-destructive">
                    {errors.password}
                  </Text>
                ) : null}
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={toggleRememberMe}
                    className="h-5 w-5 rounded-md border-outline-variant/40 dark:border-white/10"
                  />
                  <Label
                    onPress={toggleRememberMe}
                    className="font-body text-body-sm text-on-surface-variant dark:text-[#A1A1AA]"
                  >
                    Remember this device
                  </Label>
                </View>

                <Button
                  variant="ghost"
                  onPress={openForgotModal}
                  className="h-auto rounded-full bg-surface-container px-2.5 py-0.5 dark:bg-[#222126]"
                >
                  <Text className="font-body-semibold text-label-sm text-secondary dark:text-secondary-fixed">
                    Forgot password?
                  </Text>
                </Button>
              </View>

              <Button
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`w-full rounded-full bg-on-surface px-6 dark:bg-surface-container-lowest ${
                  veryCompact
                    ? "mt-2 h-11"
                    : compact
                      ? "mt-3 h-12"
                      : "mt-4 h-14"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Icon
                      as={LoaderCircle}
                      size={20}
                      className="animate-spin text-secondary-fixed dark:text-secondary"
                    />
                    <Text className="font-body-bold text-label-lg text-surface dark:text-on-surface">
                      Authenticating...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="font-body-bold text-label-lg text-surface dark:text-on-surface">
                      Sign In
                    </Text>
                    <Icon
                      as={ArrowRight}
                      size={20}
                      className="text-secondary-fixed dark:text-secondary"
                    />
                  </>
                )}
              </Button>

              <View className="items-center">
                <Text
                  className={`text-center font-body text-on-surface-variant dark:text-[#A1A1AA] ${
                    compact ? "text-body-sm" : "text-body-md"
                  }`}
                >
                  Don&apos;t have an account?{" "}
                  <Text
                    onPress={() => router.navigate("/auth/sign-up")}
                    className="font-body-semibold text-label-lg text-secondary underline dark:text-secondary-fixed"
                  >
                    Sign Up
                  </Text>
                </Text>
              </View>
            </View>

            {/* "Or" divider: two lines with the label between them */}
            <View
              className={`flex-row items-center gap-3 ${
                veryCompact ? "my-0.5" : compact ? "my-1" : "my-1.5"
              }`}
            >
              <Separator className="flex-1 bg-surface-variant dark:bg-white/10" />
              <Text
                className={`font-body-semibold uppercase tracking-wider text-outline dark:text-[#71717A] ${
                  compact ? "text-[10px]" : "text-label-sm"
                }`}
              >
                Or
              </Text>
              <Separator className="flex-1 bg-surface-variant dark:bg-white/10" />
            </View>

            {/* Social sign-in */}
            <View
              className={veryCompact ? "gap-1.5" : compact ? "gap-2" : "gap-3"}
            >
              <SocialButton
                provider="Apple"
                onPress={() => handleOAuth("Apple")}
              />
              <SocialButton
                provider="Google"
                onPress={() => handleOAuth("Google")}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <AuthToast />
    </View>
  );
}
