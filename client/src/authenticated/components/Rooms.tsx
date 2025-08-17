import  { useState } from "react";
import {
  Clock,
  Shield,
  MessageCircle,
} from "lucide-react";
import { BottomCTA } from "../shared/components/Rooms/BottomCTA";
import { CategoriesSidebar } from "../shared/components/Rooms/Categories";
import { FeaturesGrid } from "../shared/components/Rooms/FeaturesGrid";
import { RoomsGrid } from "../shared/components/Rooms/RoomGrid";
import { RoomsHeader } from "../shared/components/Rooms/RoomRenderer";
import { SearchBar } from "../shared/components/Rooms/Search";
import { tags } from "../../utils/constants";


export const Rooms = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const features = [
    { icon: Shield, title: "Complete Anonymity", description: "Share your thoughts without revealing your identity" },
    { icon: Clock, title: "24-Hour Auto-Delete", description: "All conversations are automatically deleted after 24 hours" },
    { icon: MessageCircle, title: "Opinion Freedom", description: "Express yourself freely in a judgment-free environment" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <RoomsHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar/>
        <FeaturesGrid features={features} />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CategoriesSidebar
              categories={tags}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          <div className="lg:col-span-3">
            <RoomsGrid selectedCategory={selectedCategory} />
          </div>
        </div>

        <BottomCTA />
      </div>
    </div>
  );
};
