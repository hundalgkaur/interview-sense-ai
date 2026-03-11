import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col font-sans selection:bg-indigo-500/30">
      <Navbar />
      <main className="flex-grow pt-[88px] lg:pt-[112px]">
        {children}
      </main>
      <footer className="bg-[#050505] border-t border-white/5 py-20 px-6 mt-auto overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 -z-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4 group">
             <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12">
               <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
             </div>
            <span className="font-black text-white text-xl tracking-tighter">Interview<span className="text-indigo-500 italic">Sense</span> AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Protocol</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-white transition-colors">Neural Support</Link>
          </div>
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} Interview Sense AI • Evolution Through Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;