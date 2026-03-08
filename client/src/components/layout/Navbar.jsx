import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-dark-base/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl flex items-center justify-center text-white font-black text-xl transition-all group-hover:scale-110 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            IS
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            INTERVIEW<span className="text-neon-purple">SENSE</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-10">
          <ThemeToggle />
          
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-8">
                <Link to="/dashboard" className="text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors relative group">
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-purple transition-all group-hover:w-full shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
                </Link>
                <Link to="/interview" className="text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors relative group">
                  Simulation
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-purple transition-all group-hover:w-full shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
                </Link>
              </div>
              <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-5">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Authenticated</p>
                  <p className="text-sm font-bold text-white leading-none neon-text-glow">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/5 rounded-lg transition-colors border border-rose-500/10"
                >
                  Exit
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-neon px-6 py-2.5"
              >
                Join Nexus
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
