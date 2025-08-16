import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { X, Send, Smile, User } from "lucide-react";

import { useChat } from "../../hooks/use-chat";
import { getMessages } from "../../api/messages";
import { useAuth } from "../../hooks/use-auth";
import type { Chat, ReceivedMessage } from "../../models/messages";

export const ChatWindow = () => {
  const { activeChat, sendMessage, setActiveChat } = useChat();
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  useEffect(() => {
    if (activeChat?.unread && activeChat.unread > 0) {
      setActiveChat((prev: Chat | null) =>
        prev ? { ...prev, unread: 0 } : null
      );
    }
  }, [activeChat?.id, activeChat?.unread, setActiveChat]);

  useEffect(() => {
    if (!activeChat) {
      if (!sessionStorage.getItem("active_chat")) {
        navigate("/");
      }
      return;
    }

    getMessages(
      activeChat.type,
      activeChat.id as string,
      user?.id as string
    ).then(({ data }) => {
      if (JSON.stringify(data) !== JSON.stringify(activeChat.messages)) {
        setActiveChat((prev) => (prev ? { ...prev, messages: data } : null));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.id, activeChat?.type, user?.id, navigate, setActiveChat]);

  const addEmoji = (emoji: { native: string }) => {
    setInput((prev) => prev + emoji.native);
    setShowPicker(false);
  };

  function navigateToHome() {
    setActiveChat(null);
    sessionStorage.removeItem("active_chat");
    navigate("/home");
  }

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden relative bg-gradient-to-br from-teal-50 via-teal-100 to-green-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-40 h-40 bg-teal-300 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-32 h-32 bg-green-300 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-400 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center bg-gradient-to-r from-teal-600 to-teal-700 py-4 px-6 shadow-lg z-20 backdrop-blur-sm border-b border-teal-500 border-opacity-30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-teal-900" />
          </div>
          <div>
            <span className="font-bold text-lg text-white drop-shadow-sm">{activeChat?.name}</span>
            <p className="text-teal-100 text-xs">Online</p>
          </div>
        </div>
        <button
          className="hover:bg-teal-500 hover:bg-opacity-50 rounded-xl transition-all duration-200 p-2 group"
          onClick={navigateToHome}
        >
          <X className="w-5 h-5 text-teal-100 group-hover:text-white transition-colors duration-200" />
        </button>
      </header>

      {/* Messages Area */}
      <main
        ref={messagesContainerRef}
        className="absolute top-16 bottom-16 left-0 right-0 overflow-auto p-4 bg-gradient-to-b from-transparent to-teal-50 to-opacity-50"
        style={{ 
          backgroundImage: "url(images/chat.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="space-y-4 max-w-4xl mx-auto">
          {activeChat?.messages?.map((m: ReceivedMessage, index: number) => (
            <div 
              key={m?.id ?? index} 
              className={`flex w-full animate-fadeInUp`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              {activeChat?.id !== m.sender_id ? (
                // Sent message (right side)
                <div className="ml-auto flex flex-col items-end max-w-xs sm:max-w-md lg:max-w-lg">
                  <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 rounded-2xl rounded-tr-sm text-white shadow-lg backdrop-blur-sm border border-teal-500 border-opacity-30 transform hover:scale-105 transition-all duration-200 animate-slideInRight">
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                  <span className="text-xs text-teal-800 bg-white bg-opacity-80 px-2 py-1 rounded-full mt-1 shadow-sm font-medium">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : (
                // Received message (left side)
                <div className="mr-auto flex flex-col items-start max-w-xs sm:max-w-md lg:max-w-lg">
                  <div className="bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-2xl rounded-tl-sm text-teal-800 shadow-lg border border-white border-opacity-50 transform hover:scale-105 transition-all duration-200 animate-slideInLeft">
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                  <span className="text-xs text-teal-800 bg-white bg-opacity-80 px-2 py-1 rounded-full mt-1 shadow-sm font-medium">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          ))}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer Input Area */}
      <footer className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-md p-4 shadow-lg border-t border-white border-opacity-50 z-20">
        <div className="flex items-center gap-3 relative max-w-none">
          {/* Emoji Picker */}
          {showPicker && (
            <div className="absolute bottom-16 left-0 z-30 animate-slideUp">
              <div className="bg-white rounded-xl shadow-2xl border border-teal-200">
                <Picker data={data} onEmojiSelect={addEmoji} />
              </div>
            </div>
          )}

          {/* Emoji Button */}
          <button 
            className="flex-shrink-0 p-3 text-teal-600 hover:bg-teal-100 rounded-xl transition-all duration-200 hover:scale-110 group"
            onClick={() => setShowPicker((v) => !v)}
          >
            <Smile className="w-5 h-5 group-hover:text-teal-700 transition-colors duration-200" />
          </button>

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full p-3 rounded-2xl bg-teal-50 border-2 border-teal-200 focus:border-teal-400 focus:outline-none resize-none transition-all duration-200 text-teal-800 placeholder-teal-500 font-medium shadow-inner hover:bg-teal-100 focus:bg-white focus:shadow-lg"
              style={{ maxHeight: '120px', minHeight: '48px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`flex-shrink-0 p-3 mb-2 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              input.trim() 
                ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-500 hover:to-teal-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};