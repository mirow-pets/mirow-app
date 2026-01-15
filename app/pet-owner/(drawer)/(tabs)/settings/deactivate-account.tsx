import React from "react";

import DeactivateAccountForm from "@/features/auth/components/DeactivateAccountForm";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";

export default function DeactivateAccountScreen() {
  const { profile } = usePetOwnerProfile();

  return <DeactivateAccountForm user={profile!} />;
}
