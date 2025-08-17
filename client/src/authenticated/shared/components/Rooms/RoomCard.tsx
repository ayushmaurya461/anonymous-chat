import { Users, Star, Eye, ArrowRight } from "lucide-react";

interface Room {
  id: number;
  name: string;
  description: string;
  category: string;
  participants: number;
  isActive: boolean;
  rating: number;
  tags: string[];
}

interface RoomCardProps {
  room: Room;
}
export const RoomCard = ({ room }: RoomCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              room.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                room.isActive ? "bg-green-400" : "bg-gray-400"
              }`}
            />
            {room.isActive ? "Active" : "Quiet"}
          </div>
        </div>
        <p className="text-gray-600 mb-3">{room.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{room.participants} active</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{room.rating}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>{room.category}</span>
        </div>
      </div>

      <button className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
        <span>Join Room</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);
