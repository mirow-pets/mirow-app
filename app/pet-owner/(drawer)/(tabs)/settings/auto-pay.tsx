import React, { useState } from "react";
import { StyleSheet, Switch, SwitchChangeEvent, View } from "react-native";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/themed-text";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useAuth } from "@/hooks/use-auth";
import OtpProvider from "@/hooks/use-otp";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Patch } from "@/services/http-service";
import { alert, onError } from "@/utils";

export default function AutoPayScreen() {
  const primaryColor = useThemeColor({}, "primary");
  const queryClient = useQueryClient();
  const { currUser } = useAuth();
  const { profile } = usePetOwnerProfile();
  const [value, setValue] = useState(profile?.isAutoPayout);

  const { mutate } = useMutation({
    mutationFn: (isEnabled: boolean) => Patch(`/users/auto-debit/${isEnabled}`),
    onError: (error) => {
      if (error.message.includes("method")) {
        alert({ title: "Add card", description: error.message });
      } else onError(error);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["pet-owner-profile", currUser?.sessionId],
      });
    },
  });

  const handleChange = async (e: SwitchChangeEvent) => {
    const value = e.nativeEvent.value;
    setValue(value);
    mutate(value);
  };

  return (
    <OtpProvider>
      <View style={[styles.container, { backgroundColor: primaryColor }]}>
        <ThemedText type="defaultSemiBold">
          If Auto payout is enabled
        </ThemedText>
        <ThemedText>
          The service fee will be Automatically Debited from your account upon
          the completion of each service
        </ThemedText>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText>Auto pay</ThemedText>
          <Switch value={value} onChange={handleChange} />
        </View>
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
  },
});
