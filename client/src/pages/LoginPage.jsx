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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 pt-24 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-xl relative z-10 page-transition">
        <div className="bg-white/[0.02] backdrop-blur-3xl p-12 lg:p-16 rounded-[4rem] border border-white/10 shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 -z-10"></div>
          
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-3xl mx-auto mb-10 shadow-2xl shadow-indigo-500/10 group hover:rotate-12 transition-all duration-500">
              <span className="group-hover:scale-110 transition-transform">🔑</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Welcome back.</h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Neural Identity Verification Protocol</p>
          </div>

          {error && (
            <div className="mb-12 p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-shake">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-[12px]">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Access Token (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@terminal.ai"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-slate-700 focus:bg-white/[0.07] focus:border-indigo-500/50 outline-none transition-all font-medium text-lg"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Neural Key (Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-slate-700 focus:bg-white/[0.07] focus:border-indigo-500/50 outline-none transition-all font-medium text-lg tracking-widest"
                required
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-slate-200 transition-all shadow-3xl hover:scale-[1.02] active:scale-95 group"
              >
                Authorize Link <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          </form>

          <div className="mt-16 text-center">
            <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">
              Identity Not Found?{" "}
              <Link to="/signup" className="text-indigo-500 font-black hover:text-white transition-colors underline decoration-indigo-500/30 underline-offset-8">
                Initialize Profile
              </Link>
            </p>
          </div>
        </div>
        
        {/* Security Meta */}
        <div className="mt-12 flex justify-center items-center gap-10 opacity-30 grayscale">
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em]">Secure Auth Terminal</p>
           <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em]">End-to-End Encrypted</p>
           <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em]">Identity v1.5</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;