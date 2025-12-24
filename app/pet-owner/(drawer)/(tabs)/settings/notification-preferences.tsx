import React from "react";

import NotificationPreferencesForm from "@/features/auth/components/NotificationPreferencesForm";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";

export default function NotificationPreferencesScreen() {
  const { profile } = usePetOwnerProfile();

  return <NotificationPreferencesForm user={profile!} />;
}
