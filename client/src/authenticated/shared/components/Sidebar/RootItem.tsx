import { Lock, Globe, Settings } from "lucide-react";
import type { Room } from "../../../../models/messages";

type Props = {
  room: Room;
  active: boolean;
  onClick: () => void;
  index: number;
};

export const RoomItem = ({ room, active, onClick, index }: Props) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-teal-600 hover:bg-opacity-40 hover:shadow-lg transform hover:-translate-y-0.5
      ${active ? "bg-teal-500 bg-opacity-40 shadow-lg" : ""}`}
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="flex-shrink-0">
      {room.isPrivate ? (
        <div className="p-2 rounded-lg bg-amber-500 bg-opacity-30 border border-amber-400">
          <Lock className="w-4 h-4 text-amber-200" />
        </div>
      ) : (
        <div className="p-2 rounded-lg bg-emerald-500 bg-opacity-30 border border-emerald-400">
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
          <div className="bg-orange-400 text-orange-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
            {room.unread}
          </div>
        )}
      </div>
      <p className="text-teal-200 text-xs">{room.members} members online</p>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-2 rounded-lg hover:bg-teal-500 hover:bg-opacity-50">
        <Settings className="w-4 h-4 text-teal-200" />
      </button>
    </div>
  </div>
);
