import { StyleSheet, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { SERVICE_TYPE } from "@/constants/common";
import { whiteColor } from "@/constants/theme";
import { AddTrainingBookingForm } from "@/features/bookings/components/AddTrainingBookingForm";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import AddBookingProvider from "@/hooks/use-add-booking-form";

const mapper = {
  [SERVICE_TYPE.TRAINING]: {
    isOpenShiftStep: 4,
    confirmationStep: 6,
  },
};

export default function AddBookingScreen() {
  const searchParams = useLocalSearchParams();
  const { serviceTypes } = usePetOwnerProfile();
  const type = searchParams.type as string;

  const serviceType = serviceTypes.find(
    (serviceType) => serviceType.type === type
  );

  if (!mapper[type] || !serviceType) return null;

  return (
    <View style={styles.container}>
      <AddBookingProvider
        serviceTypeId={serviceType.id}
        isOpenShiftStep={mapper[type].isOpenShiftStep}
        confirmationStep={mapper[type].confirmationStep}
      >
        {type === SERVICE_TYPE.TRAINING && <AddTrainingBookingForm />}
      </AddBookingProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },
});
