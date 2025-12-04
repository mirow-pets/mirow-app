import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { secondaryColor, whiteColor } from "@/constants/theme";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/pet-owner/login");
  };

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <AuthScreenLayout
        image={require("@/assets/images/login-signup-image.png")}
        bgImage={require("@/assets/images/login-signup-bg.png")}
        title="PET OWNER"
        showSwitchRole
        subTitle={
          <View style={{ flexDirection: "row" }}>
            <ThemedText type="subtitle" style={{ color: whiteColor }}>
              Already a member?{" "}
            </ThemedText>
            <TouchableOpacity onPress={handleSignIn}>
              <ThemedText type="subtitle" style={{ color: secondaryColor }}>
                Sign in
              </ThemedText>
            </TouchableOpacity>
          </View>
        }
      >
        <SignUpForm path="/users/signup" redirect="/pet-owner" />
      </AuthScreenLayout>
    </ScrollView>
  );
}
