import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/auth";
import Check from "lucide-react-native/icons/check";
import Info from "lucide-react-native/icons/info";
import ShieldCheck from "lucide-react-native/icons/shield-check";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

const TOAST_ICONS = {
  info: Info,
  success: Check,
  shield: ShieldCheck,
} as const;

export function AuthToast() {
  const toast = useAuthStore((state) => state.toast);

  if (!toast) {
    return null;
  }

  const ToastIcon = TOAST_ICONS[toast.icon];

  return (
    <Animated.View
      pointerEvents="none"
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      className="absolute bottom-6 left-6 right-6 z-50 flex-row items-center gap-2.5 rounded-full border border-transparent bg-inverse-surface px-4 py-3 shadow-xl dark:border-white/10 dark:bg-[#2C2B30]">
      <Icon as={ToastIcon} size={18} className="text-secondary-fixed dark:text-[#E2C799]" />
      <Text className="flex-1 font-body text-body-sm text-inverse-on-surface dark:text-white">
        {toast.message}
      </Text>
    </Animated.View>
  );
}
