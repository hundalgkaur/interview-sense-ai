import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useInterview from "../hooks/useInterview";

const DashboardPage = () => {
  const { user } = useAuth();
  const { interviews, loading, fetchInterviews } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const averageScore = interviews.length > 0
    ? (interviews.reduce((acc, i) => acc + i.overallScore, 0) / interviews.length).toFixed(1)
    : "0";

  const pendingInterviews = interviews.filter(i => !i.isCompleted);
  const completedInterviews = interviews.filter(i => i.isCompleted);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3">
            Neural Dashboard, <span className="text-neon-purple neon-text-glow">{user?.name?.split(' ')[0] || "User"}</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
            Identity verified • <span className="text-neon-cyan">{completedInterviews.length}</span> simulations completed
          </p>
        </div>
        <Link to="/interview" className="btn-neon">
          Initialize New Session
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { label: 'Neural Syncs', val: interviews.length, icon: '📝', color: 'text-neon-purple' },
          { label: 'Mean Proficiency', val: `${averageScore}/10`, icon: '🎯', color: 'text-neon-cyan' },
          { label: 'Status', val: 'PRODUCTION READY', icon: '🔥', color: 'text-neon-pink' }
        ].map((stat, i) => (
          <div key={i} className="glass-container p-10 neon-border group">
            <div className={`text-2xl mb-8 ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="terminal-label">{stat.label}</p>
            <h3 className="text-4xl font-black text-white leading-none tracking-tight">
              {stat.val}
            </h3>
          </div>
        ))}
      </div>

      {/* Pending Interviews */}
      {pendingInterviews.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
            <h2 className="text-xs font-black text-white uppercase tracking-[0.4em]">Active Connections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingInterviews.map((interview) => (
              <div key={interview._id} className="glass-container p-8 border-amber-500/20 group hover:border-amber-500/40">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-white text-xl tracking-tight mb-1 group-hover:text-neon-purple transition-colors">{interview.role}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{interview.country}</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded border border-amber-500/20">RESUME</span>
                </div>
                <div className="flex items-center gap-3 mb-8">
                   <div className="flex-grow bg-white/5 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(interview.questions.filter(q => q.answer).length / interview.questions.length) * 100}%` }}
                      ></div>
                   </div>
                   <span className="text-[9px] font-black text-slate-500">
                     {interview.questions.filter(q => q.answer).length}/{interview.questions.length}
                   </span>
                </div>
                <button
                  onClick={() => navigate(`/interview?resume=${interview._id}`)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl transition-all border border-white/10 text-[10px] uppercase tracking-widest"
                >
                  Reconnect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed History */}
      <div className="glass-container overflow-hidden border-white/5">
        <div className="px-10 py-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Historical Archives</h2>
          <button className="text-[10px] font-black text-neon-cyan uppercase tracking-widest hover:text-white transition">Full Log</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em]">
                <th className="px-10 py-6">Operation Profile</th>
                <th className="px-10 py-6">Seniority</th>
                <th className="px-10 py-6 text-center">Score</th>
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-10 py-6 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-10 h-10 border-2 border-white/5 border-t-neon-purple rounded-full animate-spin"></div>
                      <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-[9px]">Querying Neural Records...</p>
                    </div>
                  </td>
                </tr>
              ) : completedInterviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="text-5xl mb-8 grayscale opacity-20">📡</div>
                      <h4 className="text-2xl font-black text-white mb-3 tracking-tight">System Empty</h4>
                      <p className="text-slate-600 font-medium mb-10 text-sm">Perform your first simulation to generate intelligence data.</p>
                      <Link to="/interview" className="btn-neon inline-block">Initiate</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                completedInterviews.map((interview) => (
                  <tr key={interview._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-8">
                      <p className="font-black text-white text-lg tracking-tight group-hover:text-neon-purple transition-colors">{interview.role}</p>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mt-1">{interview.country}</p>
                    </td>
                    <td className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                      {interview.experience} Years
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-black text-xl border border-white/5 ${
                        interview.overallScore >= 7 ? 'text-neon-cyan bg-neon-cyan/5' : 'text-neon-pink bg-neon-pink/5'
                      }`}>
                        {interview.overallScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-xs font-bold text-slate-500">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <Link
                        to={`/results/${interview._id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-neon-purple text-white font-black rounded-xl transition-all border border-white/5 text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 shadow-xl"
                      >
                        Analysis <span>→</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
