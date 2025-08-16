import {
  ChevronDown,
  // Hash,
  // MessageCirclePlus,
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
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../hooks/use-chat";
import { useAuth } from "../../hooks/use-auth";
import type { Room, Messages } from "../../models/messages";
import { markAsRead } from "../../api/messages";

export const Sidebar = () => {
  const [expandedChats, setExpandedChats] = useState(true);
  const [expandedRooms, setExpandedRooms] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    rooms,
    messages: directChats,
    setActiveChat,
    activeChat,
    setMessages: updateMessages,
  } = useChat();

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [rooms, searchQuery]
  );

  const filteredChats = useMemo(
    () =>
      directChats.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [directChats, searchQuery]
  );

  const toggleSection = useCallback((section: "rooms" | "chats") => {
    if (section === "rooms") setExpandedRooms((prev) => !prev);
    if (section === "chats") setExpandedChats((prev) => !prev);
  }, []);

  const navigateTo = useCallback(
    (chat: Room | Messages) => {
      if (activeChat?.id === chat.id) return;

      sessionStorage.removeItem("active_chat");
      sessionStorage.setItem(
        "active_chat",
        JSON.stringify({ ...chat, unread: 0 })
      );

      if (chat?.type === "user") {
        markAsRead(user?.id as string);
        setActiveChat({ ...chat, unread: 0 });
        updateMessages((prev) =>
          prev.map((m) => (m.id === chat.id ? { ...m, unread: 0 } : m))
        );
      } else {
        setActiveChat({ ...chat, unread: 0 });
      }
      navigate("/chat");
    },
    [activeChat, navigate, setActiveChat, updateMessages, user?.id]
  );

  const SectionHeader = ({
    title,
    icon: Icon,
    expanded,
    onToggle,
    count,
  }: {
    title: string;
    icon: React.ElementType;
    expanded: boolean;
    onToggle: () => void;
    count?: number;
  }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between cursor-pointer text-teal-100 mb-4 p-3 rounded-xl hover:bg-teal-600 hover:bg-opacity-40 transition-all duration-200 group"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-teal-600 bg-opacity-50 group-hover:bg-teal-500 group-hover:bg-opacity-60 transition-all duration-200">
          <Icon className="w-4 h-4 text-teal-100" />
        </div>
        <span className="font-semibold text-sm text-teal-100">{title}</span>
        {count && count > 0 && (
          <span className="bg-orange-400 text-orange-900 text-xs px-2 py-0.5 rounded-full font-bold">
            {count}
          </span>
        )}
      </div>
      <div
        className={`transform transition-transform duration-200 ${
          expanded ? "rotate-0" : "-rotate-90"
        }`}
      >
        <ChevronDown className="w-4 h-4 text-teal-200" />
      </div>
    </button>
  );

  const totalUnreadRooms = filteredRooms.reduce(
    (sum, room) => sum + (room.unread || 0),
    0
  );
  const totalUnreadChats = filteredChats.reduce(
    (sum, chat) => sum + (chat.unread || 0),
    0
  );

  return (
    <section className="flex flex-col h-full bg-gradient-to-br from-teal-800 via-teal-700 to-teal-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-4 w-32 h-32 bg-teal-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-4 w-24 h-24 bg-teal-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-teal-200 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex gap-3 mb-6 items-center p-6 pb-4">
          <div className="bg-teal-600 bg-opacity-60 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-teal-500 border-opacity-30">
            <MessageSquareX className="text-teal-100 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-teal-100 drop-shadow-sm">
              AnonChat
            </h3>
            <p className="text-sm text-teal-200">Anonymous Chat</p>
          </div>
        </header>

        {/* Search */}
        <div className="px-6 mb-6">
          <div
            className={`relative transition-all duration-300 ${
              searchFocused ? "transform scale-105" : ""
            }`}
          >
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                searchFocused ? "text-teal-700" : "text-teal-600"
              }`}
            />
            <input
              type="text"
              placeholder="Search rooms or chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-12 pr-4 py-3 bg-teal-50 backdrop-blur-sm rounded-xl border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 placeholder-teal-500 text-teal-800 font-medium"
            />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6">
          {/* Rooms Section */}
          <div>
            <SectionHeader
              title="Rooms"
              icon={Users}
              expanded={expandedRooms}
              onToggle={() => toggleSection("rooms")}
              count={totalUnreadRooms}
            />
            <div
              className={`transition-all duration-300 overflow-hidden ${
                expandedRooms ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {filteredRooms.length ? (
                <div className="space-y-2">
                  {filteredRooms.map((room, index) => (
                    <div
                      key={room.id}
                      onClick={() => navigateTo(room)}
                      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-teal-600 hover:bg-opacity-40 hover:shadow-lg transform hover:-translate-y-0.5 ${
                        activeChat?.id === room.id
                          ? "bg-teal-500 bg-opacity-40 shadow-lg"
                          : "hover:bg-teal-600"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0">
                        {room.isPrivate ? (
                          <div className="p-2 rounded-lg bg-amber-500 bg-opacity-30 border border-amber-400 border-opacity-40">
                            <Lock className="w-4 h-4 text-amber-200" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-emerald-500 bg-opacity-30 border border-emerald-400 border-opacity-40">
                            <Globe className="w-4 h-4 text-emerald-200" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-teal-100 text-sm font-medium truncate">
                            {room.name}
                          </span>
                          {room.unread > 0 && (
                            <div className="flex-shrink-0 bg-orange-400 text-orange-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                              {room.unread}
                            </div>
                          )}
                        </div>
                        <p className="text-teal-200 text-xs">
                          {room.members} members online
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 rounded-lg hover:bg-teal-500 hover:bg-opacity-50 transition-all duration-200">
                          <Settings className="w-4 h-4 text-teal-200" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-teal-600 bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center border border-teal-500 border-opacity-30">
                  <div className="text-teal-100 text-sm mb-4 font-medium">
                    No rooms found.
                  </div>
                  {/* <div className="flex gap-3">
                    <button className="flex-1 bg-teal-500 hover:bg-teal-400 text-teal-900 flex items-center justify-center gap-2 rounded-xl p-3 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
                      <MessageCirclePlus size={18} />
                      <span className="text-sm">Join</span>
                    </button>
                    <button className="flex-1 bg-teal-600 hover:bg-teal-500 text-teal-100 flex items-center justify-center gap-2 rounded-xl p-3 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
                      <Hash size={18} />
                      <span className="text-sm">Create</span>
                    </button>
                  </div> */}
                </div>
              )}
            </div>
          </div>

          {/* Direct Messages Section */}
          <div>
            <SectionHeader
              title="Direct Messages"
              icon={MessageCircle}
              expanded={expandedChats}
              onToggle={() => toggleSection("chats")}
              count={totalUnreadChats}
            />
            <div
              className={`transition-all duration-300 overflow-hidden ${
                expandedChats ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {filteredChats.length ? (
                <div className="space-y-2">
                  {filteredChats.map((chat, index) => (
                    <div
                      key={chat.id}
                      onClick={() => navigateTo(chat)}
                      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-teal-600 hover:bg-opacity-40 hover:shadow-lg transform hover:-translate-y-0.5 ${
                        activeChat?.id === chat.id
                          ? "bg-teal-500 bg-opacity-40 shadow-lg"
                          : ""
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg border border-teal-300 border-opacity-40">
                          <User className="w-5 h-5 text-teal-900" />
                        </div>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-teal-700 rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-teal-100 text-sm font-medium truncate">
                            {chat.name}
                          </span>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <span className="text-teal-200 text-xs">
                              {chat.time}
                            </span>
                            {chat.unread > 0 && (
                              <div className="bg-orange-400 text-orange-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                {chat.unread}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-teal-200 text-xs truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity duration-200">
                        <button className="p-1.5 rounded-lg hover:bg-teal-500 hover:bg-opacity-50 transition-all duration-200">
                          <Edit3 className="w-4 h-4 text-teal-200" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-500 hover:bg-opacity-40 transition-all duration-200 hover:text-red-200">
                          <Trash2 className="w-4 h-4 text-teal-200" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-teal-600 bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center border border-teal-500 border-opacity-30">
                  <div className="text-teal-100 text-sm font-medium">
                    No chats found.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer User Info */}
        <div className="p-6 pt-4 border-t border-teal-600 border-opacity-40">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-teal-600 bg-opacity-30 backdrop-blur-sm hover:bg-opacity-40 transition-all duration-200 cursor-pointer group border border-teal-500 border-opacity-30">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:shadow-xl transition-all duration-200 border border-teal-300 border-opacity-40">
              <User className="w-6 h-6 text-teal-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-teal-100 font-semibold text-sm truncate">
                {user?.name}
              </p>
              <p className="text-teal-200 text-xs">Online</p>
            </div>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
};
