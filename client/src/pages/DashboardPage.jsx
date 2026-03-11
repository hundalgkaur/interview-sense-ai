import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useInterview from "../hooks/useInterview";

const DashboardPage = () => {
  const { user } = useAuth();
  const { interviews, loading, fetchInterviews, deleteInterview } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to purge this simulation record? This action is irreversible.")) {
      await deleteInterview(id);
    }
  };

  const averageScore = interviews.length > 0
    ? (interviews.reduce((acc, i) => acc + i.overallScore, 0) / interviews.length).toFixed(1)
    : "0";

  const pendingInterviews = interviews.filter(i => !i.isCompleted);
  const completedInterviews = interviews.filter(i => i.isCompleted);

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-indigo-500/30 font-sans pt-24 lg:pt-32">
      <div className="max-w-7xl mx-auto px-6 py-20 page-transition">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Identity Verified</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-4">
              Welcome back, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">{user?.name?.split(' ')[0] || "Operator"}</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
              Your proficiency metrics are stabilizing. <span className="text-white font-bold">{completedInterviews.length}</span> simulations completed across your career trajectory.
            </p>
          </div>
          
          <Link 
            to="/interview" 
            className="bg-white text-black px-12 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:-translate-y-1 active:scale-95 whitespace-nowrap"
          >
            Launch New Terminal →
          </Link>
        </div>

        {/* Intelligence Matrix (Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { label: 'Neural Syncs', val: interviews.length, icon: '📡', color: 'text-indigo-400', bg: 'bg-indigo-500/5 border-indigo-500/10' },
            { label: 'Mean Proficiency', val: `${averageScore}/10`, icon: '🎯', color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/10' },
            { label: 'System Status', val: 'Active', icon: '⚡', color: 'text-violet-400', bg: 'bg-violet-500/5 border-violet-500/10' }
          ].map((stat, i) => (
            <div key={i} className={`p-10 rounded-[3rem] border transition-all hover:-translate-y-1 duration-500 group ${stat.bg}`}>
              <div className={`text-3xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
              <h3 className="text-5xl font-black text-white leading-none tracking-tighter">
                {stat.val}
              </h3>
            </div>
          ))}
        </div>

        {/* Active Protocols (Pending) */}
        {pendingInterviews.length > 0 && (
          <div className="mb-24 animate-fade-in">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] whitespace-nowrap">Active Connections</h2>
              <div className="flex-grow h-px bg-white/5"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingInterviews.map((interview) => (
                <div key={interview._id} className="bg-white/[0.03] backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 group hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h3 className="font-black text-white text-2xl tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">{interview.role}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{interview.country}</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-lg border border-amber-500/20">Resume</span>
                  </div>

                  <div className="space-y-4 mb-10 relative z-10">
                    <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      <span>Neural Completion</span>
                      <span>{Math.round((interview.questions.filter(q => q.answer).length / interview.questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
                        style={{ width: `${(interview.questions.filter(q => q.answer).length / interview.questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-3 relative z-10">
                    <button
                      onClick={() => navigate(`/interview?resume=${interview._id}`)}
                      className="flex-grow py-5 bg-white text-black font-black rounded-2xl transition-all border border-transparent text-[9px] uppercase tracking-[0.3em] hover:bg-slate-200 shadow-xl"
                    >
                      Re-establish Link
                    </button>
                    <button
                      onClick={() => handleDelete(interview._id)}
                      className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-90"
                      title="Purge Record"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical Archives */}
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] border border-white/10 overflow-hidden shadow-3xl animate-fade-in">
          <div className="px-12 py-12 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Historical Archives</h2>
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Count: {completedInterviews.length}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] border-b border-white/5">
                  <th className="px-12 py-8">Operation Profile</th>
                  <th className="px-12 py-8">Exp Seniority</th>
                  <th className="px-12 py-8 text-center">Score</th>
                  <th className="px-12 py-8">Timestamp</th>
                  <th className="px-12 py-8 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-12 py-32 text-center">
                      <div className="flex flex-col items-center gap-8">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Querying Neural Records...</p>
                      </div>
                    </td>
                  </tr>
                ) : completedInterviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-12 py-40 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="text-6xl mb-10 grayscale opacity-20 filter drop-shadow-2xl">📡</div>
                        <h4 className="text-3xl font-black text-white mb-4 tracking-tighter">Vault Empty.</h4>
                        <p className="text-slate-500 font-medium mb-12 text-lg leading-relaxed">Initialize your first assessment to begin generating proficiency data and historical records.</p>
                        <Link 
                          to="/interview" 
                          className="inline-block bg-white text-black px-12 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-200 transition-all"
                        >
                          Initiate First assessment
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  completedInterviews.map((interview) => (
                    <tr key={interview._id} className="group hover:bg-white/[0.02] transition-all duration-300">
                      <td className="px-12 py-10">
                        <p className="font-black text-white text-xl tracking-tight group-hover:text-indigo-400 transition-colors">{interview.role}</p>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">{interview.country}</p>
                      </td>
                      <td className="px-12 py-10">
                        <span className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {interview.experience}y Seniority
                        </span>
                      </td>
                      <td className="px-12 py-10 text-center">
                        <span className={`inline-flex items-center justify-center w-14 h-14 rounded-[1.25rem] font-black text-2xl border ${
                          interview.overallScore >= 7 
                            ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                            : 'text-rose-400 border-rose-500/20 bg-rose-500/5'
                        }`}>
                          {interview.overallScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {new Date(interview.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-12 py-10 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            to={`/results/${interview._id}`}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl transition-all border border-white/10 text-[9px] uppercase tracking-widest group/btn active:scale-95"
                          >
                            Review Analysis <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(interview._id)}
                            className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-90"
                            title="Purge Record"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;