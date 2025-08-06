import { createContext, useState, type ReactNode } from "react";

type Chat = {
  id: string | number;
  name: string;
  unread: number;
};

export type Room = Chat & {
  members: number;
  isPrivate: boolean;
};

export type DirectChat = Chat & {
  time: string;
  online: boolean;
  lastMessage: string;
};

type ChatContextType = {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  directs: DirectChat[];
  setDirects: React.Dispatch<React.SetStateAction<DirectChat[]>>;
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
};

const ChatCtx = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [directs, setDirects] = useState<DirectChat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  
  return (
    <ChatCtx.Provider
      value={{
        rooms,
        setRooms,
        directs,
        setDirects,
        activeChat,
        setActiveChat,
      }}
    >
      {children}
    </ChatCtx.Provider>
  );
}

export { ChatCtx };