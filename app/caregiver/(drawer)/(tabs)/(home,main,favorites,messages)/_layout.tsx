import { Stack } from "expo-router";

import { TabsHeader } from "@/components/layout/TabsHeader";
import { DefaultHeader } from "@/utils";

const mainScreenOptions = { header: TabsHeader };
const notificationsScreenOptions = {
  header: DefaultHeader,
  title: "Notifications",
};

export default function MainLayout() {
  return (
    <Stack screenOptions={mainScreenOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen name="messages" options={{ headerShown: false }} />
      <Stack.Screen name="favorites" options={{ headerShown: false }} />
      <Stack.Screen name="bookings" options={{ headerShown: false }} />
      <Stack.Screen name="open-shifts" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={notificationsScreenOptions} />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="my-earnings"
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
