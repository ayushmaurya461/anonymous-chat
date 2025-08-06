import {
  ChevronDown,
  ChevronRight,
  Hash,
  MessageCirclePlus,
  MessageSquareX,
  Search,
  Users,
  Lock,
  Globe,
  Settings,
  User,
  Edit3,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type DirectChat, type Room } from "../../context/ChatContext";
import { useChatSocket } from "../../api/chats";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../hooks/use-chat";
import { useAuth } from "../../hooks/use-auth";

export const Sidebar = () => {
  const [expandedChats, setExpandedChats] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { rooms, directs: directChats, setActiveChat, activeChat } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();

  useChatSocket();
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = directChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (section: "rooms" | "chats") => {
    if (section === "rooms") setExpandedRooms(!expandedRooms);
    if (section === "chats") setExpandedChats(!expandedChats);
  };

  const navigateTo = (chat: Room | DirectChat) => {
    setActiveChat(chat);
    navigate("/chat");
  };

  useEffect(() => {
    console.log(activeChat);
  });

  return (
    <>
      <section className="py-8 px-3 bg-teal-800 h-full">
        <header className="flex gap-2 mb-2 items-center">
          <a className="bg-teal-600 rounded-xl p-3">
            <MessageSquareX className="text-white" />
          </a>
          <div>
            <h3 className="font-extrabold text-md text-teal-400 ">AnonChat</h3>
            <p className="text-sm text-white">Anonymous Chat</p>
          </div>
        </header>
        <div className="relative">
          <Search className="absolute left-3 top-7 transform -translate-y-1/2 w-4 h-4" />
          <input
            type="text"
            name="search"
            id="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms or chat"
            className="w-full pl-12 mt-2 p-2 bg-teal-200 rounded-xl"
          />
        </div>
        <hr className="text-teal-700 my-2" />
        <div className="flex gap-2 justify-around">
          <button className="bg-teal-950 text-white w-1/2 cursor-pointer flex items-center justify-center gap-2 rounded-xl p-2 px-3">
            <MessageCirclePlus height={20} width={20} />
            Join Room
          </button>
          <button className="bg-teal-900 text-white w-1/2 cursor-pointer flex items-center justify-center gap-2 rounded-xl p-2 px-3">
            <Hash height={20} width={20} /> Create
          </button>
        </div>

        <hr className="text-teal-700 my-2" />

        {/* Rooms Section */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("rooms")}
            className="w-full flex items-center justify-between text-white hover:text-white mb-3 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Rooms</span>
              <span className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-xs">
                {filteredRooms.length}
              </span>
            </div>
            {expandedRooms ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {expandedRooms && (
            <div className="space-y-1">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => navigateTo(room)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600 cursor-pointer group transition-colors"
                >
                  <div className="flex-shrink-0">
                    {room.isPrivate ? (
                      <Lock className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Globe className="w-4 h-4 text-teal-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm truncate">
                        {room.name}
                      </span>
                      {room.unread > 0 && (
                        <span className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {room.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-200 text-xs">
                      {room.members} members
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-white hover:text-white p-1">
                      <Settings className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Direct Chats Section */}
        <div className="p-4 border-t border-teal-700">
          <button
            onClick={() => toggleSection("chats")}
            className="w-full flex items-center justify-between text-white hover:text-white mb-3 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Direct Messages</span>
              <span className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-xs">
                {filteredChats.length}
              </span>
            </div>
            {expandedChats ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {expandedChats && (
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => navigateTo(chat)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600 cursor-pointer group transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm truncate">
                        {chat.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-200 text-xs">
                          {chat.time}
                        </span>
                        {chat.unread > 0 && (
                          <span className="bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-200 text-xs truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button className="text-white hover:text-white p-1">
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button className="text-white hover:text-red-400 p-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t absolute bottom-0 ">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-white text-xs">{user?.id}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
