import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useChat } from "../../hooks/use-chat";
import { getMessages } from "../../api/messages";
import { useAuth } from "../../hooks/use-auth";
import type { Chat } from "../../models/messages";
import { BackgroundDecor } from "../shared/components/Chat/BackgroundDecor";
import { ChatHeader } from "../shared/components/Chat/ChatHeader";
import { MessageList } from "../shared/components/Chat/MessageList";
import { ChatInput } from "../shared/components/Chat/ChatInput";

export const ChatWindow = () => {
  const { activeChat, sendMessage, setActiveChat } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  useEffect(() => {
    if (activeChat?.unread) {
      setActiveChat((prev: Chat | null) =>
        prev ? { ...prev, unread: 0 } : null
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.id]);

  // fetch messages when chat changes
  useEffect(() => {
    if (!activeChat) {
      if (!sessionStorage.getItem("active_chat")) navigate("/");
      return;
    }

    getMessages(activeChat.type, activeChat.id!, user!.id).then(({ data }) => {
      if (JSON.stringify(data) !== JSON.stringify(activeChat.messages)) {
        setActiveChat((prev) => (prev ? { ...prev, messages: data } : null));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.id, activeChat?.type]);

  const navigateToHome = () => {
    setActiveChat(null);
    sessionStorage.removeItem("active_chat");
    navigate("/home");
  };

  return (
    <div className="w-full h-screen relative bg-gradient-to-br from-teal-50 via-teal-100 to-green-100">
      <BackgroundDecor />

      <ChatHeader chat={activeChat} onClose={navigateToHome} />

      <MessageList
        messages={activeChat?.messages ?? []}
        activeChatId={user?.id}
        messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
      />

      <ChatInput onSend={sendMessage} />
    </div>
  );
};
