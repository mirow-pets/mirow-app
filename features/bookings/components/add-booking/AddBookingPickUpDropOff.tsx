import { StyleSheet, View } from "react-native";

import { useFormContext } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";

import { LocationInput } from "@/components/form/LocationInput";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { PickupDropOffMapView } from "@/components/map/PickupDropOffMapView";
import { TAddBooking } from "@/features/bookings/validations";
import { useAddBooking } from "@/hooks/use-add-booking-form";

export interface AddBookingPickUpDropOffProps {
  progress: number;
}

export const AddBookingPickUpDropOff = ({
  progress,
}: AddBookingPickUpDropOffProps) => {
  const { prev, handleIsOpenShiftNext } = useAddBooking();
  const form = useFormContext<TAddBooking>();
  const pickup = form.watch("pickup");
  const dropOff = form.watch("dropOff");

  return (
    <FormStepsLayout
      {...{
        onNext: handleIsOpenShiftNext(["pickup", "dropOff"]),
        onPrev: prev,
        progress,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapSection}>
          <PickupDropOffMapView pickup={pickup} dropOff={dropOff} />
        </View>
        <View style={styles.inputsSection}>
          <LocationInput name="pickup" label="Pick up location" />
          <LocationInput name="dropOff" label="Drop off location" />
        </View>
      </ScrollView>
    </FormStepsLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  mapSection: {
    marginBottom: 20,
  },
  inputsSection: {
    gap: 16,
  },
});
