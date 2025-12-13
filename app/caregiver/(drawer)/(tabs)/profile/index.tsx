import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { grayColor, redColor, whiteColor } from "@/constants/theme";
import { CaregiverProfileDetailsCard } from "@/features/profile/components/CaregiverProfileDetails";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ProfileScreen() {
  const primaryColor = useThemeColor({}, "primary");
  const router = useRouter();

  const { profile, profileCompletion } = useCaregiverProfile();

  const isBackgroundVerificationLeft = profileCompletion?.percentage === 80;

  const menu = [
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: `${"Background Verification"} ${
        profile?.backgroundVerifyStatus
          ? `(${profile?.backgroundVerifyStatus})`
          : ""
      }`,
      isDone:
        ["pending", "cleared"].includes(profile?.backgroundVerifyStatus) ||
        profileCompletion?.isBackgroundVerifyStatus,
      isDisabled:
        !isBackgroundVerificationLeft ||
        ["pending", "cleared"].includes(profile?.backgroundVerifyStatus),
      onPress: () => router.push("/caregiver/profile/background-verification"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Fullname",
      isDone: true,
      onPress: () => router.push("/caregiver/profile/fullname"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Phone",
      isDone: true,
      onPress: () => router.push("/caregiver/profile/phone"),
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
      label: "Address",
      isDone: true,
      onPress: () => router.push("/caregiver/profile/address"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Emergency Contact",
      isDone: profileCompletion?.isEmergencyDetailsAdded,
      onPress: () => router.push("/caregiver/profile/emergency-contact"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Payment Information",
      isDone: true,
      isDisabled: profileCompletion?.percentage !== 100,
      onPress: () => router.push("/caregiver/profile/banks"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Caregiver Preferences",
      isDone: profileCompletion?.isCaregiverPreferencesAdded,
      onPress: () => router.push("/caregiver/profile/preferences"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Unique Skills",
      isDone: profileCompletion?.isCaregiverSkillsAdded,
      onPress: () => router.push("/caregiver/profile/skills"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Experience with Pet Care",
      isDone: true,
      onPress: () => router.push("/caregiver/profile/experiences"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Rates & Services",
      isDone: profileCompletion?.isPriceAdded,
      onPress: () => router.push("/caregiver/profile/service-types"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Gallery",
      isDone: profileCompletion?.isGalleryAdded,
      onPress: () => router.push("/caregiver/profile/gallery"),
    },
  ];

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <CaregiverProfileDetailsCard />
        <View
          style={{ height: 8, backgroundColor: grayColor, borderRadius: 4 }}
        >
          <View
            style={{
              height: 8,
              width: `${profileCompletion?.percentage}%`,
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
                style={[
                  styles.itemContainer,
                  item.isDisabled ? styles.disabled : {},
                  item.isDone ? {} : styles.notDone,
                ]}
                onPress={item.onPress}
                disabled={item.isDisabled}
              >
                {item.icon}
                <ThemedText>{item.label}</ThemedText>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
    backgroundColor: whiteColor,
  },
  itemContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  notDone: {
    borderColor: redColor,
  },
});
