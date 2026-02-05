import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Href, router } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

import { Button } from "@/components/button/Button";
import { SearchInput } from "@/components/form/SearchInput";
import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import {
  grayColor,
  lightGrayColor,
  primaryColor,
  redColor,
  whiteColor,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { addQueryParams, Get } from "@/services/http-service";
import { TChatThread, UserRole } from "@/types";
import { onError } from "@/utils";

const EMPTY_ORANGE = "#FF6B35";

export const Messages = () => {
  const { userRole } = useAuth();
  const [search, setSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    TChatThread[]
  >({
    queryKey: ["/v2/chat-threads"],
    queryFn: ({ pageParam = 0 }) =>
      Get(
        addQueryParams("/v2/chat-threads", {
          filter: JSON.stringify({
            offset: pageParam?.toString(),
            limit: "5",
            order: "createdat DESC",
          }),
        })
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 5) return undefined;
      return allPages.length * 5;
    },
    meta: { onError },
  });

  const allItems = data?.pages.flat() ?? [];
  const items = search.trim()
    ? allItems.filter((t) =>
        (t.name ?? "").toLowerCase().includes(search.trim().toLowerCase())
      )
    : allItems;

  const handleScheduleNow = () => {
    if (userRole === UserRole.PetOwner) {
      router.push("/pet-owner" as Href);
    } else {
      router.push("/caregiver" as Href);
    }
  };

  const messagePreview = (item: TChatThread) => {
    if (!item.chat) return "No message";
    if (item.chat.image) return "Sent Image";
    return item.chat.message ?? "No message";
  };

  const otherUser = (item: TChatThread) => item.users?.[0];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (allItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={grayColor}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons
            name="search"
            size={20}
            color={grayColor}
            style={styles.searchIcon}
          />
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <MaterialCommunityIcons
              name="email-outline"
              size={80}
              color={primaryColor}
            />
            <View style={styles.emptyBadge}>
              <MaterialCommunityIcons
                name="close"
                size={14}
                color={EMPTY_ORANGE}
              />
            </View>
          </View>
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            Empty
          </ThemedText>
          <ThemedText style={styles.emptyDescription}>
            Messages from pet caretakers will appear here. Schedule your Pet
            caretaker!
          </ThemedText>
          {userRole === UserRole.PetOwner && (
            <Button onPress={handleScheduleNow}>
              <ThemedText>Schedule now</ThemedText>
            </Button>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <SearchInput value={search} onChange={setSearch} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
        ListEmptyComponent={
          items.length === 0 && allItems.length > 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyDescription}>
                No matches for your search.
              </ThemedText>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.push(
                `/${userRole as UserRole}/messages/${item.id}` as Href
              )
            }
            activeOpacity={0.7}
          >
            <UserAvatar src={otherUser(item)?.profileImage} size={48} />
            <View style={styles.itemContent}>
              <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {item.name ?? "Unknown"}
              </ThemedText>
              <ThemedText
                style={styles.messagePreview}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {messagePreview(item)}
              </ThemedText>
            </View>
            {!!item.count && (
              <View style={styles.unreadBadge}>
                <ThemedText style={styles.unreadCount}>{item.count}</ThemedText>
              </View>
            )}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    height: 44,
    backgroundColor: lightGrayColor,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingRight: 44,
    fontSize: 16,
    color: grayColor,
  },
  searchIcon: {
    position: "absolute",
    right: 14,
    top: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: whiteColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: lightGrayColor,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  messagePreview: {
    fontSize: 14,
    color: grayColor,
    marginTop: 2,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: redColor,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    color: whiteColor,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    position: "relative",
    marginBottom: 24,
  },
  emptyBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: whiteColor,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: EMPTY_ORANGE,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 15,
    color: grayColor,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
});
