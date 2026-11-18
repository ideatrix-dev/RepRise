import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { useAuthStore } from "@/store/auth";

export function EmptyHome({ title }: { title: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <View
      className="flex-1 items-center justify-center gap-4 bg-surface px-margin dark:bg-[#121316]"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Text className="text-center font-body-bold text-headline-md text-on-surface dark:text-white">
        {title}
      </Text>
      <Text className="text-center font-body text-body-md text-on-surface-variant dark:text-[#A1A1AA]">
        Home screen placeholder
      </Text>
      <Button
        variant="ghost"
        onPress={() => {
          signOut();
          router.replace("/auth/sign-in");
        }}
        className="h-11 rounded-full bg-surface-container px-5 dark:bg-[#222126]"
      >
        <Text className="font-body-semibold text-label-md text-secondary dark:text-secondary-fixed">
          Sign out
        </Text>
      </Button>
    </View>
  );
}
