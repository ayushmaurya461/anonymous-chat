import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string) {
  const { data } = await api.post("/api/login", { username, password });
  return data;
}

export async function guestLogin() {
  const { data } = await api.post("/api/guest");
  return data;
}

export async function signup(
  email: string,
  password: string,
  username: string
) {
  const { data } = await api.post("/api/register", {
    username,
    email,
    password,
  });
  return data;
}
