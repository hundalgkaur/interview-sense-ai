import React from "react";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const principles = [
    {
      title: "Neural Precision",
      desc: "We leverage advanced Large Language Models to simulate high-fidelity technical and behavioral interview scenarios, tailored precisely to your seniority and job role.",
      icon: "🧠"
    },
    {
      title: "Empirical Feedback",
      desc: "Our evaluations are not generic. We analyze the specific logic, architectural patterns, and communication clarity of every response to provide actionable insights.",
      icon: "📊"
    },
    {
      title: "Career Evolution",
      desc: "Interview Sense AI is built to turn anxiety into confidence. By practicing in a low-stakes, high-fidelity environment, you accelerate your journey toward career mastery.",
      icon: "🚀"
    }
  ];

  return (
    <Layout>
      <div className="bg-[#050505] min-h-screen font-sans overflow-hidden selection:bg-indigo-500/30 pt-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-6 py-32 page-transition relative">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[140px] -z-10 animate-pulse"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px] -z-10"></div>

          {/* Header Section */}
          <div className="mb-32 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-10">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol: Mission Briefing</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-white mb-10 leading-[0.9] tracking-tighter">
              Decoding the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 italic">Future of Hire.</span>
            </h1>
            
            <p className="text-slate-400 text-xl lg:text-2xl font-medium max-w-3xl leading-relaxed mx-auto lg:mx-0">
              Interview Sense AI is a high-fidelity assessment terminal designed to bridge the gap between technical potential and professional performance. 
            </p>
          </div>

          {/* Core Philosophy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
            {principles.map((p, i) => (
              <div key={i} className="bg-white/[0.02] backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 group hover:border-indigo-500/30 transition-all duration-700">
                <div className="text-5xl mb-10 group-hover:scale-110 transition-transform duration-500 opacity-60">
                  {p.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-6 tracking-tight uppercase">{p.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* The Neural Engine Section */}
          <div className="flex flex-col lg:flex-row gap-24 items-center mb-40">
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600/20 rounded-[4rem] blur-[60px] group-hover:bg-indigo-600/30 transition-all duration-700"></div>
                <div className="relative bg-white/[0.02] border border-white/10 rounded-[4rem] p-12 overflow-hidden backdrop-blur-2xl">
                   <div className="space-y-8">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">System Architecture</p>
                        <span className="text-[10px] font-black text-slate-700 uppercase">v1.5.0_BETA</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                           <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Processing</p>
                           <p className="text-xl font-black text-white">4.2 TFlops</p>
                        </div>
                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                           <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Sync Level</p>
                           <p className="text-xl font-black text-white">99.8%</p>
                        </div>
                      </div>
                      <div className="p-8 bg-indigo-600/10 rounded-3xl border border-indigo-500/20">
                         <p className="text-[9px] font-black text-indigo-400 uppercase mb-4">Neural Output Log</p>
                         <p className="text-xs text-slate-400 font-mono leading-relaxed italic">
                           {`> calibrating questions to: Senior React Developer\n> resume artifacts identified: 12\n> difficulty set to: HARDCORE\n> initializing STT matrix...`}
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-8">The Neural Engine</p>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-10 leading-tight tracking-tighter">
                Not just another chatbot. <br/>
                <span className="text-slate-600">A rigorous performance sandbox.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium mb-12">
                Traditional interview prep relies on static questions and generic answers. We've built an engine that understands the context of your specific career path. 
                <br/><br/>
                Whether you're targeting a position in London or San Francisco, with 2 years or 20 years of experience, our AI adjusts the "Examiner's Mindset" to match the reality of the industry.
              </p>
              <Link to="/signup" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-2xl active:scale-95 inline-block text-center">
                Join the Network
              </Link>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="bg-indigo-600 p-20 rounded-[5rem] relative overflow-hidden text-center shadow-[0_40px_100px_rgba(79,70,229,0.3)] group">
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-125"></div>
             <div className="relative z-10">
                <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 leading-none tracking-tighter">Ready to stabilize your <br/> career trajectory?</h2>
                <Link 
                  to="/signup" 
                  className="inline-block bg-white text-indigo-600 px-16 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all active:scale-95"
                >
                  Create Identity →
                </Link>
             </div>
          </div>

        </div>
        
        <footer className="py-20 border-t border-white/5 text-center">
           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">Interview Sense AI Terminal • Protocol About v1.5</p>
        </footer>
      </div>
    </Layout>
  );
};

export default AboutPage;