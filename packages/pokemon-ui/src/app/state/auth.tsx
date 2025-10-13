import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

type User = { id: string; email: string; displayName: string } | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, displayName: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_STORAGE_KEY = 'pokemon_auth_v1';
const TOKEN_STORAGE_KEY = 'pokemon_token_v1';

function decodeJwt(token: string): any | null {
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Restore user from token on mount
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        const payload = decodeJwt(token);
        if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
          // Token is still valid
          setUser({
            id: payload.sub || 'me',
            email: payload.email || '',
            displayName: payload.displayName || '',
          });
        } else {
          // Token expired, clear it
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);
  }, [user]);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      async login(email, password) {
        const res = await api<{ access_token: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem(TOKEN_STORAGE_KEY, res.access_token);
        const payload = decodeJwt(res.access_token) || {};
        setUser({ id: payload.sub || 'me', email: payload.email || email, displayName: payload.displayName || email.split('@')[0] });
      },
      async signup(email, displayName, password) {
        const res = await api<{ access_token: string }>('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ email, displayName, password }),
        });
        localStorage.setItem(TOKEN_STORAGE_KEY, res.access_token);
        const payload = decodeJwt(res.access_token) || {};
        setUser({ id: payload.sub || 'me', email: payload.email || email, displayName: payload.displayName || displayName });
      },
      logout() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
