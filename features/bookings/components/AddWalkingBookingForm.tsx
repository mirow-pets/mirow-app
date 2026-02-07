import { StyleSheet, View } from "react-native";

import { SERVICE_TYPE } from "@/constants/common";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useAddBooking } from "@/hooks/use-add-booking-form";

import { AddBookingConfirmation } from "./add-booking/AddBookingConfirmation";
import { AddBookingSelectCaregiver } from "./add-booking/AddBookingSelectCaregiver";
import { AddBookingSelectDateTime } from "./add-booking/AddBookingSelectDateTime";
import { AddBookingSelectPet } from "./add-booking/AddBookingSelectPet";
import { AddBookingSpecialInstruction } from "./add-booking/AddBookingSpecialInstruction";

export const AddWalkingBookingForm = () => {
  const { step } = useAddBooking();
  const { serviceTypes } = usePetOwnerProfile();

  const serviceType = serviceTypes?.find(
    (serviceType) => serviceType.type === SERVICE_TYPE.WALKING
  );

  if (!serviceType) return null;

  return (
    <>
      <View style={styles.container}>
        {step === 1 && <AddBookingSelectPet progress={0} />}
        {step === 2 && <AddBookingSelectDateTime progress={30} />}
        {step === 3 && <AddBookingSpecialInstruction progress={40} />}
        {step === 4 && (
          <AddBookingSelectCaregiver
            progress={80}
            serviceTypeId={serviceType.id}
          />
        )}
        {step === 5 && (
          <AddBookingConfirmation serviceType={serviceType.display} />
        )}
      </View>
      <View style={{ height: 100 }} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});
