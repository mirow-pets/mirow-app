import { StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { whiteColor } from "@/constants/theme";
import { NearbyCaregivers } from "@/features/caregivers/components/NearbyCaregivers";
import { PetPerks } from "@/features/pets/components/PetPerks";
import { CompleteAccountSetup } from "@/features/profile/components/CompleteAccountSetup";
import { ServicesMenu } from "@/features/services/components/ServicesMenu";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TCaregiver, TServiceType } from "@/types";

export default function PetOwnerHomeScreen() {
  const primaryColor = useThemeColor({}, "primary");
  const { profileCompletion } = usePetOwnerProfile();

  // TODO: Implement booking service type
  const handleServiceClick = (type: TServiceType["type"]) => {
    router.push({ pathname: "/pet-owner/bookings/add", params: { type } });
  };

  const handleViewCaregiver = (caregiverId: TCaregiver["usersId"]) => {
    router.push(`/pet-owner/caregivers/${caregiverId}`);
  };

  const handleViewCaregivers = () =>
    router.replace(`/pet-owner/caregivers/nearby`);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ padding: 16 }}>
          <Image
            source={require("@/assets/images/50-off-banner.png")}
            style={{ width: "100%", height: 180, objectFit: "fill" }}
          />
        </View>

        {profileCompletion && profileCompletion?.percentage !== 100 && (
          <View style={{ paddingHorizontal: 16 }}>
            <CompleteAccountSetup
              progress={profileCompletion?.percentage ?? 0}
            />
          </View>
        )}

        <View>
          <Text
            style={{
              color: primaryColor,
              fontFamily: "Karantina",
              fontSize: 48,
              textAlign: "center",
            }}
          >
            SUPER PET POWERS!
          </Text>
          <Text style={{ fontFamily: "Poppins", textAlign: "center" }}>
            Choose your pet&apos;s adventure
          </Text>
        </View>

        <ServicesMenu onClick={handleServiceClick} />

        <NearbyCaregivers
          onClick={handleViewCaregiver}
          onSeeMore={handleViewCaregivers}
        />

        <PetPerks onClick={() => {}} onSeeMore={() => {}} />
        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flex: 1,
    backgroundColor: whiteColor,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
