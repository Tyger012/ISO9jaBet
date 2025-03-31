import { create } from "zustand";
import { AuthState, User } from "../types";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "./api";

export const useAuthStore = create<AuthState & {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
  
  // Login user
  login: async (username, password) => {
    try {
      set({ loading: true });
      const response = await loginUser(username, password);
      const data = await response.json();
      set({ isAuthenticated: true, user: data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  
  // Register user
  register: async (username, email, password) => {
    try {
      set({ loading: true });
      const response = await registerUser(username, email, password);
      const data = await response.json();
      set({ isAuthenticated: true, user: data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      set({ loading: true });
      await logoutUser();
      set({ isAuthenticated: false, user: null, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  
  // Check if user is authenticated
  checkAuth: async () => {
    try {
      set({ loading: true });
      const response = await getCurrentUser();
      const data = await response.json();
      set({ isAuthenticated: true, user: data, loading: false });
    } catch (error) {
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
  
  // Set user manually (for updating user data)
  setUser: (user) => {
    set({ user });
  }
}));
