import React from "react";

import ChangeEmailForm from "@/features/auth/components/ChangeEmailForm";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";

export default function ChangeEmailScreen() {
  const { profile } = useCaregiverProfile();

  return <ChangeEmailForm user={profile.users!} />;
}
