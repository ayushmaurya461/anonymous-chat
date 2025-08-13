import { api } from "./auth";

export async function getUsers(user: string) {
  const { data } = await api.get("/user/users/" + user);
  return data;
}

