// In your frontend, create a config file
// lib/api.js or lib/axios.js
import axios from "axios";

// console.log("URL", process.env.NEXT_PUBLIC_API_URL)
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://your-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // console.log("token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
