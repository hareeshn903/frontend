import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.64.3:8080"
});

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;