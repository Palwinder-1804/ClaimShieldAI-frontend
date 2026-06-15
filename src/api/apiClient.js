import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Crucial for sending httpOnly cookies (access_token, session_id)
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
