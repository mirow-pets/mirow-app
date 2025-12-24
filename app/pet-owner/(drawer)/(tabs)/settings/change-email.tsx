import React from "react";

import ChangeEmailForm from "@/features/auth/components/ChangeEmailForm";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";

export default function ChangeEmailScreen() {
  const { profile } = usePetOwnerProfile();

  return <ChangeEmailForm user={profile!} />;
}
