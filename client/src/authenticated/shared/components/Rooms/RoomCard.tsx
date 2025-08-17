import { ArrowRight } from "lucide-react";
import type { Room } from "../../../../models/messages";
import { useState } from "react";
import { Detailscard } from "../DetailsCard";
import { joinRoom } from "../../../../api/rooms";
import { useAuth } from "../../../../hooks/use-auth";

interface RoomCardProps {
  room: Room;
}
export const RoomCard = ({ room }: RoomCardProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { user } = useAuth();

  const joinelectedRoom = async () => {
    try {
      await joinRoom(room?.id as string, user?.id as string);
      setShowDetails(false);
    } catch (err) {
      console.error("join error:", err);
    }
  };
  return (
    <>
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {room.name}
              </h3>
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
          <button className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            <span>Join Room</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showDetails && (
        <Detailscard
          details={room}
          setShowJoinPopup={setShowDetails}
          joinelectedRoom={joinelectedRoom}
        />
      )}
    </>
  );
};
