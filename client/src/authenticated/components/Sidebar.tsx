import { MessageSquareX, Search, Users, MessageCircle } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../hooks/use-chat";
import { useAuth } from "../../hooks/use-auth";
import type { Room, Messages } from "../../models/messages";
import { markAsRead } from "../../api/messages";
import { ChatItem } from "../shared/components/Sidebar/ChatItem";
import { EmptyState } from "../shared/components/Sidebar/EmptyState";
import { RoomItem } from "../shared/components/Sidebar/RootItem";
import { SectionHeader } from "../shared/components/Sidebar/SectionHeader";
import { UserFooter } from "../shared/components/Sidebar/UserFooter";

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
    setMessages,
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

  const toggleSection = (section: "rooms" | "chats") => {
    if (section === "rooms") {
      setExpandedRooms((p) => !p);
    } else {
      setExpandedChats((p) => !p);
    }
  };

  const navigateTo = useCallback(
    (chat: Room | Messages) => {
      if (activeChat?.id === chat.id) return;
      sessionStorage.setItem(
        "active_chat",
        JSON.stringify({ ...chat, unread: 0 })
      );

      if (chat.type === "user") {
        markAsRead(user?.id as string);
        setActiveChat({ ...chat, unread: 0 });
        setMessages((prev) =>
          prev.map((m) => (m.id === chat.id ? { ...m, unread: 0 } : m))
        );
      } else setActiveChat({ ...chat, unread: 0 });

      navigate("/chat");
    },
    [activeChat, navigate, setActiveChat, setMessages, user?.id]
  );

  const totalUnreadRooms = filteredRooms.reduce(
    (sum, r) => sum + (r.unread || 0),
    0
  );
  const totalUnreadChats = filteredChats.reduce(
    (sum, c) => sum + (c.unread || 0),
    0
  );

  return (
    <section className="flex flex-col h-full bg-gradient-to-br from-teal-800 via-teal-700 to-teal-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-4 w-32 h-32 bg-teal-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-4 w-24 h-24 bg-teal-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-teal-200 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header
          className="flex gap-3 mb-6 cursor-pointer items-center p-6 pb-4"
          onClick={() => navigate("/")}
        >
          <div className="bg-teal-600 bg-opacity-60 rounded-2xl p-3 shadow-lg border border-teal-500">
            <MessageSquareX className="text-teal-100 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-teal-100">AnonChat</h3>
            <p className="text-sm text-teal-200">Anonymous Chat</p>
          </div>
        </header>

        {/* Search */}
        <div className="px-6 mb-6">
          <div
            className={`relative transition-all duration-300 ${
              searchFocused ? "scale-105" : ""
            }`}
          >
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
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
              className="w-full pl-12 pr-4 py-3 bg-teal-50 rounded-xl border border-teal-300 focus:ring-2 focus:ring-teal-400 text-teal-800 font-medium"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6">
          {/* Rooms */}
          <div>
            <SectionHeader
              title="Rooms"
              icon={Users}
              expanded={expandedRooms}
              onToggle={() => toggleSection("rooms")}
              count={totalUnreadRooms}
            />
            <div
              className={`${
                expandedRooms ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              } transition-all`}
            >
              {filteredRooms.length ? (
                <div className="space-y-2">
                  {filteredRooms.map((room, i) => (
                    <RoomItem
                      key={room.id}
                      room={room}
                      active={activeChat?.id === room.id}
                      onClick={() => navigateTo(room)}
                      index={i}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No rooms found." />
              )}
            </div>
          </div>

          {/* Chats */}
          <div>
            <SectionHeader
              title="Direct Messages"
              icon={MessageCircle}
              expanded={expandedChats}
              onToggle={() => toggleSection("chats")}
              count={totalUnreadChats}
            />
            <div
              className={`${
                expandedChats ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              } transition-all`}
            >
              {filteredChats.length ? (
                <div className="space-y-2">
                  {filteredChats.map((chat, i) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      active={activeChat?.id === chat.id}
                      onClick={() => navigateTo(chat)}
                      index={i}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No chats found." />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <UserFooter />
      </div>
    </section>
  );
};
