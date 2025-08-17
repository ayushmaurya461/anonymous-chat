import type { Dispatch, SetStateAction } from "react";
import type { Chat, Messages, ReceivedMessage, Room } from "../models/messages";

type Props = {
  message: ReceivedMessage;
  setActiveChat: Dispatch<SetStateAction<Chat | null>>;
  setMessages: Dispatch<SetStateAction<Messages[]>>;
  activeChat: Chat | null;
  messages: Messages[];
  rooms: Room[];
  setRooms: Dispatch<SetStateAction<Room[]>>;
};

export const filterChats = ({
  message,
  setActiveChat,
  activeChat,
  setMessages,
  messages,
  setRooms,
}: Props) => {
  if (
    [message.sender_id, message.receiver_id, message.room_id].includes(
      activeChat?.id as string
    )
  ) {
    if (message.type === "message") {
      console.log(message);
      setActiveChat((prev) =>
        prev ? { ...prev, messages: [...(prev.messages || []), message] } : prev
      );
    }
  } else if (message.type == "users_list") {
    setMessages((prev) => {
      const existingIds = new Set(prev.map((chat) => chat.id));
      const newMessages = messages.filter(
        (chat: Messages) => !existingIds.has(chat.id)
      );
      return [...prev, ...newMessages];
    });
  } else {
    if (message.room_id) {
      setRooms((prev) => {
        const updatedMessages = prev.map((chat) => {
          if (chat.id === message.sender_id) {
            return {
              ...chat,
              unread: chat.unread ? chat.unread + 1 : 1,
            };
          }
          return chat;
        });
        return updatedMessages;
      });
    } else {
      setMessages((prev) => {
        const updatedMessages = prev.map((chat) => {
          if (chat.id === message.sender_id) {
            return {
              ...chat,
              unread: chat.unread ? chat.unread + 1 : 1,
            };
          }
          return chat;
        });
        return updatedMessages;
      });
    }
  }
};
