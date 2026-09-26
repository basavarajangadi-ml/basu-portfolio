"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabase/client";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isSupabaseActive: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSupabaseActive: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
});

const LOCAL_AUTH_KEY = "portfolio_admin_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsSupabaseActive(configured);

    if (configured && supabase) {
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "admin@example.com",
            role: "admin",
          });
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "admin@example.com",
            role: "admin",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local fallback auth session
      try {
        const savedSession = localStorage.getItem(LOCAL_AUTH_KEY);
        if (savedSession) {
          setUser(JSON.parse(savedSession));
        }
      } catch (e) {
        console.warn("Could not read local session", e);
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            role: "admin",
          });
          return { success: true };
        }
      } catch (err: any) {
        console.warn("Supabase auth unreachable or error, falling back to server verification:", err);
      }
    }

    // Secure server-side verification
    try {
      const clientVaultPassword = typeof window !== 'undefined' ? localStorage.getItem("portfolio_admin_vault_pass") : null;

      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password,
          clientVaultPassword: clientVaultPassword || undefined
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(data.user));
        localStorage.setItem("portfolio_admin_vault_pass", password);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Invalid email or password." };
      }
    } catch (err: any) {
      return { success: false, error: "Authentication server error. Please try again." };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Try Supabase sign up if active
    if (isSupabaseActive && supabase) {
      try {
        await supabase.auth.signUp({ email, password });
      } catch (err) {
        console.warn("Supabase signup skipped or unreachable:", err);
      }
    }

    // 2. Register in server store
    try {
      const res = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(data.user));
        localStorage.setItem("portfolio_admin_vault_pass", password);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to create admin account." };
      }
    } catch {
      return { success: false, error: "Server error during registration." };
    }
  };

  const signOut = async () => {
    if (isSupabaseActive && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSupabaseActive, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
