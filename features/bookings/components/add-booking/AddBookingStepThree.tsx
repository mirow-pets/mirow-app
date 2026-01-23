import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";

import { FilterButton } from "@/components/button/FilterButton";
import { UserAvatar } from "@/components/image/UserAvatar";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import {
  grayColor,
  primaryColor,
  secondaryColor,
  whiteColor,
} from "@/constants/theme";
import { TAddBooking } from "@/features/bookings/validations";
import { usePetOwnerCaregiverFilter } from "@/hooks/pet-owner/use-pet-owner-caregivers-filter";
import { TCaregiver, TUser } from "@/types";
import { majorToCentUnit } from "@/utils";

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
  const router = useRouter();

  const { filter } = usePetOwnerCaregiverFilter();

  const form = useFormContext<TAddBooking>();

  const values = form.watch();

  const handleViewCaregiver = (userId: TUser["id"]) => {
    router.push(`/pet-owner/bookings/add/caregivers/${userId}`);
  };

  const handleFilter = () => {
    router.push(`/pet-owner/bookings/add/caregivers/filter`);
  };

  return (
    <FormStepsLayout {...{ onNext, onPrev, loading, progress: 0.8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText type="defaultSemiBold">Pick your caregiver</ThemedText>
        <FilterButton onPress={handleFilter} />
      </View>
      <View style={{ gap: 8, flex: 1 }}>
        <InfiniteFlatList<{
          usersId: TCaregiver["usersId"];
          acceptanceRadius: TCaregiver["acceptanceRadius"];
          experience: TCaregiver["experience"] | null;
          averageStarRatings: TCaregiver["averageStarRatings"] | null;
          totalStars: TCaregiver["totalStars"] | null;
          totalReviews: TCaregiver["totalReviews"] | 0;
          serviceCompleted: number;
          firstName: TUser["firstName"];
          lastName: TUser["lastName"];
          profileImage: TUser["profileImage"];
          distance: { text?: string };
        }>
          url="/v2/caregivers"
          queryParams={{
            ...filter,
            price: filter.price && majorToCentUnit(filter.price),
          }}
          perPage={10}
          style={{ height: 400 }}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionContainer,
                values.caregiversIds?.includes(item.usersId)
                  ? styles.optionContainerActive
                  : {},
              ]}
              onPress={() => handleViewCaregiver(item.usersId)}
            >
              <UserAvatar src={item.profileImage} size={40} />
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">
                  {item.firstName} {item.lastName}
                </ThemedText>
                <ThemedText>
                  Distance: {item?.distance?.text ?? `0 mi`}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => form.setValue("caregiversIds", [item.usersId])}
              >
                <Feather
                  name="check"
                  size={24}
                  color={
                    values.caregiversIds?.includes(item.usersId)
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
