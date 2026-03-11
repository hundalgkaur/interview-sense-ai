import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Terminal", path: "/about" },
    { name: "Intelligence Vault", path: "/vault" },
    { name: "Intelligence Hub", path: "/dashboard" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
      isScrolled 
        ? "bg-[#050505]/80 backdrop-blur-2xl py-4 border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]" 
        : "bg-transparent py-8 border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-4 group relative">
          <div className="relative">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="w-4 h-4 bg-white rounded-full relative z-10"></span>
            </div>
            <div className="absolute -inset-2 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tighter leading-none">
              Interview<span className="text-indigo-500 italic">Sense</span>
            </span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Neural AI Terminal</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center bg-white/5 rounded-2xl px-2 py-1 border border-white/5 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                isActive(link.path) ? "text-white" : "text-slate-500 hover:text-slate-200"
              }`}
            >
              <span className="relative z-10">{link.name}</span>
              {isActive(link.path) && (
                <div className="absolute inset-0 bg-white/5 rounded-xl border border-white/10 shadow-inner animate-fade-in"></div>
              )}
              {isActive(link.path) && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 lg:gap-8">
          {user ? (
            <div className="flex items-center gap-4 lg:gap-8">
               <button 
                 onClick={() => { logout(); navigate("/"); }} 
                 className="hidden sm:block text-slate-500 hover:text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
               >
                 De-authorize
               </button>
               
               <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

               <Link 
                 to="/interview" 
                 className="bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3 group/btn"
               >
                 Launch Terminal
                 <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
               </Link>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl active:scale-95 shadow-indigo-500/20 border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Join Protocol</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 active:scale-90 transition-transform"
          >
            <div className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
            <div className={`w-5 h-0.5 bg-white transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 top-[88px] bg-[#050505] z-40 transition-all duration-500 ${
        mobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-10"
      }`}>
        <div className="p-6 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block w-full p-6 rounded-[2rem] border border-white/5 transition-all ${
                isActive(link.path) ? "bg-indigo-600 text-white shadow-xl" : "bg-white/5 text-slate-400"
              }`}
            >
              <span className="text-sm font-black uppercase tracking-[0.3em]">{link.name}</span>
            </Link>
          ))}
          {user && (
            <button 
              onClick={() => { logout(); navigate("/"); setMobileMenuOpen(false); }}
              className="w-full p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-black uppercase tracking-[0.3em] text-left"
            >
              De-authorize Session
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;