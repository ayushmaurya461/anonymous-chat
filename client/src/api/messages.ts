import { api } from "./auth";

export async function getMessages(type: string, id: string, user: string, room_id?: string) {
  const { data } = await api.get(
    `/user/messages?type=${type}&c_user_id=${id}&user_id=${user}&room_id=${room_id}`
  );

  return data;
}

export const markAsRead = async (userId: string) => {
  const { data } = await api.post("/user/mark-read?user_id=" + userId);
  return data;
};
