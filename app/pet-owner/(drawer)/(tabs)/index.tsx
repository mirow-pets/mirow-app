import { StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { secondaryColor, whiteColor } from "@/constants/theme";
import { NearbyCaregivers } from "@/features/caregivers/components/NearbyCaregivers";
import { PetPerks } from "@/features/pets/components/PetPerks";
import { ServicesMenu } from "@/features/services/components/ServicesMenu";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TCaregiver, TServiceType } from "@/types";

export default function PetOwnerHomeScreen() {
  const primaryColor = useThemeColor({}, "primary");

  // TODO: Implement booking service type
  const handleServiceClick = (_type: TServiceType["type"]) => {
    router.push("/pet-owner/bookings/add");
  };

  const handleViewCaregiver = (caregiverId: TCaregiver["usersId"]) => {
    router.push(`/pet-owner/caregivers/${caregiverId}`);
  };

  const handleViewCaregivers = () => router.replace(`/pet-owner/caregivers`);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: primaryColor,
            padding: 16,
            borderRadius: 8,
            gap: 16,
            marginHorizontal: 16,
          }}
        >
          <Image
            source={require("@/assets/images/mirow-text-logo.png")}
            style={{ width: 50, height: 16, objectFit: "fill" }}
          />
          <View>
            <View style={{ flexDirection: "row" }}>
              <ThemedText
                style={{
                  color: secondaryColor,
                  boxShadow: `1px_2px_1px_rgba(0,0,0,0.6)`,
                  textShadowColor: "rgba(0,0,0,0.4)",
                  textShadowRadius: 1,
                  textShadowOffset: { width: 1, height: 2 },
                }}
              >
                50% Off{" "}
              </ThemedText>
              <ThemedText
                style={{
                  color: whiteColor,
                  boxShadow: `1px_2px_1px_rgba(0,0,0,0.6)`,
                  textShadowColor: "rgba(0,0,0,0.4)",
                  textShadowRadius: 1,
                  textShadowOffset: { width: 1, height: 2 },
                }}
              >
                on first
              </ThemedText>
            </View>
            <ThemedText
              style={{
                color: whiteColor,
                boxShadow: `1px_2px_1px_rgba(0,0,0,0.6)`,
                textShadowColor: "rgba(0,0,0,0.4)",
                textShadowRadius: 1,
                textShadowOffset: { width: 1, height: 2 },
              }}
            >
              100 sign-ups!
            </ThemedText>
          </View>
        </View>

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
