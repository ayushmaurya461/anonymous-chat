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

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden">
      {/* Background decorative elements */}
      {/* <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-white rounded-full blur-md"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div> */}

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          ></div>
        ))}
      </div>

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
