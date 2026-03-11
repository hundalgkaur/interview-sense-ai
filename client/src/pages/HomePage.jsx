import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../components/layout/Layout";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personalized Training');

  const showcaseItems = [
    { 
      title: "Job-Profile Tailoring", 
      desc: "Our neural engine generates technical challenges precisely aligned with your target position, from Frontend Lead to Cloud Architect.", 
      icon: "🎯", 
      highlighted: false 
    },
    { 
      title: "Real-time AI Feedback", 
      desc: "Receive instant, teacher-grade evaluations on your logic, communication clarity, and technical depth after every response.", 
      icon: "🧠", 
      highlighted: true 
    },
    { 
      title: "Speech & Code Integration", 
      desc: "Practice naturally with integrated Speech-to-Text for behavioral answers and a professional Monaco editor for coding tasks.", 
      icon: "🎙️", 
      highlighted: false 
    },
    { 
      title: "Seniority Calibration", 
      desc: "Experience levels are not just labels. We adjust question complexity and evaluation strictness based on your years of expertise.", 
      icon: "📈", 
      highlighted: false 
    },
    { 
      title: "Proficiency Analytics", 
      desc: "Visualize your strengths and growth areas with detailed radar charts and behavioral artifacts analysis.", 
      icon: "📊", 
      highlighted: false 
    },
    { 
      title: "Mock Interview History", 
      desc: "Track your evolution over time. Revisit past simulations and compare your performance against the 'Gold Standard' ideal answers.", 
      icon: "📑", 
      highlighted: false 
    },
  ];

  const tabs = ['Personalized Training', 'Neural Evaluation', 'Career Strategy'];

  const handleStart = () => {
    if (user) {
      navigate("/interview");
    } else {
      navigate("/login");
    }
  };

  return (
    <Layout>
      <div className="bg-[#050505] min-h-screen font-sans overflow-hidden selection:bg-indigo-500/30">
        
        {/* Hero Section */}
        <section className="relative pt-48 pb-40 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between z-10">
          
          {/* Background Gradient Blurs */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] -z-10"></div>
          
          <div className="lg:w-[60%] z-10 mb-20 lg:mb-0">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Neural Engine 1.5 Active</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              Master Your Next <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500">Technical Career</span> Move.
            </h1>
            
            <p className="text-slate-400 mb-12 text-xl max-w-2xl leading-relaxed font-medium">
              Experience high-fidelity, AI-driven interview simulations tailored precisely to your job profile, seniority, and technical stack.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={handleStart}
                className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.2)] hover:-translate-y-1 active:scale-95"
              >
                Launch Neural Terminal →
              </button>
              <Link to="/signup" className="bg-white/[0.03] border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:border-indigo-500/40 transition-all backdrop-blur-sm flex items-center gap-3 group/btn">
                Join Professional Network <span className="text-slate-600 group-hover/btn:text-indigo-400 group-hover/btn:translate-x-1 transition-all">→</span>
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-8 border-t border-white/5 pt-12">
               <div>
                  <p className="text-2xl font-black text-white leading-none">98%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Accuracy Rate</p>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div>
                  <p className="text-2xl font-black text-white leading-none">10k+</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Simulations Run</p>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div>
                  <p className="text-2xl font-black text-white leading-none">Gemini</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Core Intelligence</p>
               </div>
            </div>
          </div>
          
          <div className="lg:w-[40%] relative w-full flex justify-center z-10">
            <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] group">
              {/* Geometric Decoration */}
              <div className="absolute inset-0 rounded-[3rem] border-2 border-indigo-500/20 rotate-6 group-hover:rotate-12 transition-transform duration-1000"></div>
              <div className="absolute inset-0 rounded-[3rem] border-2 border-emerald-500/10 -rotate-3 group-hover:-rotate-6 transition-transform duration-1000"></div>
              
              {/* Main Visual */}
              <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 to-transparent p-px shadow-2xl overflow-hidden">
                 <div className="w-full h-full rounded-[2.5rem] bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="p-12 space-y-6 w-full">
                       <div className="h-2 w-1/3 bg-indigo-500/40 rounded-full animate-pulse"></div>
                       <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                       <div className="h-2 w-1/2 bg-white/5 rounded-full"></div>
                       <div className="pt-8 grid grid-cols-2 gap-4">
                          <div className="h-24 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">84</div>
                             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Logic Score</span>
                          </div>
                          <div className="h-24 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs">92</div>
                             <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">Clarity Factor</span>
                          </div>
                       </div>
                       <div className="pt-4 h-12 w-full bg-indigo-600/20 rounded-xl border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                          Analyzing Input Stream...
                       </div>
                    </div>
                    {/* Floating Glow */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/30 rounded-full blur-[60px]"></div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-[#050505] relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
              <div className="max-w-2xl">
                <p className="text-indigo-400 font-black mb-4 text-[10px] tracking-[0.3em] uppercase">Core Capabilities</p>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">Advanced Functionality for <br/> Career Peak Performance</h2>
              </div>
              <button className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors">
                View All Specs ↗
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {showcaseItems.map((item, idx) => (
                <div key={idx} className={`p-12 rounded-[2.5rem] border border-white/5 transition-all hover:-translate-y-2 duration-500 relative overflow-hidden group ${item.highlighted ? 'bg-indigo-600 shadow-[0_40px_80px_rgba(79,70,229,0.2)]' : 'bg-white/5 hover:bg-white/[0.07] hover:border-white/10'}`}>
                  {item.highlighted && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>}
                  <div className={`text-5xl mb-10 transition-transform group-hover:scale-110 duration-500 ${item.highlighted ? 'opacity-100' : 'opacity-40'}`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-2xl font-black mb-6 leading-tight tracking-tight ${item.highlighted ? 'text-white' : 'text-slate-100'}`}>{item.title}</h3>
                  <p className={`mb-10 text-base leading-relaxed font-medium ${item.highlighted ? 'text-white/80' : 'text-slate-400'}`}>
                    {item.desc}
                  </p>
                  <Link 
                    to="/signup" 
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${item.highlighted ? 'text-white' : 'text-indigo-400 group-hover:gap-4'}`}
                  >
                    Get Access <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligence Section */}
        <section className="py-32 bg-[#050505] relative">
          <div className="absolute left-0 top-1/4 w-1/3 h-1/2 bg-indigo-600/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
              <p className="text-emerald-400 font-black mb-4 text-[10px] tracking-[0.3em] uppercase">Dynamic Methodology</p>
              <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter">The Fusion of Industry Standards <br/> & Neural Intelligence</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-24">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 border border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-24 items-center">
              <div className="lg:w-[45%] w-full">
                 <div className="w-full aspect-square rounded-[3.5rem] overflow-hidden relative shadow-2xl border border-white/5 group">
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop" alt="Technology Scene" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-12 left-12 right-12">
                       <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl">
                          <p className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-3">Live Log</p>
                          <p className="text-white font-medium italic text-lg leading-relaxed">"System successfully identified 4 performance anti-patterns in user's last submission."</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="lg:w-[55%]">
                <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                  Evolve beyond generic <br/> interview prep.
                </h3>
                <p className="text-slate-400 mb-12 text-lg leading-relaxed font-medium">
                  We don't just ask questions. We analyze the nuances of your delivery, the complexity of your code, and the alignment of your answers with senior-level architectural patterns.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {[
                    { label: 'Individuals', text: 'Accelerate your career trajectory with data-driven practice.' },
                    { label: 'Mentors', text: 'Provide your mentees with a high-fidelity sandbox for growth.' },
                    { label: 'Hiring Teams', text: 'Understand the bar of excellence with AI-assisted benchmarks.' },
                    { label: 'Bootcamps', text: 'Standardize technical proficiency across your cohort.' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</p>
                      </div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleStart}
                  className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-slate-200 transition-all group active:scale-95"
                >
                  Enter Simulation Terminal <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 bg-[#050505]">
           <div className="max-w-5xl mx-auto px-6 text-center">
              <div className="p-20 bg-indigo-600 rounded-[4rem] relative overflow-hidden shadow-[0_40px_100px_rgba(79,70,229,0.3)]">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                 <div className="relative z-10">
                    <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 leading-tight tracking-tighter">Ready to secure your <br/> dream position?</h2>
                    <p className="text-indigo-100 mb-12 text-xl font-medium max-w-2xl mx-auto opacity-80">
                       Start your first simulation today. No credit card required. Pure AI-driven career evolution.
                    </p>
                    <button 
                      onClick={handleStart}
                      className="bg-white text-indigo-600 px-16 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform active:scale-95"
                    >
                       Get Started Now
                    </button>
                 </div>
              </div>
           </div>
        </section>

        <footer className="py-20 border-t border-white/5 text-center">
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">© 2026 Interview Sense AI • Evolution Through Intelligence</p>
        </footer>

      </div>
    </Layout>
  );
};

export default HomePage;