import { Globe } from "lucide-react";

export const RoomsHeader = () => (
  <div className="bg-teal-600 text-white">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        <Globe className="w-10 h-10" />
        Explore Rooms
      </h1>
      <p className="text-teal-100 text-lg max-w-2xl">
        Discover conversations that matter to you. Join anonymous discussions,
        share your opinions, and connect with like-minded people in a safe,
        temporary environment.
      </p>
    </div>
  </div>
);