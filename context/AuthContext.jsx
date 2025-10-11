"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CheckSession, LogOutUser } from "@/lib/auth";

const AuthContext = createContext({ user: null, setUser: () => {}, logout: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = await CheckSession();
      if (!mounted) return;
      if (session?.user) setUser(session.user);
      else setUser(null);
    })();
    return () => { mounted = false; };
  }, []);

  const logout = useCallback(async () => {
    await LogOutUser();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
