export type User = {
  id?: string;
  name: string;
  email?: string;
  status?: string;
  createdAt: string;
  type: string;
  uid: string;
} | null;

export type AuthCtx = {
  user: User;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};

export type Inputs = { username: string; password: string };
