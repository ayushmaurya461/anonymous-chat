import { Coffee } from "lucide-react";
import { CreateRoom } from "../../CreateRoom";
import { useState } from "react";
import { Button } from "../Button";

export const BottomCTA = () => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  return (
    <>
      <div className="mt-16 bg-teal-600 rounded-2xl p-8 text-white text-center">
        <Coffee className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">
          Can't Find What You're Looking For?
        </h3>
        <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
          Create your own anonymous room and start conversations that matter.
          All chats are automatically deleted after 24 hours for complete
          privacy.
        </p>
        <div className="flex justify-center">
          <Button
            variant="themed"
            onClick={() => setShowCreateRoom(true)}
            className="mb-4"
          >
            Create New Room
          </Button>
        </div>
      </div>

      {showCreateRoom && (
        <CreateRoom closeDialog={() => setShowCreateRoom(false)} />
      )}
    </>
  );
};
