import React from "react";

import BackgroundVerificationForm from "@/features/profile/components/BackgroundVerificationForm";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";

export default function BackgroundVerificationScreen() {
  const { profile } = useCaregiverProfile();

  if (!profile) return null;

  return <BackgroundVerificationForm />;
}
