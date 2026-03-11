import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/layout/Layout";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await API.get("/questions");
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[#050505] selection:bg-indigo-500/30 font-sans py-20 px-6 pt-24 lg:pt-32">
        <div className="max-w-7xl mx-auto page-transition">
          
          {/* Header */}
          <div className="mb-24 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-10">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Intelligence Repository</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              Intelligence <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">Vault.</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
              Browse thousands of AI-generated technical challenges and behavioral artifacts from real simulation sessions.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
              <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Decrypting Vault Data...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-40 bg-white/[0.02] rounded-[4rem] border border-white/5">
               <p className="text-slate-500 font-black uppercase tracking-widest text-xs">The Vault is currently empty. Start a simulation to populate it.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {questions.map((q) => (
                <div key={q._id} className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[3.5rem] group hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div>
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                        q.type === 'coding' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                      }`}>
                        {q.type}
                      </span>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                        {q.role} • {q.experience}y Exp
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white leading-tight mb-10 group-hover:text-indigo-400 transition-colors">
                      "{q.text}"
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Added {new Date(q.createdAt).toLocaleDateString()}</p>
                    <Link to="/login" className="text-indigo-500 font-black text-[9px] uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-2 group/link">
                      Login to Practice <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-32 text-center">
             <div className="inline-block p-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[2.5rem]">
                <div className="bg-[#050505] px-16 py-8 rounded-[2.4rem]">
                   <p className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-4">Neural Data Capture</p>
                   <p className="text-slate-500 text-sm font-medium">New intelligence is added to the vault with every simulation started.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionsPage;