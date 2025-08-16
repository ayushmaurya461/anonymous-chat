export type ReceivedMessage = {
  content: string;
  created_at: string;
  id: string;
  receiver_id: string;
  sender_id: string;
  type: string;
};


export type Chat = {
  id: string | undefined;
  name: string;
  unread: number;
  type: string;
  messages: ReceivedMessage[];
};

export type Room = Chat & {
  members: number;
  isPrivate: boolean;
};

export type Messages = Chat & {
  time: string;
  online: boolean;
  lastMessage: string;
};

export type ChatContextType = {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  messages: Messages[];
  sendMessage: (content: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
  activeChat: Chat | null;
  setActiveChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};
