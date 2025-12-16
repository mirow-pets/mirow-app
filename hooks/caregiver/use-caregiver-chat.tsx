import { createContext, ReactNode, useContext, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { Get } from "@/services/http-service";
import { TChatThread } from "@/types";

export interface CaregiverChatContextValues {
  getChatThread: (_chatThreadId: string) => void;
  isLoadingChatThread: boolean;
  chatThread: TChatThread;
}

export const CaregiverChatContext =
  createContext<CaregiverChatContextValues | null>(null);

export interface CaregiverChatProviderProps {
  children: ReactNode;
}

const CaregiverChatProvider = ({ children }: CaregiverChatProviderProps) => {
  const [chatId, setChatId] = useState<TChatThread["id"]>();
  const queryClient = useQueryClient();

  const onError = (err: Error) => {
    console.log(err);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "An unexpected error occurred. Please try again.",
    });
  };

  let { data: chatThread, isLoading: isLoadingChatThread } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => Get(`/v2/caregivers/chats/${chatId}`),
    enabled: !!chatId,
  });

  const getChatThread = (chatId: string) => {
    setChatId(chatId);
  };

  return (
    <CaregiverChatContext.Provider
      value={{
        getChatThread,
        isLoadingChatThread,
        chatThread,
      }}
    >
      {children}
    </CaregiverChatContext.Provider>
  );
};

export default CaregiverChatProvider;

export const useCaregiverChat = () => {
  const chat = useContext(CaregiverChatContext);

  if (!chat) {
    throw new Error(
      "Cannot access useCaregiverChat outside CaregiverChatProvider"
    );
  }
  return chat;
};
