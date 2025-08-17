import  { useState } from "react";
import {
  Clock,
  Shield,
  MessageCircle,
  Globe,
  Heart,
  Gamepad2,
  BookOpen,
  Music,
  Code,
} from "lucide-react";
import { BottomCTA } from "../shared/components/Rooms/BottomCTA";
import { CategoriesSidebar } from "../shared/components/Rooms/Categories";
import { FeaturesGrid } from "../shared/components/Rooms/FeaturesGrid";
import { RoomsGrid } from "../shared/components/Rooms/RoomGrid";
import { RoomsHeader } from "../shared/components/Rooms/RoomRenderer";
import { SearchBar } from "../shared/components/Rooms/Search";


export const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", icon: Globe, count: 47 },
    { name: "General Chat", icon: MessageCircle, count: 12 },
    { name: "Gaming", icon: Gamepad2, count: 8 },
    { name: "Study & Learning", icon: BookOpen, count: 6 },
    { name: "Music & Arts", icon: Music, count: 7 },
    { name: "Technology", icon: Code, count: 9 },
    { name: "Support & Wellness", icon: Heart, count: 5 },
  ];

  const rooms = [
    { id: 1, name: "Late Night Thoughts", description: "Share your deepest thoughts when the world sleeps", category: "General Chat", participants: 23, isActive: true, rating: 4.8, tags: ["deep talks", "philosophy", "midnight"] },
    { id: 2, name: "Gaming Squad", description: "Find teammates and discuss the latest games", category: "Gaming", participants: 45, isActive: true, rating: 4.6, tags: ["multiplayer", "strategy", "fun"] },
    { id: 3, name: "Study Together", description: "Motivate each other and share study tips", category: "Study & Learning", participants: 18, isActive: true, rating: 4.9, tags: ["productivity", "motivation", "academic"] },
    { id: 4, name: "Anonymous Confessions", description: "Share what you can't tell anyone else", category: "Support & Wellness", participants: 67, isActive: true, rating: 4.7, tags: ["confessions", "support", "healing"] },
    { id: 5, name: "Code & Coffee", description: "Debug together and share programming wisdom", category: "Technology", participants: 31, isActive: true, rating: 4.5, tags: ["programming", "debugging", "career"] },
    { id: 6, name: "Music Discovery", description: "Share tracks and discover new artists anonymously", category: "Music & Arts", participants: 29, isActive: false, rating: 4.4, tags: ["indie", "discovery", "vibes"] },
  ];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || room.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const features = [
    { icon: Shield, title: "Complete Anonymity", description: "Share your thoughts without revealing your identity" },
    { icon: Clock, title: "24-Hour Auto-Delete", description: "All conversations are automatically deleted after 24 hours" },
    { icon: MessageCircle, title: "Opinion Freedom", description: "Express yourself freely in a judgment-free environment" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <RoomsHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FeaturesGrid features={features} />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CategoriesSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          <div className="lg:col-span-3">
            <RoomsGrid rooms={filteredRooms} selectedCategory={selectedCategory} />
          </div>
        </div>

        <BottomCTA />
      </div>
    </div>
  );
};
