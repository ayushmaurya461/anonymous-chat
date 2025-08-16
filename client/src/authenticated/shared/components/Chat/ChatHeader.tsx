import { User, X } from "lucide-react";
import type { Chat } from "../../../../models/messages";

export const ChatHeader = ({
  chat,
  onClose,
}: {
  chat: Chat | null;
  onClose: () => void;
}) => (
  <header
    className="absolute top-0 left-0 right-0 flex justify-between items-center 
    bg-gradient-to-r from-teal-600 to-teal-700 py-4 px-6 shadow-lg z-20 border-b border-teal-500/30"
  >
    <div className="flex items-center space-x-3">
      <div
        className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl 
        flex items-center justify-center shadow-lg"
      >
        <User className="w-5 h-5 text-teal-900" />
      </div>
      <div>
        <span className="font-bold text-lg text-white">{chat?.name}</span>
        <p className="text-teal-100 text-xs">Online</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-2 rounded-xl hover:bg-teal-500/50 transition"
    >
      <X className="w-5 h-5 text-teal-100" />
    </button>
  </header>
);
