import { Stack } from "expo-router";

import { TabsHeader } from "@/components/layout/TabsHeader";
import { DefaultHeader } from "@/utils";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ header: () => <TabsHeader /> }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="messages" options={{ headerShown: false }} />
      <Stack.Screen name="favorites" options={{ headerShown: false }} />
      <Stack.Screen name="pets" options={{ headerShown: false }} />
      <Stack.Screen name="bookings" options={{ headerShown: false }} />
      <Stack.Screen name="caregivers" options={{ headerShown: false }} />
      <Stack.Screen
        name="notifications"
        options={{
          header: DefaultHeader,
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
