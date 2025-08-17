import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./components/Button";
import { createRoom } from "../../api/rooms";
import { useAuth } from "../../hooks/use-auth";
import { tags } from "../../utils/constants";

type Inputs = {
  name: string;
  description: string;
  tags: Set<string>;
};

export const CreateRoom = ({ closeDialog }: { closeDialog: () => void }) => {
  const { user } = useAuth();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const toggleTag = (tagId: string) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tagId)) {
      newSelectedTags.delete(tagId);
    } else {
      newSelectedTags.add(tagId);
    }
    setSelectedTags(newSelectedTags);
  };

  const submit = async (values: Inputs) => {
    try {
      const roomData = {
        ...values,
        tags: selectedTags,
      };

      await createRoom(
        roomData.name,
        roomData.description,
        user?.id as string,
        Array.from(selectedTags) 
      );
      closeDialog();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="backdrop-blur-xl backdrop-brightness-50 w-full h-screen absolute top-0 right-0 z-50 flex items-center justify-center">
      <div className="p-8 bg-white rounded-3xl shadow-lg w-2/6 fixed-width min-w-96">
        <form onSubmit={handleSubmit(submit)}>
          <h3 className="font-bold text-2xl text-center mb-6">Create Room</h3>

          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="font-bold text-sm mb-2">
              Name
            </label>
            <input
              className="border rounded-xl border-gray-400 p-3 px-4 text-center focus:border-blue-500 focus:outline-none transition-colors"
              type="text"
              id="name"
              placeholder="Enter room name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm font-bold mt-1">
                Name is required
              </p>
            )}
          </div>

          <div className="flex flex-col mb-5">
            <label htmlFor="description" className="font-bold text-sm mb-2">
              Description
            </label>
            <textarea
              className="border rounded-xl border-gray-400 p-3 px-4 text-center focus:border-blue-500 focus:outline-none transition-colors resize-none h-20"
              id="description"
              placeholder="Describe your room..."
              {...register("description", { required: true, maxLength: 300 })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {errors.description.type === "required" &&
                  "Description is required"}
                {errors.description.type === "maxLength" &&
                  "Description cannot exceed 300 characters"}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="font-bold text-sm mb-3 block">
              Tags {selectedTags.size > 0 && `(${selectedTags.size} selected)`}
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  type="button"
                  className={`
                    text-xs px-2.5 py-1.5 rounded-full transition-all duration-200 transform hover:scale-105 whitespace-nowrap
                    ${
                      selectedTags.has(tag.id)
                        ? "shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                    }
                  `}
                  onClick={() => toggleTag(tag.id)}
                >
                  {selectedTags.has(tag.id) && <span className="mr-1">✓</span>}
                  {tag.name}
                </Button>
              ))}
            </div>
            {selectedTags.size === 0 && (
              <p className="text-gray-500 text-xs mt-2 italic">
                Select at least one tag to help others find your room
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="themed"
              disabled={isSubmitting || selectedTags.size === 0}
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Room"}
            </Button>
            <Button
              variant="black"
              disabled={isSubmitting}
              onClick={closeDialog}
              type="button"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
