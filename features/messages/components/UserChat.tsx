import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as BaseImagePicker from "expo-image-picker";
import { useFocusEffect, useNavigation } from "expo-router";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

import { ImagePicker } from "@/components/image/ImagePicker";
import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import { lightGrayColor, whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { addQueryParams, Get } from "@/services/http-service";
import { TChat, TChatThread } from "@/types/chats";
import { TAuthUser, TUser } from "@/types/users";

export interface UserChatProps {
  user: TAuthUser;
  threadId: string;
}

export default function UserChat({ user, threadId }: UserChatProps) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { socket } = useSocket();

  const roomRef = useRef("");

  const { data, isLoading: isLoadingChats } = useQuery<{
    chatThread: TChatThread;
    chats: TChat[];
  }>({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      const chatThread = await Get(`/v2/chat-threads/${threadId}`);
      const chats = (await Get(
        addQueryParams(`/v2/chat-threads/${threadId}/chats`, {
          filter: JSON.stringify({
            order: "createdat DESC",
          }),
        })
      )) as TChat[];

      const messages = (chats ?? []).map((chat) => {
        const userUser = userMapper[chat.usersId];

        return {
          _id: chat.id,
          text: chat.message,
          createdAt: chat.createdAt,
          user: {
            _id: user.id === chat.usersId ? 1 : 2,
            name: userUser?.firstName,
            avatar: userUser?.profileImage,
          },
          image: chat.image,
        };
      });

      setMessages(messages);

      queryClient.refetchQueries({
        queryKey: ["/v2/chat-threads"],
      });

      return {
        chatThread,
        chats,
      };
    },
  });

  const users = data?.chatThread?.users;

  const userMapper: Record<string, TUser> = useMemo(() => {
    const mapper: Record<string, TUser> = {};
    if (users?.length) {
      users.forEach((user) => (mapper[user.id] = user));
    }
    return {};
  }, [users]);

  const otherUser = useMemo(
    () => users?.find((u) => u.id !== user.id),
    [users, user.id]
  );

  const connectSocket = useCallback(() => {
    console.log("scoket", socket.active, token);
    if (!token) return;
    if (otherUser?.id && !roomRef.current) {
      socket.auth = { token };
      socket.connect();
      roomRef.current = otherUser?.id;

      console.log("scoket connected", socket.auth);

      socket.on("connect", () => {
        socket.emit("register", user.id);
      });

      if (roomRef.current !== "") {
        socket.emit("join_room", JSON.stringify(roomRef.current));
      }

      setTimeout(async () => {
        await queryClient.refetchQueries({
          queryKey: ["thread", threadId],
        });
      }, 1000);
    }
  }, [socket, otherUser?.id, user.id, token, queryClient, threadId]);

  useFocusEffect(connectSocket);

  // useEffect(connectSocket, [otherUser?.id, roomRef.current, connectSocket]);

  useEffect(() => {
    navigation.setOptions({ title: data?.chatThread.name });

    const unsubscribe = navigation.addListener("beforeRemove", () => {
      if (socket && roomRef.current) {
        socket.emit("leaveChat", roomRef.current);
        socket.off("receive_message");
        socket.close();
      }
      setMessages([]);
    });

    return unsubscribe;
  }, [socket, navigation, data?.chatThread]);

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      socket.emit("send_message", {
        from: user.id,
        to: otherUser?.id,
        room: roomRef.current,
        thread: threadId,
        message: messages[0].text,
      });

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      await queryClient.refetchQueries({ queryKey: ["/v2/chat-threads"] });
    },
    [socket, threadId, otherUser, user.id, queryClient]
  );

  const onImageSelected = useCallback(
    async (image: BaseImagePicker.ImagePickerAsset) => {
      socket.emit("send_message", {
        from: user.id,
        to: otherUser?.id,
        room: roomRef.current,
        thread: threadId,
        message: "",
        image: image.uri,
      });

      const newMessage = {
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        user: { _id: 1, avatar: user.profileImage, name: user.firstName },
        text: "",
        image: image.uri,
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [newMessage])
      );

      await queryClient.refetchQueries({ queryKey: ["/v2/chat-threads"] });
    },
    [socket, threadId, otherUser, queryClient, user]
  );

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const newMessage = {
        _id: Math.random().toString(36).substr(2, 9),
        text: data.message,
        createdAt: new Date(),
        user: data.user,
        image: data.image,
      };

      socket.emit("message_received", {
        usersId: otherUser?.id,
        threadId,
      });

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [newMessage])
      );
    });
  }, [socket, otherUser?.id, threadId]);

  if (isLoadingChats) return <ThemedText>Loading...</ThemedText>;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: 100,
        backgroundColor: whiteColor,
      }}
    >
      <View
        style={{
          flex: 1,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: lightGrayColor,
        }}
      >
        <GiftedChat
          keyboardShouldPersistTaps="handled"
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
            name: user?.firstName,
            avatar: user?.profileImage,
          }}
          renderAvatar={(props) => (
            <UserAvatar src={props.currentMessage?.user.avatar as string} />
          )}
          renderActions={() => (
            <ImagePicker
              trigger={
                <View
                  style={{
                    alignSelf: "center",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                  }}
                >
                  <Entypo name="camera" size={24} color="black" />
                </View>
              }
              onSelect={onImageSelected}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
