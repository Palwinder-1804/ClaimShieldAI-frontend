import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Crucial for sending httpOnly cookies (access_token, session_id)
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
