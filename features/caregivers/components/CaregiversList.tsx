import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "react-native-paper";

import { UserAvatar } from "@/components/image/UserAvatar";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { darkBlueColor, grayColor, whiteColor } from "@/constants/theme";
import { CaregiversFilter } from "@/features/caregivers/components/caregivers-filter/CaregiversFilter";
import { useLocation } from "@/hooks/use-location";
import {
  TCaregiver,
  TCaregiversFilter,
  TCaregiversResponse,
} from "@/types/caregivers";
import { centToMajorUnit, formatCurrency, majorToCentUnit } from "@/utils";

export interface CaregiversListProps {
  filterPetName?: string;
  disabledFields?: (keyof TCaregiversFilter)[];
  defaultFilter?: TCaregiversFilter;
  selectedIds?: TCaregiver["usersId"][];
  onClick?: (_userId: TCaregiver["usersId"]) => void;
  onSelect?: (_userId: TCaregiver["usersId"]) => void;
}

export const CaregiversList = ({
  filterPetName,
  disabledFields,
  defaultFilter,
  onClick,
  onSelect,
  selectedIds,
}: CaregiversListProps) => {
  const theme = useTheme();
  const { lat, lng } = useLocation();

  const [filter, setFilter] = useState<TCaregiversFilter>(defaultFilter ?? {});

  return (
    <View style={{ flex: 1 }}>
      <CaregiversFilter
        petName={filterPetName}
        disabledFields={disabledFields}
        filter={defaultFilter ?? {}}
        onChange={setFilter}
      />
      <InfiniteFlatList<TCaregiversResponse[number]>
        url="/v2/caregivers"
        perPage={10}
        numColumns={2}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        queryParams={{
          lng,
          lat,
          ...filter,
          price: filter.price && majorToCentUnit(filter.price),
        }}
        renderItem={({ item, index }) => {
          const firstService = filter.serviceTypeIds
            ? item.services.find((service) =>
                filter.serviceTypeIds?.includes(service.id)
              )
            : item.services?.[0];

          return (
            <TouchableOpacity
              onPress={() => onClick?.(item.usersId)}
              key={index}
              style={styles.card}
            >
              {onSelect && (
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelect?.(item.usersId);
                  }}
                >
                  <View style={styles.toggleButtonBackground}>
                    <FontAwesome
                      name="check-circle"
                      size={24}
                      color={
                        selectedIds?.includes(item.usersId)
                          ? theme.colors.primary
                          : grayColor
                      }
                    />
                  </View>
                </TouchableOpacity>
              )}
              <UserAvatar src={item.profileImage} style={styles.avatar} />
              <View>
                <View style={styles.infoRow}>
                  <ThemedText
                    style={styles.nameText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.firstName} {item.usersId}
                  </ThemedText>
                  {item.averageStarRatings ? (
                    <View style={styles.ratingContainer}>
                      {Array.from({ length: item.averageStarRatings }).map(
                        (_, i) => (
                          <AntDesign
                            key={i}
                            name="star"
                            size={11}
                            color={whiteColor}
                          />
                        )
                      )}
                    </View>
                  ) : (
                    <ThemedText style={styles.noReviewText}>
                      No review
                    </ThemedText>
                  )}
                </View>
                <View style={styles.infoRow}>
                  <ThemedText
                    style={styles.serviceLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {firstService?.label}
                  </ThemedText>
                  <ThemedText
                    style={styles.priceText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatCurrency(
                      centToMajorUnit(firstService?.serviceRate ?? 0)
                    )}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    gap: 16,
    paddingBottom: 100,
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    minWidth: "48%",
    maxWidth: "48%",
    height: 160,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: darkBlueColor,
    position: "relative",
  },
  avatar: {
    borderRadius: 8,
    width: "100%",
    height: 100,
    borderWidth: 0,
  },
  infoRow: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    color: whiteColor,
    fontWeight: "bold",
    width: 80,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  noReviewText: {
    color: whiteColor,
    fontWeight: "light",
    fontSize: 8,
  },
  serviceLabelText: {
    color: whiteColor,
    width: 80,
    fontSize: 11,
  },
  priceText: {
    color: whiteColor,
    fontSize: 11,
  },
  toggleButton: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
    elevation: 5,
  },
  toggleButtonBackground: {
    backgroundColor: whiteColor,
    borderRadius: 16,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
