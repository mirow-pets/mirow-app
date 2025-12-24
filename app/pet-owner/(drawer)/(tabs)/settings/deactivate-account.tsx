import React from "react";
import { StyleSheet, View } from "react-native";

import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useAuth } from "@/hooks/use-auth";
import OtpProvider from "@/hooks/use-otp";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Patch } from "@/services/http-service";
import { confirm, onError } from "@/utils";

export default function DeactivateAccountScreen() {
  const primaryColor = useThemeColor({}, "primary");
  const { logout } = useAuth();
  const { profile } = usePetOwnerProfile();

  const { mutate } = useMutation({
    mutationFn: () => Patch(`/v2/auth/deactivate-account`),
    onError,
    onSuccess: async (res) => {
      logout();

      Toast.show({
        type: "success",
        text1: res.message,
      });
    },
  });

  const handleDeactivateAccount = async () => {
    confirm({
      title: "Deactivate account?",
      description: `If you don't login within the next 30 days, your account and all associated data will be permanently deleted.`,
      onConfirm: mutate,
    });
  };

  return (
    <OtpProvider>
      <View style={[styles.container, { backgroundColor: primaryColor }]}>
        <UserAvatar src={profile?.profileImage} size={72} />
        <ThemedText type="defaultSemiBold">
          {profile?.firstName} {profile?.lastName}
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          Are you sure to deactivate account?
        </ThemedText>
        <ThemedText style={{ textAlign: "center" }}>
          If you login within next 30 days, your account will remain active. If
          you do not log in, you will lose all your data by deleting your
          account.
        </ThemedText>
        <Button
          title="Deactivate account"
          onPress={handleDeactivateAccount}
          variant="contained"
          color="secondary"
        />
      </View>
    </OtpProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
    alignItems: "center",
  },
});
