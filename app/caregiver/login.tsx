import React from "react";
import { View } from "react-native";

import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginScreen() {
  return (
    <View style={{ backgroundColor: "red", flex: 1 }}>
      <AuthScreenLayout
        bgImage={require("@/assets/images/caregiver-login-bg.png")}
        showLogo
      >
        <LoginForm
          path="/caregivers/login"
          redirect="/caregiver"
          signUpPath="/caregiver/sign-up"
        />
      </AuthScreenLayout>
    </View>
  );
}
