import React from "react";

import DeactivateAccountForm from "@/features/auth/components/DeactivateAccountForm";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";

export default function DeactivateAccountScreen() {
  const { profile } = useCaregiverProfile();

  return <DeactivateAccountForm user={profile.users!} />;
}
