import { ScrollView } from "react-native-gesture-handler";

import { AddBookingForm } from "@/features/bookings/components/AddBookingForm";

export default function AddBookingScreen() {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <AddBookingForm />
    </ScrollView>
  );
}
