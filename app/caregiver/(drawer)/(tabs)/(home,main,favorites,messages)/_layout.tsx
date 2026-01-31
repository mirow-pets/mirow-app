import { Stack } from "expo-router";

import { TabsHeader } from "@/components/layout/TabsHeader";
import { DefaultHeader } from "@/utils";
import "react-native-reanimated";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function MainLayout() {
  return (
    <Stack screenOptions={{ header: () => <TabsHeader /> }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="messages" options={{ headerShown: false }} />
      <Stack.Screen name="bookings" options={{ headerShown: false }} />
      <Stack.Screen name="favorites" options={{ headerShown: false }} />
      <Stack.Screen name="open-shifts" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
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
