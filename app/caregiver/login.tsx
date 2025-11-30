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
      image={require("@/assets/images/react-logo.png")}
      title="PET CAREGIVER"
      subTitle={
        <View style={{ flexDirection: "row" }}>
          <ThemedText type="subtitle" style={{ color: whiteColor }}>
            Not a member?{" "}
          </ThemedText>
          <TouchableOpacity onPress={handleSignIn}>
            <ThemedText type="subtitle" style={{ color: secondaryColor }}>
              Sign up
            </ThemedText>
          </TouchableOpacity>
        </View>
      }
    >
      <LoginForm path="/users/login" redirect="/caregiver" />
    </AuthScreenLayout>
  );
}
