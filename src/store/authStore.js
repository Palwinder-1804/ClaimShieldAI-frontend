import { create } from "zustand";
import apiClient from "../api/apiClient";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/auth/me");
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (err) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Invalid credentials. Please try again.";
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  register: async (email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post("/auth/register", {
        email,
        password,
        full_name: fullName,
      });
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Registration failed. Try again.";
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  onboard: async (fullName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch("/auth/me/onboard", {
        full_name: fullName,
      });
      set({ user: response.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Onboarding submission failed.";
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null })
}));
