import React from "react";
import { Link } from "react-router-dom";

const PinterestNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-8 py-3 flex items-center gap-8 shadow-2xl">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform">
            IS
          </div>
        </Link>

        {/* Search Bar Simulation */}
        <div className="flex-grow relative group hidden md:block">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input 
            type="text" 
            placeholder="Search neural patterns..." 
            className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/30 focus:bg-white/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <Link to="/dashboard" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition">Explore</Link>
          <Link to="/interview" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition">Simulate</Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-emerald-500 border border-white/20 shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
      </div>
    </nav>
  );
};

export default PinterestNavbar;
