import { Plus } from "lucide-react";
import type { Room } from "../../../models/messages";
import { Button } from "./Button";

interface DetailsCardProps {
  details: Room | null;
  joinelectedRoom: () => Promise<void>;
  setShowJoinPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Detailscard = ({
  details,
  joinelectedRoom,
  setShowJoinPopup,
}: DetailsCardProps) => {
  return (
    <div className="absolute backdrop-blur-sm backdrop-brightness-75  flex justify-center items-center top-0 right-0 z-50 w-full h-full">
      <div className="p-4 bg-white shadow-2xl rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-teal-700">
          {details?.name}
        </h2>
        <p className="text-gray-600 mb-4 text-center">{details?.description}</p>
        <div className="flex gap-3">
          <Button variant="themed" onClick={joinelectedRoom}>
            <Plus /> Join Group
          </Button>
          <Button variant="black" onClick={() => setShowJoinPopup(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
