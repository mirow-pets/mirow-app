import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Href, router } from "expo-router";

import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { grayColor, redColor, whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { TChatThread, UserRole } from "@/types";
import { formatDateToMDY } from "@/utils";

export const Messages = () => {
  const { userRole } = useAuth();

  return (
    <View style={styles.container}>
      <InfiniteFlatList<TChatThread>
        url="/v2/chat-threads"
        perPage={5}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
        style={{ height: 400 }}
        order="createdat DESC"
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            key={index}
            onPress={() => {
              router.push(
                `/${userRole as UserRole}/messages/${item.id}` as Href
              );
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              <ThemedText type="defaultSemiBold" style={{ flex: 1 }}>
                {item.name}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 11,
                }}
              >
                {formatDateToMDY(new Date()) === formatDateToMDY(item.createdAt)
                  ? "Today"
                  : formatDateToMDY(item.createdAt)}
              </ThemedText>
              {!!item.count && (
                <View
                  style={{
                    height: 16,
                    width: 16,
                    backgroundColor: redColor,
                    borderRadius: 8,

                    alignItems: "center",
                  }}
                >
                  <ThemedText style={{ fontSize: 11, color: whiteColor }}>
                    {item.count}
                  </ThemedText>
                </View>
              )}
            </View>
            {/* <ThemedText numberOfLines={2} ellipsizeMode="tail">
              {item.description}
            </ThemedText> */}
            <ThemedText style={{ color: grayColor }}>
              {item.chat
                ? item.chat.image
                  ? "Sent Image"
                  : item.chat.message
                : "No message"}
            </ThemedText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
    backgroundColor: whiteColor,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  item: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#ffffff10",
  },
});
