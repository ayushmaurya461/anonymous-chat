import { useState } from "react";
import {
  Search,
  Users,
  Plus,
  MessageCircle,
  Globe,
  Shield,
  Clock,
} from "lucide-react";
import { CreateRoom } from "../shared/CreateRoom";
import { Button } from "../shared/components/Button";
import { FeatureCard } from "../shared/components/Card";
import { ActionCard } from "../shared/components/ActionCard";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const navigate = useNavigate();

  const handleSearchUser = () => {
    if (searchQuery.trim()) {
      console.log("Searching for user:", searchQuery);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Stay Anonymous",
      description: "Chat freely without revealing your identity",
    },
    {
      icon: Clock,
      title: "24-Hour Rooms",
      description: "Fresh topics daily with temporary conversations",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with people from around the world",
    },
  ];

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      console.log("Joining room:", roomCode);
      // Add your join room logic here
    }
  };

  const handleCreateRoom = () => {
    setShowCreateRoom(true);
  };

  const handleRandomChat = () => {
    console.log("Starting random chat");
    // Add your random chat logic here
  };

  const closeDialog = () => {
    setShowCreateRoom(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-teal-50 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <MessageCircle className="w-16 h-16 text-teal-900" />
              </div>
            </div>
            <h1 className="text-6xl text-teal-900 font-bold  mb-4 drop-shadow-lg">
              AnonChat
            </h1>
            <p className="text-xl text-teal-800 text-opacity-90 mb-2">
              Connect, Chat, Stay Anonymous
            </p>
            <p className="text-lg text-teal-800 text-opacity-80 max-w-2xl mx-auto">
              Join conversations without revealing your identity. Create rooms,
              find friends, or chat with strangers in a safe, anonymous
              environment.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Search User */}
            <ActionCard
              icon={<Search className="w-6 h-6" />}
              title="Find Someone"
              description="Search for a specific user to start a conversation"
              placeholder="Enter username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              buttonText="Search"
              onButtonClick={handleSearchUser}
            />

            {/* Join Room */}
            <ActionCard
              icon={<Users className="w-6 h-6" />}
              title="Join a Room"
              description="Enter a room code to join an existing conversation"
              placeholder="Room code..."
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              buttonText="Join"
              onButtonClick={handleJoinRoom}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="black" onClick={handleCreateRoom}>
              <Plus className="w-5 h-5" />
              Create New Room
            </Button>
            <Button variant="themed" onClick={handleRandomChat}>
              <MessageCircle className="w-5 h-5" />
              Chat with Stranger
            </Button>
            <Button variant="themed" onClick={() => navigate("/rooms")}>
              <Users /> Explore Rooms
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className=" text-opacity-70 text-sm">
              Safe, secure, and completely anonymous conversations
            </p>
          </div>
        </div>
      </div>

      {showCreateRoom && <CreateRoom closeDialog={closeDialog} />}
    </div>
  );
};
