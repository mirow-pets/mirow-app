import React, { useState } from "react";
import { StyleSheet, Switch, SwitchChangeEvent, View } from "react-native";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/themed-text";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useAuth } from "@/hooks/use-auth";
import OtpProvider from "@/hooks/use-otp";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Patch } from "@/services/http-service";
import { alert, onError } from "@/utils";

export default function AutoPayoutScreen() {
  const primaryColor = useThemeColor({}, "primary");
  const queryClient = useQueryClient();
  const { currUser } = useAuth();
  const { profile } = useCaregiverProfile();
  const [value, setValue] = useState(profile.users?.isAutoPayout);

  const { mutate } = useMutation({
    mutationFn: (isEnabled: boolean) =>
      Patch(`/care-givers/auto-debit/${isEnabled}`),
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
        <ThemedText type="defaultSemiBold">Auto payout setting</ThemedText>
        <ThemedText>
          When auto payout is enabled, your available earnings will be
          automatically transferred to your bank account every Monday at 12:01
          AM, if your available balance is at least $10.
        </ThemedText>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText>Auto payout</ThemedText>
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
