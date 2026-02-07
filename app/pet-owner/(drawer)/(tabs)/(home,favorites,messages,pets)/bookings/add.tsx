import { StyleSheet, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { SERVICE_TYPE } from "@/constants/common";
import { whiteColor } from "@/constants/theme";
import { AddBoardingBookingForm } from "@/features/bookings/components/AddBoardingBookingForm";
import { AddGroomingBookingForm } from "@/features/bookings/components/AddGroomingBookingForm";
import { AddSittingBookingForm } from "@/features/bookings/components/AddSittingBookingForm";
import { AddTrainingBookingForm } from "@/features/bookings/components/AddTrainingBookingForm";
import { AddTransportationBookingForm } from "@/features/bookings/components/AddTransportationBookingForm";
import { AddWalkingBookingForm } from "@/features/bookings/components/AddWalkingBookingForm";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import AddBookingProvider from "@/hooks/use-add-booking-form";

const mapper = {
  [SERVICE_TYPE.TRAINING]: {
    isOpenShiftStep: 5,
    confirmationStep: 6,
  },
  [SERVICE_TYPE.SITTING]: {
    isOpenShiftStep: 4,
    confirmationStep: 5,
  },
  [SERVICE_TYPE.GROOMING]: {
    isOpenShiftStep: 5,
    confirmationStep: 6,
  },
  [SERVICE_TYPE.WALKING]: {
    isOpenShiftStep: 4,
    confirmationStep: 5,
  },
  [SERVICE_TYPE.BOARDING]: {
    isOpenShiftStep: 5,
    confirmationStep: 6,
  },
  [SERVICE_TYPE.TRANSPORTATION]: {
    isOpenShiftStep: 5,
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
        {type === SERVICE_TYPE.SITTING && <AddSittingBookingForm />}
        {type === SERVICE_TYPE.GROOMING && <AddGroomingBookingForm />}
        {type === SERVICE_TYPE.WALKING && <AddWalkingBookingForm />}
        {type === SERVICE_TYPE.BOARDING && <AddBoardingBookingForm />}
        {type === SERVICE_TYPE.TRANSPORTATION && (
          <AddTransportationBookingForm />
        )}
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
