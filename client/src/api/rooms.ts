import { api } from "./auth";

export const createRoom = async (
  name: string,
  description: string,
  id: string,
  tags: string[]
) => {
  const { data } = await api.post("/rooms/create", {
    name: name,
    description: description,
    user_id: id,
    tags: tags,
  });
  return data;
};

export const getRooms = async (user_id: string) => {
  const { data } = await api.get(`/rooms/${user_id}`);
  return data;
};

export const searchRooms = async (query: string, tags: string[] = []) => {
  if (!Array.isArray(tags)) {
    tags = [];
  }
  const { data } = await api.get(`/rooms/search?query=${query}&tags=${tags}`);
  return data;
};

export const joinRoom = async (room_id: string, user_id: string) => {
  const { data } = await api.post("/rooms/join", {
    room_id: room_id,
    user_id: user_id,
  });
  return data;
};
