"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, setToken, getToken, clearToken } from "../lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: if a token already exists, fetch the current user
  useEffect(() => {
    const token = getToken();
    if (token) {
      api.getMe()
        .then((me: User) => setUser(me))
        .catch(() => {
          // Token is invalid/expired — clean up
          clearToken();
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const tokenData = await api.login({ username_or_email: usernameOrEmail, password });
    setToken(tokenData.access_token);
    const me: User = await api.getMe();
    setUser(me);
  };

  const signup = async (email: string, username: string, password: string) => {
    const tokenData = await api.signup({ email, username, password });
    setToken(tokenData.access_token);
    const me: User = await api.getMe();
    setUser(me);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
