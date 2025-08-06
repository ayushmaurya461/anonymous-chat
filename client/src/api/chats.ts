import { useEffect } from "react";
import { type DirectChat, type Room } from "../context/ChatContext";
// import { useNavigate } from "react-router-dom";
import { useChat } from "../hooks/use-chat";

export const useChatSocket = () => {
  const { setDirects, setRooms } = useChat();
  // const navigate = useNavigate();
  // const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // let shouldReconnect = true;
    // let retries = 0;
    console.log("Connect called");

    function connect() {
      setDirects(directChats);
      setRooms(rooms);

      //   const socket = new WebSocket("ws://localhost:4000/ws");
      //   socket.onopen = () => {
      //     console.log("Socket Connected");
      //   };
      //   socket.onmessage = (event) => {
      //     const data = JSON.parse(event.data);
      //     switch (data.type) {
      //       case "directs":
      //         setDirects(data.payload);
      //         break;
      //       case "rooms":
      //         setRooms((prev) =>
      //           prev.map((chat) =>
      //             chat.id === data.payload.id
      //               ? { ...chat, ...data.payload }
      //               : chat
      //           )
      //         );
      //         break;
      //     }
      //   };
      //   socket.onclose = (event) => {
      //     if (event.code === 1008 || event.code === 1003) {
      //       alert(
      //         "This room has expired or doesn't exist. Redirecting to room list..."
      //       );
      //       navigate("/rooms");
      //       return;
      //     }
      //     if (shouldReconnect && retries < 5) {
      //       retries += 1;
      //       setTimeout(connect, 500 * retries); // simple back-off
      //     }
      //   };
      //   socket.onerror = () => {
      //     socket.close();
      //     navigate("/rooms");
      //   };
    }

    connect();
  });
};

const rooms: Room[] = [
  {
    id: 1,
    name: "General Discussion",
    members: 127,
    isPrivate: false,
    unread: 3,
  },
  {
    id: 2,
    name: "Tech Talk",
    members: 89,
    isPrivate: false,
    unread: 0,
  },
  {
    id: 3,
    name: "Random Chat",
    members: 234,
    isPrivate: false,
    unread: 12,
  },
  {
    id: 4,
    name: "Secret Club",
    members: 15,
    isPrivate: true,
    unread: 1,
  },
  {
    id: 5,
    name: "Gaming Hub",
    members: 156,
    isPrivate: false,
    unread: 0,
  },
];

const directChats: DirectChat[] = [
  {
    id: 1,
    name: "Anonymous User #1234",
    lastMessage: "Hey there!",
    time: "2m",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Ghost Rider",
    lastMessage: "See you tomorrow",
    time: "1h",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Night Owl",
    lastMessage: "Thanks for the help",
    time: "3h",
    unread: 1,
    online: true,
  },
  {
    id: 4,
    name: "Code Ninja",
    lastMessage: "Check this out...",
    time: "1d",
    unread: 0,
    online: false,
  },
];
