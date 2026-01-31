import React from "react";

import { useLocalSearchParams } from "expo-router";

import UserChat from "@/features/messages/components/UserChat";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";

export default function ChatScreen() {
  const { threadId } = useLocalSearchParams();
  const { profile } = usePetOwnerProfile();

  return <UserChat user={profile!} threadId={threadId as string} />;
}
