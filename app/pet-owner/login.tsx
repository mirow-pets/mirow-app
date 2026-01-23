import React from "react";

import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginScreen() {
  return (
    <AuthScreenLayout
      bgImage={require("@/assets/images/pet-owner-login-bg.png")}
      showLogo
    >
      <LoginForm
        path="/users/login"
        redirect="/pet-owner"
        signUpPath="/pet-owner/sign-up"
      />
    </AuthScreenLayout>
  );
}
