import { router } from "expo-router";

import { Get } from "@/services/http-service";
import { TUser, UserRole } from "@/types";

import { useAuth } from "./use-auth";

export const useMessage = () => {
  const { userRole } = useAuth();
  const handleMessage = async (userId: TUser["id"]) => {
    const result = await Get(`/chat-threads/${userId}`);

    router.push(`/${userRole as UserRole}/messages/${result.threadId}`);
  };

  return handleMessage;
};
