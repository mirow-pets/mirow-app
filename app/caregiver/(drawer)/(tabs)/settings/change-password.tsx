import React from "react";

import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";

export default function ChangePasswordScreen() {
  const { profile } = useCaregiverProfile();

  return <ChangePasswordForm user={profile.users!} />;
}
