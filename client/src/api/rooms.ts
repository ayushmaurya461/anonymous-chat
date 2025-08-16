import { api } from "./auth";

export const createRoom = async (
  name: string,
  description: string,
  id: string
) => {
  const { data } = await api.post("/rooms/create", {
    name: name,
    description: description,
    user_id: id,
  });
  return data;
};
