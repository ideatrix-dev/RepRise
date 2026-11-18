import { AuthToast } from "@/components/auth/AuthToast";
import { SocialButton } from "@/components/auth/SocialButton";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { ROLE_HOME } from "@/constants/roles";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Check from "lucide-react-native/icons/check";
import Circle from "lucide-react-native/icons/circle";
import Dumbbell from "lucide-react-native/icons/dumbbell";
import Eye from "lucide-react-native/icons/eye";
import EyeOff from "lucide-react-native/icons/eye-off";
import LoaderCircle from "lucide-react-native/icons/loader-circle";
import Lock from "lucide-react-native/icons/lock";
import Mail from "lucide-react-native/icons/mail";
import UserRound from "lucide-react-native/icons/user-round";
import UsersRound from "lucide-react-native/icons/users-round";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const compact = height < 800;
  const veryCompact = height < 680;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const signUpRole = useAuthStore((state) => state.signUpRole);
  const signUpFullName = useAuthStore((state) => state.signUpFullName);
  const signUpEmail = useAuthStore((state) => state.signUpEmail);
  const signUpPassword = useAuthStore((state) => state.signUpPassword);
  const showSignUpPassword = useAuthStore((state) => state.showSignUpPassword);
  const signUpSubmitting = useAuthStore((state) => state.signUpSubmitting);
  const signUpErrors = useAuthStore((state) => state.signUpErrors);
  const setSignUpRole = useAuthStore((state) => state.setSignUpRole);
  const setSignUpFullName = useAuthStore((state) => state.setSignUpFullName);
  const setSignUpEmail = useAuthStore((state) => state.setSignUpEmail);
  const setSignUpPassword = useAuthStore((state) => state.setSignUpPassword);
  const toggleShowSignUpPassword = useAuthStore(
    (state) => state.toggleShowSignUpPassword,
  );
  const submitSignUp = useAuthStore((state) => state.submitSignUp);
  const handleOAuth = useAuthStore((state) => state.handleOAuth);
  const showToast = useAuthStore((state) => state.showToast);

  const hasLength = signUpPassword.length >= 8;
  const hasNumber = /[0-9]/.test(signUpPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(signUpPassword);
  const strengthScore = [hasLength, hasNumber, hasSymbol].filter(
    Boolean,
  ).length;
  const strengthLabel = !signUpPassword
    ? "Empty"
    : strengthScore === 1
      ? "Weak"
      : strengthScore === 2
        ? "Medium"
        : "Strong";
  const activeSegmentClass =
    strengthScore === 1
      ? "bg-destructive"
      : strengthScore === 2
        ? "bg-gold-500 dark:bg-gold-400"
        : "bg-secondary dark:bg-secondary-fixed";
  const strengthLabelClass =
    strengthScore === 1
      ? "text-destructive"
      : strengthScore === 2
        ? "text-gold-600 dark:text-gold-400"
        : strengthScore === 3
          ? "text-secondary dark:text-secondary-fixed"
          : "text-outline dark:text-[#71717A]";

  const roleOptions = [
    {
      id: "athlete" as const,
      title: "Athlete",
      description: "Track workouts, lifts, and personal records.",
      IconComponent: Dumbbell,
    },
    {
      id: "coach" as const,
      title: "Coach",
      description: "Manage athletes and build training programs.",
      IconComponent: UsersRound,
    },
  ];

  const strengthHints = [
    { label: "8+ chars", valid: hasLength },
    { label: "1 number", valid: hasNumber },
    { label: "1 symbol", valid: hasSymbol },
  ];

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const role = await submitSignUp();
    if (role) {
      router.replace(ROLE_HOME[role]);
    }
  };

  // Same input sizing and colors as the sign-in screen
  const inputBase =
    "rounded-xl border-outline-variant/30 bg-surface-container-low text-on-surface dark:border-white/10 dark:bg-[#1C1B1F]";
  const inputSize = veryCompact
    ? "h-[42px] text-body-sm"
    : compact
      ? "h-[46px] text-body-sm"
      : "h-[52px] text-body-md";
  const inputPadLeft = veryCompact ? "pl-10" : compact ? "pl-10" : "pl-11";
  const inputPadRight = veryCompact ? "pr-10" : compact ? "pr-11" : "pr-12";
  const labelClass =
    "font-body-semibold text-label-md text-on-surface dark:text-[#E5E7EB]";
  const iconSize = compact ? 18 : 20;

  return (
    <View className="flex-1 bg-surface dark:bg-[#121316]">
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + (veryCompact ? 6 : compact ? 12 : 20),
            paddingBottom: insets.bottom + 24,
          }}
        >
          <View className={`w-full px-margin ${compact ? "gap-3" : "gap-4"}`}>
            {/* Heading: centered, same type styles as sign-in */}
            <View className={`items-center ${compact ? "gap-0.5" : "gap-1.5"}`}>
              <Text
                className={`text-center font-body-bold tracking-tight text-on-surface dark:text-white ${
                  veryCompact
                    ? "text-headline-sm"
                    : compact
                      ? "text-headline-md"
                      : "text-headline-lg-mobile"
                }`}
              >
                Create Account
              </Text>
              <Text
                className={`max-w-xs text-center font-body text-on-surface-variant dark:text-[#A1A1AA] ${
                  compact ? "text-body-sm" : "text-body-md"
                }`}
              >
                Start building strength, one rep at a time.
              </Text>
            </View>

            {/* Account type */}
            <View className={compact ? "gap-1" : "gap-1.5"}>
              <Label className={labelClass}>Account Type</Label>
              <View className="flex-row gap-3">
                {roleOptions.map((option) => {
                  const selected = signUpRole === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => setSignUpRole(option.id)}
                      className={`min-h-[104px] flex-1 rounded-xl border-2 p-3.5 ${
                        selected
                          ? "border-secondary bg-surface-container-lowest dark:border-secondary-fixed dark:bg-[#1C1B1F]"
                          : "border-transparent bg-surface-container-low opacity-75 dark:bg-[#222126]"
                      }`}
                    >
                      <View className="mb-2 w-full flex-row items-center justify-between">
                        <View
                          className={`h-8 w-8 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-secondary-container dark:bg-[#2C241E]"
                              : "bg-surface-container-high dark:bg-white/10"
                          }`}
                        >
                          <Icon
                            as={option.IconComponent}
                            size={19}
                            className={
                              selected
                                ? "text-on-secondary-container dark:text-[#E2C799]"
                                : "text-outline dark:text-[#71717A]"
                            }
                          />
                        </View>
                        {selected ? (
                          <Icon
                            as={Check}
                            size={20}
                            className="text-secondary dark:text-secondary-fixed"
                          />
                        ) : null}
                      </View>
                      <Text
                        className={`font-body-semibold text-label-lg ${
                          selected
                            ? "text-on-surface dark:text-white"
                            : "text-on-surface-variant dark:text-[#E5E7EB]"
                        }`}
                      >
                        {option.title}
                      </Text>
                      <Text className="mt-1 font-body text-label-sm leading-snug text-on-surface-variant dark:text-[#A1A1AA]">
                        {option.description}
                      </Text>
                      <View
                        className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full ${
                          selected
                            ? "bg-secondary dark:bg-secondary-fixed"
                            : "bg-transparent"
                        }`}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Form */}
            <View
              className={
                veryCompact ? "gap-1" : compact ? "gap-1.5" : "gap-3.5"
              }
            >
              <View className={compact ? "gap-1" : "gap-1.5"}>
                <Label className={labelClass}>Full Name</Label>
                <View className="relative justify-center">
                  <Input
                    value={signUpFullName}
                    onChangeText={setSignUpFullName}
                    placeholder="Alex Hunter"
                    placeholderTextColor={isDark ? "#71717A" : "#7f756e"}
                    autoCapitalize="words"
                    autoComplete="name"
                    returnKeyType="next"
                    className={`${inputBase} ${inputSize} ${inputPadLeft} ${inputPadRight}`}
                  />
                  <View pointerEvents="none" className="absolute left-3">
                    <Icon
                      as={UserRound}
                      size={iconSize}
                      className="text-outline dark:text-[#71717A]"
                    />
                  </View>
                </View>
                {signUpErrors.fullName ? (
                  <Text className="text-[12px] text-destructive">
                    {signUpErrors.fullName}
                  </Text>
                ) : null}
              </View>

              <View className={compact ? "gap-1" : "gap-1.5"}>
                <Label className={labelClass}>Email Address</Label>
                <View className="relative justify-center">
                  <Input
                    value={signUpEmail}
                    onChangeText={setSignUpEmail}
                    placeholder="alex@repriseathletics.com"
                    placeholderTextColor={isDark ? "#71717A" : "#7f756e"}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    autoComplete="email"
                    returnKeyType="next"
                    className={`${inputBase} ${inputSize} ${inputPadLeft} ${inputPadRight}`}
                  />
                  <View pointerEvents="none" className="absolute left-3">
                    <Icon
                      as={Mail}
                      size={iconSize}
                      className="text-outline dark:text-[#71717A]"
                    />
                  </View>
                </View>
                {signUpErrors.email ? (
                  <Text className="text-[12px] text-destructive">
                    {signUpErrors.email}
                  </Text>
                ) : null}
              </View>

              <View className={compact ? "gap-1" : "gap-1.5"}>
                <Label className={labelClass}>Password</Label>
                <View className="relative justify-center">
                  <Input
                    value={signUpPassword}
                    onChangeText={setSignUpPassword}
                    placeholder="Create strong passphrase"
                    placeholderTextColor={isDark ? "#71717A" : "#7f756e"}
                    secureTextEntry={!showSignUpPassword}
                    autoComplete="new-password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    className={`${inputBase} ${inputSize} ${inputPadLeft} ${inputPadRight}`}
                  />
                  <View pointerEvents="none" className="absolute left-3">
                    <Icon
                      as={Lock}
                      size={iconSize}
                      className="text-outline dark:text-[#71717A]"
                    />
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showSignUpPassword ? "Hide password" : "Show password"
                    }
                    hitSlop={8}
                    onPress={toggleShowSignUpPassword}
                    className="absolute right-1.5 h-8 w-8 items-center justify-center rounded-lg"
                  >
                    <Icon
                      as={showSignUpPassword ? EyeOff : Eye}
                      size={iconSize}
                      className="text-outline dark:text-[#71717A]"
                    />
                  </Pressable>
                </View>
                {signUpErrors.password ? (
                  <Text className="text-[12px] text-destructive">
                    {signUpErrors.password}
                  </Text>
                ) : null}

                <View className="mt-1 gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-body text-label-sm text-on-surface-variant dark:text-[#A1A1AA]">
                      Password strength
                    </Text>
                    <Text
                      className={`font-body-semibold text-label-sm ${strengthLabelClass}`}
                    >
                      {strengthLabel}
                    </Text>
                  </View>
                  <View className="h-1.5 w-full flex-row gap-1.5">
                    {[0, 1, 2].map((index) => (
                      <View
                        key={index}
                        className={`h-full flex-1 rounded-full ${
                          signUpPassword && strengthScore > index
                            ? activeSegmentClass
                            : "bg-surface-variant dark:bg-white/10"
                        }`}
                      />
                    ))}
                  </View>
                  <View className="flex-row items-center justify-between pt-0.5">
                    {strengthHints.map((hint) => (
                      <View
                        key={hint.label}
                        className="flex-row items-center gap-1"
                      >
                        <Icon
                          as={hint.valid ? Check : Circle}
                          size={13}
                          className={
                            hint.valid
                              ? "text-secondary dark:text-secondary-fixed"
                              : "text-on-surface-variant dark:text-[#71717A]"
                          }
                        />
                        <Text className="font-body text-label-sm text-on-surface-variant dark:text-[#A1A1AA]">
                          {hint.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <Button
                onPress={handleSubmit}
                disabled={signUpSubmitting}
                className={`w-full rounded-full bg-on-surface px-6 dark:bg-surface-container-lowest ${
                  veryCompact
                    ? "mt-2 h-11"
                    : compact
                      ? "mt-3 h-12"
                      : "mt-4 h-14"
                }`}
              >
                {signUpSubmitting ? (
                  <>
                    <Icon
                      as={LoaderCircle}
                      size={20}
                      className="animate-spin text-secondary-fixed dark:text-secondary"
                    />
                    <Text className="font-body-bold text-label-lg text-surface dark:text-on-surface">
                      Creating Account...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="font-body-bold text-label-lg text-surface dark:text-on-surface">
                      Create Account
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
                  Already have an account?{" "}
                  <Text
                    onPress={() => router.navigate("/auth/sign-in")}
                    className="font-body-semibold text-label-lg text-secondary underline dark:text-secondary-fixed"
                  >
                    Sign In
                  </Text>
                </Text>
              </View>
            </View>

            {/* "Or" divider */}
            <View className="flex-row items-center gap-3">
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

            <SocialButton
              provider="Google"
              label="Continue with Google"
              onPress={() => handleOAuth("Google")}
            />

            <View className="items-center px-2">
              <Text className="text-center font-body text-label-sm leading-relaxed text-outline dark:text-[#71717A]">
                By creating an account, you agree to our{" "}
                <Text
                  onPress={() =>
                    showToast("Terms of Service coming soon.", "info")
                  }
                  className="underline"
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  onPress={() =>
                    showToast("Privacy Policy coming soon.", "info")
                  }
                  className="underline"
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AuthToast />
    </View>
  );
}
