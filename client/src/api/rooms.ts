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

export const getRooms = async (user_id: string) => {
  const { data } = await api.get(`/rooms/${user_id}`);
  return data;
};
