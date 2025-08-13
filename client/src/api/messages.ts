import { api } from "./auth";

export async function getMessages(type: string, id: string, user: string) {
  const { data } = await api.get(
    `/messages?type=${type}&c_user_id=${id}&user_id=${user}`
  );

  return data
}