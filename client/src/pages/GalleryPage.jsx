import React from "react";
import { Link } from "react-router-dom";

const GalleryPage = () => {
  const items = [
    { title: "Neural Synthesis", category: "AI CORE", height: "h-64", img: "🧠", color: "from-blue-500/20" },
    { title: "Quantum Logic", category: "PROCESSOR", height: "h-96", img: "⚛️", color: "from-cyan-500/20" },
    { title: "Visual Pulse", category: "ANALYTICS", height: "h-72", img: "📊", color: "from-indigo-500/20" },
    { title: "Stream Sync", category: "VOICE", height: "h-80", img: "🎙️", color: "from-purple-500/20" },
    { title: "Code Matrix", category: "IDE", height: "h-96", img: "💻", color: "from-emerald-500/20" },
    { title: "Global Mesh", category: "NETWORK", height: "h-64", img: "🌍", color: "from-blue-400/20" },
    { title: "Data Flow", category: "REPORTING", height: "h-80", img: "📤", color: "from-cyan-400/20" },
    { title: "Logic Chain", category: "ADAPTIVE", height: "h-72", img: "⛓️", color: "from-indigo-400/20" },
  ];

  return (
    <div className="min-h-screen py-20 px-6 relative">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-glow delay-1000"></div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-7xl font-black text-white tracking-tighter mb-4 liquid-gradient-text">
            Pryda Meta-Grid
          </h1>
          <p className="text-cyan-400 font-black uppercase tracking-[0.5em] text-[10px]">
            Pinterest-Style Liquid Glass Evolution
          </p>
        </header>

        <div className="masonry-grid">
          {items.map((item, i) => (
            <div key={i} className="masonry-item">
              <div className={`pryda-glass ${item.height} rounded-[3rem] p-10 group hover:scale-[1.02] transition-all duration-700 flex flex-col justify-between cursor-pointer active:scale-95`}>
                {/* Internal Glow Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                
                <div className="relative z-10">
                  <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-6 block opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.category}
                  </span>
                  <h3 className="text-3xl font-black text-white leading-tight tracking-tighter mb-4">
                    {item.title}
                  </h3>
                </div>

                <div className="relative z-10 flex justify-between items-end">
                  <div className="text-5xl glow-cyan group-hover:scale-110 transition-transform duration-500">
                    {item.img}
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    →
                  </div>
                </div>

                {/* Glass Refraction Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-32 text-center pb-20">
          <Link
            to="/dashboard"
            className="px-16 py-6 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all duration-500 uppercase tracking-widest text-xs shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Enter Simulation Terminal
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default GalleryPage;
