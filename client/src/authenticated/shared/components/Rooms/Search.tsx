import { ArrowRight, MessageCircle, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import type { Room } from "../../../../models/messages";
import { joinRoom, searchRooms } from "../../../../api/rooms";
import { debounce } from "../../../../utils/functions";
import { Button } from "../Button";
import { useAuth } from "../../../../hooks/use-auth";

const debouncedSearch = debounce(searchRooms, 500);

export const SearchBar = () => {
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showJoinPopup, setShowJoinPopup] = useState<Room | null>(null);
  const { user } = useAuth();

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length === 0) {
      setSearchResults([]);
      setShowSearchPopup(false);
      return;
    }

    try {
      const { data } = await debouncedSearch(value);
      setSearchResults(data);
      setShowSearchPopup(true);
    } catch (err) {
      console.error("search error:", err);
    }
  };

  const closeSearchPopup = () => {
    setShowSearchPopup(false);
  };

  const handleRoomSelect = (room: Room) => {
    setShowJoinPopup(room);
  };

  const joinelectedRoom = async () => {
    try {
      await joinRoom(showJoinPopup?.id as string, user?.id as string);
      setShowJoinPopup(null);
      setSearchResults([]);
      setSearchTerm("");
      setShowSearchPopup(false);
    } catch (err) {
      console.error("join error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for rooms, topics, or discussions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
          />

          {/* Search Results Popup */}
          {showSearchPopup && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-opacity-20 z-40"
                onClick={closeSearchPopup}
              />

              {/* Popup */}
              <div className="absolute top-full left-0 right-0 mt-2 backdrop bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Search Results ({searchResults.length})
                    </h3>
                    <button
                      onClick={closeSearchPopup}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className="w-full text-left p-4 hover:bg-gray-200 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-start justify-between ">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-800">
                                {room.name}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {room.description}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 mt-1 hover:scale-150 hover:text-gray-600 transition-all scroll-smooth flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-600 mb-1">
                      No rooms found
                    </h4>
                    <p className="text-sm text-gray-500">
                      Try searching with different keywords or browse categories
                      below
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showJoinPopup && (
        <div className="absolute backdrop-blur-sm backdrop-brightness-75  flex justify-center items-center top-0 right-0 z-50 w-full h-full">
          <div className="p-4 bg-white shadow-2xl rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-center text-teal-700">
              {showJoinPopup.name}
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              {showJoinPopup.description}
            </p>
            <div className="flex gap-3">
              <Button variant="themed" onClick={joinelectedRoom}>
                <Plus /> Join Group
              </Button>
              <Button variant="black" onClick={() => setShowJoinPopup(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
