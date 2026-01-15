import { StyleSheet, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import { UserAvatar } from "@/components/image/UserAvatar";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { secondaryColor, whiteColor } from "@/constants/theme";
import { TCaregiver, TUser } from "@/types";

export default function CaregiversScreen() {
  const handleViewCaregiver = (userId: TUser["id"]) => {
    router.push(`/pet-owner/caregivers/${userId}`);
  };

  return (
    <View style={styles.container}>
      <InfiniteFlatList<TCaregiver>
        url="/v2/users/caregivers"
        perPage={10}
        style={{ height: 400 }}
        contentContainerStyle={{ gap: 8, paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            style={styles.optionContainer}
            onPress={() => handleViewCaregiver(item.usersId)}
          >
            <UserAvatar src={item.users.profileImage} size={40} />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">
                {item.users.firstName} {item.users.lastName}
              </ThemedText>
              <ThemedText>
                Distance: {item?.distance?.text ?? `0 mi`}
              </ThemedText>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  optionContainer: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    backgroundColor: whiteColor,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionContainerActive: {
    borderColor: secondaryColor,
  },
});
