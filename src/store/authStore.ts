import { create } from "zustand";
import { User, AuthState } from "@/types";
import { generateUserId } from "@/lib/utils/format";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: "google" | "apple") => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user: User = {
      id: generateUserId(),
      email,
      name: email.split("@")[0],
      provider: "email",
      createdAt: new Date(),
    };

    set({ user, isAuthenticated: true, isLoading: false });
  },

  loginWithProvider: async (provider: "google" | "apple") => {
    set({ isLoading: true });

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = {
      id: generateUserId(),
      email: `user@${provider}.com`,
      name: `${provider} User`,
      provider,
      createdAt: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=random`,
    };

    set({ user, isAuthenticated: true, isLoading: false });
  },

  register: async (email: string, _password: string, name: string) => {
    set({ isLoading: true });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user: User = {
      id: generateUserId(),
      email,
      name,
      provider: "email",
      createdAt: new Date(),
    };

    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
