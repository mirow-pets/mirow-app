import React from "react";

import { ScrollView } from "react-native-gesture-handler";

import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpScreen() {
  return (
    <AuthScreenLayout bgImage={require("@/assets/images/signup-bg.png")}>
      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
        <SignUpForm path="/users/signup" redirect="/pet-owner" />
      </ScrollView>
    </AuthScreenLayout>
  );
}
