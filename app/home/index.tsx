import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";
import { Href, Redirect, router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { secondaryColor, whiteColor } from "@/constants/theme";
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
