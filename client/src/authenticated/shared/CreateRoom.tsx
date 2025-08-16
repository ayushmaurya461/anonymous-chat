import { useForm } from "react-hook-form";
import { Button } from "./components/Button";
import { createRoom } from "../../api/rooms";
import { useAuth } from "../../hooks/use-auth";

type Inputs = {
  name: string;
  description: string;
};

export const CreateRoom = ({ closeDialog }: { closeDialog: () => void }) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const submit = async (values: Inputs) => {
    try {
      await createRoom(values.name, values.description, user?.id as string);
      closeDialog();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="backdrop-blur-xl w-full h-screen absolute top-0 right-0 z-50 flex items-center justify-center">
      <div className="p-8  rounded-3xl shadow-lg w-xs min-w-fit">
        <form onSubmit={handleSubmit(submit)}>
          <h3 className="font-bold text-2xl text-center mb-3">Create Room</h3>

          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="font-bold text-sm mb-2">
              Name
            </label>
            <input
              className=" border rounded-xl border-gray-400 p-2 px-4 text-center"
              type="text"
              id="name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm font-bold">Name is required</p>
            )}
          </div>

          <div className="flex flex-col mb-3">
            <label htmlFor="description" className="font-bold text-sm mb-2">
              Description
            </label>
            <textarea
              className=" border rounded-xl border-gray-400 p-2 px-4 text-center"
              id="description"
              {...register("description", { required: true, maxLength: 300 })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm font-bold">
                {errors.description.type === "required" &&
                  "Description is required"}
                {errors.description.type === "maxLength" &&
                  "Description cannot exceed 300 characters"}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="themed" disabled={isSubmitting}>
              Create Room
            </Button>
            <Button
              variant="black"
              disabled={isSubmitting}
              onClick={closeDialog}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
