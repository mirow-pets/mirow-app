import { StyleSheet, View } from "react-native";

import { Image } from "expo-image";

import { ThemedText } from "@/components/themed-text";
import { secondaryColor, whiteColor } from "@/constants/theme";
import { CompleteAccountSetup } from "@/features/profile/components/CompleteAccountSetup";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function CaregiverHomeScreen() {
  const primaryColor = useThemeColor({}, "primary");
  const { profileCompletion } = useCaregiverProfile();

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: primaryColor,
          padding: 16,
          borderRadius: 8,
          gap: 16,
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
      {profileCompletion && profileCompletion?.percentage !== 100 && (
        <CompleteAccountSetup progress={profileCompletion?.percentage ?? 0} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
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
