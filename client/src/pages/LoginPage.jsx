import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="premium-card w-full max-w-md p-12 relative z-10 page-transition">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 border border-white/5 shadow-2xl">
            🔑
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Neural Identity Verification</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Access Token (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@nexus.com"
              className="liquid-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Secure Key (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="liquid-input w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full glass-button-primary py-5 text-sm uppercase tracking-[0.2em] font-black"
          >
            Authorize Access
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 font-medium">
            New to the grid?{" "}
            <Link to="/signup" className="text-blue-400 font-black hover:text-white transition-colors">
              Initialize Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
