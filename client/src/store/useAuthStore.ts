import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: "JOB_SEEKER" | "EMPLOYER";
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
  setLoading: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,

  login: (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
    }
    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (status) => set({ isLoading: status }),
}));
