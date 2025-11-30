import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { FlatList } from "react-native-gesture-handler";

import { PetAvatar } from "@/components/image/PetAvatar";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import {
  grayColor,
  primaryColor,
  secondaryColor,
  whiteColor,
} from "@/constants/theme";
import { TAddBooking } from "@/features/bookings/validations";
import { useCaregiver } from "@/hooks/use-caregiver";
import { TUser } from "@/types";

export interface AddBookingStepThreeProps {
  onPrev?: () => void;
  onNext: () => void;
  loading?: boolean;
}

export const AddBookingStepThree = ({
  onNext,
  onPrev,
  loading,
}: AddBookingStepThreeProps) => {
  const { caregivers, isLoadingCaregivers } = useCaregiver();
  const form = useFormContext<TAddBooking>();

  const router = useRouter();

  const caregiversIds = form.watch("caregiversIds");

  if (isLoadingCaregivers)
    return <ThemedText>Loading caregivers...</ThemedText>;

  if (!caregivers.length) return <ThemedText>No caregiver</ThemedText>;

  const handleViewCaregiver = (userId: TUser["id"]) => {
    router.push(`/pet-owner/bookings/add/caregivers/${userId}`);
  };

  return (
    <FormStepsLayout {...{ onNext, onPrev, loading }}>
      <ThemedText type="defaultSemiBold">Pick your caregiver</ThemedText>
      <View style={{ gap: 8 }}>
        <FlatList
          scrollEnabled={true}
          data={caregivers}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionContainer,
                caregiversIds?.includes(item.usersId)
                  ? styles.optionContainerActive
                  : {},
              ]}
              onPress={() => handleViewCaregiver(item.usersId)}
            >
              <PetAvatar src={item.users.profileImage} size={40} />
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">
                  {item.users.firstName}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => form.setValue("caregiversIds", [item.usersId])}
              >
                <Feather
                  name="check"
                  size={24}
                  color={
                    caregiversIds?.includes(item.usersId)
                      ? primaryColor
                      : grayColor
                  }
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
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
    backgroundColor: whiteColor,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionContainerActive: {
    borderColor: secondaryColor,
  },
});
