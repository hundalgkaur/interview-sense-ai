import { useState, useEffect } from "react";
import API from "../services/api";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post("/users/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post("/users", { name, email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return { user, loading, error, login, signup, logout };
};

export default useAuth;
