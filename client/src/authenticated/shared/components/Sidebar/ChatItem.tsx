import { User, Edit3, Trash2 } from "lucide-react";
import type { Messages } from "../../../../models/messages";

type Props = {
  chat: Messages;
  active: boolean;
  onClick: () => void;
  index: number;
};

export const ChatItem = ({ chat, active, onClick, index }: Props) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-teal-600 hover:bg-opacity-40 hover:shadow-lg transform hover:-translate-y-0.5
      ${active ? "bg-teal-500 bg-opacity-40 shadow-lg" : ""}`}
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg border border-teal-300">
        <User className="w-5 h-5 text-teal-900" />
      </div>
      {chat.online && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-teal-700 rounded-full animate-pulse" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-teal-100 text-sm font-medium truncate">{chat.name}</span>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-teal-200 text-xs">{chat.time}</span>
          {chat.unread > 0 && (
            <div className="bg-orange-400 text-orange-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              {chat.unread}
            </div>
          )}
        </div>
      </div>
      <p className="text-teal-200 text-xs truncate">{chat.lastMessage}</p>
    </div>
    <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
      <button className="p-1.5 rounded-lg hover:bg-teal-500">
        <Edit3 className="w-4 h-4 text-teal-200" />
      </button>
      <button className="p-1.5 rounded-lg hover:bg-red-500 hover:bg-opacity-40 hover:text-red-200">
        <Trash2 className="w-4 h-4 text-teal-200" />
      </button>
    </div>
  </div>
);
