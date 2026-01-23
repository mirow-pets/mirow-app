import React from "react";

import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpScreen() {
  return (
    <AuthScreenLayout bgImage={require("@/assets/images/signup-bg.png")}>
      <SignUpForm path="/caregivers/signup" redirect="/caregiver" />
    </AuthScreenLayout>
  );
}
