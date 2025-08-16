import { createContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { getUsers } from "../api/users";
import type { Room, Messages, Chat, ChatContextType } from "../models/messages";
import { useWebSocketChat } from "../hooks/use-websocket";

const ChatCtx = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const auth = useAuth();

  // Restore active chat on mount
  useEffect(() => {
    const storedChat = sessionStorage.getItem("active_chat");
    console.log("hello Stored", storedChat)
    if (storedChat) {
      try {
        const parsed = JSON.parse(storedChat);
        if (parsed?.id) setActiveChat(parsed);
      } catch (err) {
        console.error("Failed to parse active_chat", err);
      }
    }
  }, []);

  // Persist active chat changes
  useEffect(() => {
    if (activeChat) {
      sessionStorage.setItem("active_chat", JSON.stringify(activeChat));
    }
  }, [activeChat]);

  // WebSocket handling
  const { sendMessage } = useWebSocketChat({
    userId: auth.user?.id,
    activeChat,
    setActiveChat,
    setMessages,
    messages
  });

  // Fetch user list
  useEffect(() => {
    if (!auth.user?.id) return;
    getUsers(auth.user.id)
      .then(({ data }) => setMessages(data || []))
      .catch(err => console.error("Error fetching users:", err));
  }, [auth.user]);

  return (
    <ChatCtx.Provider
      value={{
        rooms,
        setRooms,
        messages,
        setMessages,
        activeChat,
        setActiveChat,
        sendMessage,
      }}
    >
      {children}
    </ChatCtx.Provider>
  );
}

export { ChatCtx };
