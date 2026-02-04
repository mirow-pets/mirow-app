import React from "react";

import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";

export default function ChangePasswordScreen() {
  const { profile } = usePetOwnerProfile();

  return <ChangePasswordForm user={profile!} />;
}
