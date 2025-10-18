import { create } from "zustand";

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
} | null;

type AuthState = {
  user: User;
  setUser: (u: User) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  clear: () => set({ user: null }),
}));