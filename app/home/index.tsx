import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";
import { Href, Redirect, router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { NearbyCaregivers } from "@/features/caregivers/components/NearbyCaregivers";
import { PetPerks } from "@/features/pets/components/PetPerks";
import { ServicesMenu } from "@/features/services/components/ServicesMenu";
import { useAuth } from "@/hooks/use-auth";
import LocationProvider from "@/hooks/use-location";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function HomeScreen() {
  const { userRole } = useAuth();
  const primaryColor = useThemeColor({}, "primary");

  const handleSelectRole = () => router.push(`/select-role`);

  useEffect(() => {
    if (userRole) router.push(`/${userRole}` as Href);
  }, [userRole]);

  if (userRole) return <Redirect href={`/${userRole}`} />;

  return (
    <LocationProvider>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ padding: 16 }}>
            <Image
              source={require("@/assets/images/50-off-banner.png")}
              style={{ width: "100%", height: 180, objectFit: "fill" }}
            />
          </View>

          <View>
            <ThemedText
              type="title"
              style={{
                color: primaryColor,
                fontFamily: "Karantina",
                fontSize: 48,
                textAlign: "center",
              }}
            >
              SUPER PET POWERS!
            </ThemedText>
            <Text style={{ fontFamily: "Poppins", textAlign: "center" }}>
              Choose your pet&apos;s adventure
            </Text>
          </View>

          <ServicesMenu onClick={handleSelectRole} />

          <NearbyCaregivers
            onClick={handleSelectRole}
            onSeeMore={handleSelectRole}
          />

          <PetPerks onClick={handleSelectRole} onSeeMore={handleSelectRole} />
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </LocationProvider>
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
