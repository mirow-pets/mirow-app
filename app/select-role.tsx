import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { HeaderBackButton } from "@react-navigation/elements";
import { Image } from "expo-image";
import { Href, Redirect, useRouter } from "expo-router";

import { Button } from "@/components/button/Button";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/users";

export default function SelectRoleScreen() {
  const { userRole, setUserRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userRole) router.push(`/${userRole}` as Href);
  }, [userRole, router]);

  if (userRole) return <Redirect href={`/${userRole}`} />;

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <HeaderBackButton
        onPress={router.back}
        style={{
          position: "absolute",
          top: 48,
          left: 16,
          zIndex: 100,
        }}
      />
      <AuthScreenLayout
        bgImage={require("@/assets/images/select-role-bg.png")}
        showLogo
      >
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/select-role-image.png")}
            style={{ width: 300, height: 300 }}
          />
          <ThemedText
            type="title"
            style={{ color: whiteColor, textAlign: "center" }}
          >
            LET&apos;S GET YOU STARTED!
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={{ color: whiteColor, textAlign: "center", marginBottom: 16 }}
          >
            Hello there! Are you my
          </ThemedText>
          <Button
            onPress={() => {
              setUserRole(UserRole.PetOwner);
              router.push("/pet-owner/login");
            }}
            style={{ width: "80%" }}
            color="secondary"
            size="lg"
          >
            Pet Owner
          </Button>
          <View style={{ marginVertical: 4 }} />
          <Button
            onPress={() => {
              setUserRole(UserRole.CareGiver);
              router.push("/caregiver/login");
            }}
            style={{ width: "80%" }}
            color="white"
            size="lg"
          >
            Pet Caregiver
          </Button>
        </View>
      </AuthScreenLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 32,
  },
});
