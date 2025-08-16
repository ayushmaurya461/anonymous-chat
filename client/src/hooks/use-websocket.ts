import { useEffect, useRef } from "react";
import { filterChats } from "../utils/chat";
import type { Chat, Messages, ReceivedMessage } from "../models/messages";

export function useWebSocketChat({
  userId,
  activeChat,
  setActiveChat,
  setMessages,
  messages
}: {
  userId?: string;
  activeChat: Chat | null;
  setActiveChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
  messages: Messages[];
}) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(`ws://localhost:8080/ws?user_id=${userId}`);

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: "join",
        content: "",
        sender_id: userId,
        receiver_id: "",
        room_id: "",
        timestamp: Date.now(),
      }));
    };

    ws.current.onmessage = (event) => {
      const message: ReceivedMessage = JSON.parse(event.data);
      filterChats({ message, activeChat, setActiveChat, setMessages, messages });
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, [userId, activeChat, setActiveChat, setMessages]);

  const sendMessage = (content: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    ws.current.send(JSON.stringify({
      type: "message",
      content,
      timestamp: Date.now(),
      receiver_id: activeChat?.id,
      sender_id: userId,
    }));
  };

  return { sendMessage };
}
