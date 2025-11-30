import { StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import { ThemedText } from "@/components/themed-text";
import { secondaryColor, whiteColor } from "@/constants/theme";
import { ServicesMenu } from "@/features/services/components/ServicesMenu";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function HomeScreen() {
  const { currUser } = useAuth();
  const primaryColor = useThemeColor({}, "primary");

  return (
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

      <ServicesMenu />

      <View
        style={{
          backgroundColor: primaryColor,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          gap: 32,
          paddingBottom: 500,
        }}
      >
        <View>
          <Text
            style={{
              color: whiteColor,
              fontFamily: "Karantina",
              fontSize: 48,
              textAlign: "center",
            }}
          >
            MY LOCAL PET PRO
          </Text>
          <Text style={{ fontFamily: "Poppins", textAlign: "center" }}>
            Nearby pet Caregivers
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", gap: 32, justifyContent: "center" }}
        >
          <View style={{ width: 128, height: 128, backgroundColor: "pink" }} />
          <View style={{ width: 128, height: 128, backgroundColor: "pink" }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
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
