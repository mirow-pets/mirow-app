import React, { useState } from "react";
import { StyleSheet, SwitchChangeEvent, View } from "react-native";

import { Switch } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { useNotification } from "@/hooks/use-notifications";
import OtpProvider from "@/hooks/use-otp";
import { TNotificationPreference } from "@/types/notifications";
import { TAuthUser } from "@/types/users";

const Preference = ({
  user,
  preference,
}: {
  user: TAuthUser;
  preference: TNotificationPreference;
}) => {
  const { enableNotification } = useNotification();

  const [value, setValue] = useState(
    !!user?.notificationPreferences?.find(
      (p) => p.notificationPreferencesId === preference.id,
    )?.isEnable,
  );

  const handleChange = async (e: SwitchChangeEvent) => {
    const value = e.nativeEvent.value;
    setValue(value);
    await enableNotification({
      notificationPreferenceId: preference.id,
      isEnable: value,
    });
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <ThemedText>{preference.display}</ThemedText>
      <Switch value={value} onChange={handleChange} />
    </View>
  );
};

export interface NotificationPreferencesFormProps {
  user: TAuthUser;
}

export default function NotificationPreferencesForm({
  user,
}: NotificationPreferencesFormProps) {
  const { notificationPreferences } = useNotification();

  return (
    <OtpProvider>
      <View style={styles.container}>
        <ThemedText>
          Receive the latest news and updates, including new features,
          promotions and more.
        </ThemedText>
        {notificationPreferences.map((preference, i) => (
          <Preference user={user} preference={preference} key={i} />
        ))}
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
