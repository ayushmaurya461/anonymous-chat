import { createContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  id?: string;
  name: string;
  email?: string;
  status?: string;
  createdAt: string;
  type: string;
  uid: string;
} | null;

type AuthCtx = {
  user: User;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("chat_user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("chat_user", JSON.stringify(user));
    else localStorage.removeItem("chat_user");
  }, [user]);

  async function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
