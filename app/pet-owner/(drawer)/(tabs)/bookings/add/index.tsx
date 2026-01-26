import { StyleSheet, View } from "react-native";

import { whiteColor } from "@/constants/theme";
import { AddBookingForm } from "@/features/bookings/components/AddBookingForm";

export default function AddBookingScreen() {
  return (
    <View style={styles.container}>
      <AddBookingForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },
});
