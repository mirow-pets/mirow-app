import React from "react";

import { useLocalSearchParams } from "expo-router";

import UserChat from "@/features/messages/components/UserChat";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";

export default function ChatScreen() {
  const { threadId } = useLocalSearchParams();
  const { profile } = useCaregiverProfile();

  return <UserChat user={profile.users} threadId={threadId as string} />;
}
