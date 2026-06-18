import axios from "axios";

export const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Crucial for sending httpOnly cookies (access_token, session_id)
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-fallback response interceptor: retries failed network calls on localhost if the primary base URL fails.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If it's a network/connection error (no response received or network code)
    // and the primary URL is not already localhost, we retry on localhost:8000
    if (
      (!error.response || error.code === "ERR_NETWORK") &&
      BACKEND_URL !== "http://localhost:8000" &&
      !originalRequest._retryLocalhost
    ) {
      originalRequest._retryLocalhost = true;
      console.warn(`Primary backend URL (${BACKEND_URL}) failed to respond. Retrying request on fallback localhost...`);
      
      // Override baseURL and url to use localhost
      originalRequest.baseURL = "http://localhost:8000";
      if (originalRequest.url && originalRequest.url.startsWith(BACKEND_URL)) {
        originalRequest.url = originalRequest.url.replace(BACKEND_URL, "http://localhost:8000");
      }
      
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
