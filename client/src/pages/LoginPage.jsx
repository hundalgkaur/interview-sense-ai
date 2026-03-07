import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50 overflow-hidden border border-gray-100">
        <div className="p-10 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg shadow-blue-100">
              IS
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 font-medium mt-2">Resume your interview preparation</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 border border-rose-100 animate-shake">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:opacity-70 transition">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-gray-100 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : "Sign In →"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-400">
              New here?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
