import { createContext, useEffect, useState, type ReactNode } from "react";
import type { AuthCtx, User } from "../models/auth";


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
