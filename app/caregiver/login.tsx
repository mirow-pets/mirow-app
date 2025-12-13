import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { secondaryColor, whiteColor } from "@/constants/theme";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/caregiver/sign-up");
  };

  return (
    <AuthScreenLayout
      image={require("@/assets/images/login-signup-image.png")}
      bgImage={require("@/assets/images/caregiver-login-bg.png")}
      title="PET CAREGIVER"
      subTitle={
        <View style={{ flexDirection: "row" }}>
          <ThemedText type="subtitle" style={{ color: whiteColor }}>
            Don’t have an account yet?{" "}
          </ThemedText>
          <TouchableOpacity onPress={handleSignIn}>
            <ThemedText type="subtitle" style={{ color: secondaryColor }}>
              Paws here!
            </ThemedText>
          </TouchableOpacity>
        </View>
      }
      showSwitchRole
    >
      <LoginForm path="/caregivers/login" redirect="/caregiver" />
    </AuthScreenLayout>
  );
}
