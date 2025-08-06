import { useContext } from "react";
import { ChatCtx } from "../context/ChatContext";

export function useChat() {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
