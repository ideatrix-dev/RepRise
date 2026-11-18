import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/auth";
import Mail from "lucide-react-native/icons/mail";
import { View } from "react-native";

export function ForgotPasswordModal() {
  const forgotOpen = useAuthStore((state) => state.forgotOpen);
  const forgotEmail = useAuthStore((state) => state.forgotEmail);
  const forgotErrors = useAuthStore((state) => state.forgotErrors);
  const forgotSubmitting = useAuthStore((state) => state.forgotSubmitting);
  const closeForgotModal = useAuthStore((state) => state.closeForgotModal);
  const setForgotEmail = useAuthStore((state) => state.setForgotEmail);
  const submitForgotPassword = useAuthStore((state) => state.submitForgotPassword);

  return (
    <Dialog
      open={forgotOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeForgotModal();
        }
      }}>
      <DialogContent className="border-outline-variant/30 bg-surface-container-lowest dark:border-white/10 dark:bg-[#1C1B1F]">
        <DialogHeader>
          <DialogTitle className="font-body-bold text-title-md text-on-surface dark:text-white">
            Reset your password
          </DialogTitle>
          <DialogDescription className="font-body text-body-sm text-on-surface-variant dark:text-[#A1A1AA]">
            Enter the email tied to your account. If it is registered, we will send a reset link
            there.
          </DialogDescription>
        </DialogHeader>

        <View className="gap-1.5">
          <Label className="font-body-semibold text-label-md text-on-surface dark:text-[#E5E7EB]">
            Email address
          </Label>
          <View className="relative justify-center">
            <Input
              value={forgotEmail}
              onChangeText={setForgotEmail}
              placeholder="lifter@reprise.fit"
              placeholderTextColor="#7f756e"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={submitForgotPassword}
              className="h-12 rounded-xl border-outline-variant/30 bg-surface-container-low pl-11 pr-4 text-body-md dark:border-white/10 dark:bg-[#222126]"
            />
            <View pointerEvents="none" className="absolute left-3.5">
              <Icon as={Mail} size={18} className="text-outline dark:text-[#71717A]" />
            </View>
          </View>
          {forgotErrors.email ? (
            <Text className="text-[12px] text-destructive">{forgotErrors.email}</Text>
          ) : null}
        </View>

        <View className="flex-row justify-end gap-2">
          <Button variant="ghost" onPress={closeForgotModal} disabled={forgotSubmitting}>
            <Text className="font-body-semibold text-label-sm text-on-surface-variant dark:text-[#D4D4D8]">
              Cancel
            </Text>
          </Button>
          <Button onPress={submitForgotPassword} disabled={forgotSubmitting}>
            <Text className="font-body-bold text-label-sm text-surface dark:text-on-surface">
              {forgotSubmitting ? "Sending..." : "Send reset link"}
            </Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
