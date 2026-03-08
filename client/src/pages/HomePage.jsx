import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../components/layout/Layout";

const HomePage = () => {
  const { user } = useAuth();

  const showcaseItems = [
    { title: "Neural Synthesis", desc: "Technical evaluation powered by Gemini 1.5 Pro.", icon: "🧠", height: "h-64" },
    { title: "Verbal Sync", desc: "Continuous voice-to-text practice stream.", icon: "🎙️", height: "h-80" },
    { title: "Code Lab", desc: "Integrated Monaco IDE with real-time logic analysis.", icon: "💻", height: "h-96" },
    { title: "Visual Pulse", desc: "Skill radar charts mapping your proficiency.", icon: "📈", height: "h-72" },
    { title: "Resume Link", desc: "Intelligent PDF skill extraction.", icon: "📄", height: "h-80" },
    { title: "Logic Flow", desc: "Adaptive follow-up questions that challenge your depth.", icon: "⛓️", height: "h-64" },
  ];

  return (
    <Layout>
      <div className="relative overflow-hidden min-h-screen animate-in fade-in duration-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/10 rounded-full blur-[120px] animate-glow-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/5 rounded-full blur-[120px] animate-glow-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-32">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-neon-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-12">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan shadow-[0_0_10px_#22D3EE]"></span>
              </span>
              Next-Gen Simulation Environment
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.85] neon-text-glow">
              Master the <br />
              <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                Neural Screen.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
              High-fidelity AI simulations that evolve based on your expertise. 
              Real-time analysis, verbal practice, and professional reporting.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link
                to={user ? "/interview" : "/login"}
                className="btn-neon px-12 py-6 text-base"
              >
                Initiate Simulation →
              </Link>
              {!user && (
                <Link
                  to="/signup"
                  className="px-12 py-6 bg-white/5 text-white font-black text-base rounded-2xl border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 uppercase tracking-widest shadow-xl"
                >
                  Create Identity
                </Link>
              )}
            </div>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {showcaseItems.map((item, index) => (
              <div key={index} className="break-inside-avoid">
                <div className={`glass-container ${item.height} p-12 group hover:border-neon-purple/30 transition-all duration-700 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-neon-purple/10 transition-all duration-700"></div>
                  
                  <div className="text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 origin-left">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter group-hover:text-neon-cyan transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed text-lg">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-10 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-[10px] font-black text-neon-purple uppercase tracking-[0.3em]">Module Validated</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-40 pt-20 border-t border-white/5 flex flex-wrap justify-center gap-16 md:gap-24 opacity-20 grayscale contrast-200 saturate-0">
            {['GOOGLE', 'META', 'AMAZON', 'NETFLIX', 'APPLE', 'OPENAI'].map(brand => (
              <span key={brand} className="text-3xl font-black tracking-tighter text-white">{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
