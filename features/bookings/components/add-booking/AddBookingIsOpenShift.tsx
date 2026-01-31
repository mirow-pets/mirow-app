import { StyleSheet, TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFormContext } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { grayColor, primaryColor, secondaryColor } from "@/constants/theme";
import { TAddBooking } from "@/features/bookings/validations";
import { useAddBooking } from "@/hooks/use-add-booking-form";

export interface AddBookingIsOpenShiftProps {
  progress: number;
}

export const AddBookingIsOpenShift = ({
  progress,
}: AddBookingIsOpenShiftProps) => {
  const { prev, handleIsOpenShiftNext } = useAddBooking();
  const form = useFormContext<TAddBooking>();

  const errors = form.formState.errors;
  const isOpenShift = form.watch("isOpenShift");

  const options = [
    {
      icon: <Feather name="clock" size={32} color="black" />,
      label: "Post as open shift",
      description: `Your request is automatically sent to nearby pet caregivers who are ready to help`,
      value: true,
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="account-group-outline"
          size={32}
          color="black"
        />
      ),
      label: "Let me pick!",
      description: `We'll send your request to caregivers who are perfect match for your pet`,
      value: false,
    },
  ];

  return (
    <FormStepsLayout
      {...{
        onNext: handleIsOpenShiftNext(["isOpenShift"]),
        onPrev: prev,
        progress,
      }}
    >
      <ThemedText type="defaultSemiBold">How to pick your caregiver</ThemedText>
      {options.map(({ icon, label, description, value }, i) => (
        <TouchableOpacity
          style={[
            styles.optionContainer,
            isOpenShift === value ? styles.optionContainerActive : {},
          ]}
          key={i}
          onPress={() => form.setValue("isOpenShift", value)}
        >
          {icon}
          <View style={{ width: 300 }}>
            <ThemedText type="defaultSemiBold">{label}</ThemedText>
            <ThemedText style={{ fontSize: 11 }}>{description}</ThemedText>
          </View>
        </TouchableOpacity>
      ))}
      <HelperText type="error">
        {errors?.isOpenShift?.message?.toString()}
      </HelperText>
    </FormStepsLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
    backgroundColor: primaryColor,
  },
  optionContainer: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: grayColor,
  },
  optionContainerActive: {
    borderColor: secondaryColor,
  },
});
