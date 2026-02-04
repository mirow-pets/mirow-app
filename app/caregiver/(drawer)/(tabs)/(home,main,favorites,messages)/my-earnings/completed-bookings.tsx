import { StyleSheet, View } from "react-native";

import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { TBooking } from "@/types";
import { centToMajorUnit, formatCurrency, formatDateToMDY } from "@/utils";

export default function CompletedBookingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <ThemedText style={styles.headerText}>Date</ThemedText>
        <ThemedText style={styles.headerText}>Service</ThemedText>
        <ThemedText style={styles.headerText}>Pet</ThemedText>
        <ThemedText style={styles.headerText}>Tip</ThemedText>
        <ThemedText style={styles.headerText}>Amount</ThemedText>
      </View>
      <InfiniteFlatList<TBooking>
        url="/care-givers/bookings"
        perPage={5}
        order="createdat DESC"
        queryParams={{ statuses: "completed" }}
        renderItem={({ item, index }) => {
          const backgroundColor = index % 2 === 0 ? "#ebf1ff" : "#fafafa";

          const pet = item.pets?.[0];

          return (
            <View key={index}>
              <View style={{ ...styles.row, backgroundColor }}>
                <ThemedText style={styles.rowText}>
                  {formatDateToMDY(item?.startDate)}
                </ThemedText>
                <ThemedText style={styles.rowText}>
                  {item?.serviceTypes?.display === "Transportation"
                    ? "Transport"
                    : item?.serviceTypes?.display}
                </ThemedText>
                <ThemedText style={styles.rowText} numberOfLines={1}>
                  {pet?.name}
                </ThemedText>
                <ThemedText style={styles.rowText}>
                  {formatCurrency(centToMajorUnit(item?.tips))}
                </ThemedText>
                <ThemedText style={styles.rowText}>
                  {formatCurrency(centToMajorUnit(item?.amount))}
                </ThemedText>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingBottom: 100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#d4f1e3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 13,
    color: "#545454",
    flex: 1,
    textAlign: "center",
  },
  rowText: {
    fontSize: 11,
    flex: 1,
    textAlign: "center",
    color: "#020202",
  },
});
