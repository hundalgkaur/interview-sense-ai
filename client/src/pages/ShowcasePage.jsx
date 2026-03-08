import React from "react";
import { Link } from "react-router-dom";

const ShowcasePage = () => {
  const showcaseItems = [
    { title: "AI Core", desc: "Powered by Gemini 1.5 Pro for deep neural analysis.", height: "h-64", icon: "🧠" },
    { title: "Voice Sync", desc: "Real-time verbal-to-text synthesis with infinite stream support.", height: "h-80", icon: "🎙️" },
    { title: "Code Lab", desc: "Integrated IDE with real-time complexity analysis.", height: "h-96", icon: "💻" },
    { title: "Visual Analytics", desc: "Skill radar charts mapping technical proficiency.", height: "h-72", icon: "📊" },
    { title: "Resume Pulse", desc: "Instant skill extraction from any PDF document.", height: "h-80", icon: "📄" },
    { title: "Logic Flow", desc: "Adaptive follow-up questions based on candidate depth.", height: "h-64", icon: "⛓️" },
    { title: "PDF Engine", desc: "Export professional proficiency reports in one click.", height: "h-96", icon: "📤" },
    { title: "Global Context", desc: "Regional market-aware interview simulations.", height: "h-72", icon: "🌍" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-20 animate-float">
        <h1 className="text-6xl font-black text-white tracking-tighter mb-6 cyan-glow-text">
          Liquid Intelligence
        </h1>
        <p className="text-cyan-400 font-black uppercase tracking-[0.4em] text-xs">
          The Future of Technical Assessment
        </p>
      </div>

      <div className="masonry-grid">
        {showcaseItems.map((item, index) => (
          <div key={index} className="masonry-item">
            <div className={`liquid-glass ${item.height} p-10 rounded-[3rem] group hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between border border-white/5`}>
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">System Integrated</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 glass-card-extreme p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50"></div>
        <h2 className="text-4xl font-black text-white mb-8 relative z-10">Ready to Evolve?</h2>
        <Link
          to="/signup"
          className="relative z-10 px-12 py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:-translate-y-1 inline-block uppercase tracking-widest text-sm"
        >
          Initialize Account
        </Link>
      </div>
    </div>
  );
};

export default ShowcasePage;
