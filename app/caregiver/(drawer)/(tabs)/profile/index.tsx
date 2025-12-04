import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { grayColor, primaryColor, whiteColor } from "@/constants/theme";
import { useBooking } from "@/hooks/use-booking";
import { useProfile } from "@/hooks/use-profile";

export default function MyBookingsScreen() {
  const { bookings, isLoadingBookings } = useBooking();
  const router = useRouter();

  const { caregiverProfile, caregiverProfileCompletion } = useProfile();

  const isBackgroundVerificationLeft =
    caregiverProfileCompletion.percentage === 80;

  const menu = [
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Background Verification",
      isDone: caregiverProfileCompletion.isBackgroundVerifyStatus,
      isDisabled: !isBackgroundVerificationLeft,
      onPress: () => router.push("/caregiver/profile/background-verification"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Bio Description",
      isDone: true,
      onPress: () => router.push("/caregiver/profile/bio-description"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Emergency Contact",
      isDone: caregiverProfileCompletion.isBackgroundVerifyStatus,
      isDisabled: !isBackgroundVerificationLeft,
      onPress: () => router.push("/caregiver/profile/emergency-contact"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Caregiver Preferences",
      isDone: caregiverProfileCompletion.isBackgroundVerifyStatus,
      isDisabled: !isBackgroundVerificationLeft,
      onPress: () => router.push("/caregiver/profile/preferences"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Unique Skills",
      isDone: caregiverProfileCompletion.isBackgroundVerifyStatus,
      isDisabled: !isBackgroundVerificationLeft,
      onPress: () => router.push("/caregiver/profile/skills"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Experience with Pet Care",
      isDone: caregiverProfileCompletion.isBackgroundVerifyStatus,
      isDisabled: !isBackgroundVerificationLeft,
      onPress: () => router.push("/caregiver/profile/experiences"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Price & Service Type",
      isDone: caregiverProfileCompletion.isBackgroundVerifyStatus,
      isDisabled: !isBackgroundVerificationLeft,
      onPress: () => router.push("/caregiver/profile/service-types"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Your Gallery",
      isDone: caregiverProfileCompletion.isBackgroundVerifyStatus,
      isDisabled: !isBackgroundVerificationLeft,
      onPress: () => router.push("/caregiver/profile/gallery"),
    },
  ];

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View
          style={{
            padding: 16,
            backgroundColor: primaryColor,
            borderRadius: 8,
          }}
        >
          <ThemedText
            type="title"
            style={{
              color: whiteColor,
              fontSize: 32,
            }}
          >
            {caregiverProfile.users.firstName} {caregiverProfile.users.lastName}
          </ThemedText>
          <ThemedText style={{ fontSize: 16, color: whiteColor }}>
            {caregiverProfile.users.email}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText>Profile progress</ThemedText>
          <ThemedText>{caregiverProfileCompletion.percentage}%</ThemedText>
        </View>
        <View
          style={{ height: 8, backgroundColor: grayColor, borderRadius: 4 }}
        >
          <View
            style={{
              height: 8,
              width: `${caregiverProfileCompletion.percentage}%`,
              backgroundColor: primaryColor,
              borderRadius: 4,
            }}
          ></View>
        </View>
        <FlatList
          scrollEnabled={false}
          data={menu}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={item.onPress}
              >
                {item.icon}
                <ThemedText>{item.label}</ThemedText>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
  },
  itemContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
});
