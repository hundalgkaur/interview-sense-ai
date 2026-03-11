import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Add a response interceptor to handle token expiration (401 errors)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
