import React from "react";

import NotificationPreferencesForm from "@/features/auth/components/NotificationPreferencesForm";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";

export default function NotificationPreferencesScreen() {
  const { profile } = useCaregiverProfile();

  return <NotificationPreferencesForm user={profile.users} />;
}
