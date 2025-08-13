import {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/use-auth";
import { getUsers } from "../api/users";
import type { Room, Messages, Chat, ChatContextType } from "../models/messages";

const ChatCtx = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user?.id) return;

    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(
      `ws://localhost:8080/ws?user_id=${auth.user?.id}`
    );

    ws.current.onopen = () => {
      const handshake = {
        type: "join",
        content: "",
        sender_id: auth.user?.id,
        receiver_id: "",
        room_id: "",
        timestamp: Date.now(),
      };

      ws.current?.send(JSON.stringify(handshake));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "message") {
        setActiveChat((prev) =>
          prev
            ? { ...prev, messages: [...(prev.messages || []), message] }
            : prev
        );
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [auth.user?.id]);

  useEffect(() => {
    if (!auth.user?.id) return;

    const fetchUsers = async () => {
      try {
        const { data } = await getUsers(auth?.user?.id as string);
        if (data?.length) {
          setMessages(data);
        } else {
          console.log("No users found");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [auth.user]);

  const sendMessage = (content: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const message = {
      type: "message",
      content,
      timstamp: Date.now(),
      receiver_id: activeChat?.id,
      sender_id: auth.user?.id,
    };

    ws.current.send(JSON.stringify(message));
  };

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
