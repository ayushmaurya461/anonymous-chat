import { MessageCircle } from "lucide-react";
import { RoomCard } from "./RoomCard";

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

export const RoomsGrid = ({ rooms, selectedCategory }: { rooms: Room[]; selectedCategory: string }) => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-800">
        {selectedCategory === "All" ? "All Rooms" : selectedCategory}
      </h2>
      <span className="text-gray-500">
        {rooms.length} room{rooms.length !== 1 ? "s" : ""} found
      </span>
    </div>

    {rooms.length > 0 ? (
      <div className="grid gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No rooms found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or browse different categories
        </p>
      </div>
    )}
  </>
);
