import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true, // Crucial for sending httpOnly cookies (access_token, session_id)
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
