import { createContext, ReactNode, useContext, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Get } from "@/services/http-service";
import { TChatThread } from "@/types";
import { onError } from "@/utils";

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

  let { data: chatThread, isLoading: isLoadingChatThread } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => Get(`/v2/caregivers/chats/${chatId}`),
    enabled: !!chatId,
    meta: {
      onError,
    },
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
