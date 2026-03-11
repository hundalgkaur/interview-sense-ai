import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const CertificatePage = () => {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const { data } = await API.get(`/interview/public/certificate/${id}`);
        setCert(data);
      } catch (err) {
        setError("Certificate not found or private.");
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-black text-white mb-6 tracking-tighter">404: Link Expired</h1>
          <p className="text-slate-500 mb-10">This neural certificate is either private or has been decommissioned.</p>
          <Link to="/" className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Return to Base</Link>
        </div>
      </div>
    );
  }

  const scoreColor = cert.overallScore >= 7 ? "text-emerald-400" : cert.overallScore >= 4 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-indigo-500/30 font-sans py-20 px-6 overflow-hidden relative pt-24 lg:pt-32">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>
      
      <div className="max-w-5xl mx-auto page-transition">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Proficiency Matrix</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
            Neural Certification.
          </h1>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Interview Sense AI Assessment Terminal</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 lg:p-20 shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="mb-12">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Candidate Identity</p>
                <h2 className="text-4xl font-black text-white tracking-tight mb-2">{cert.userName}</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{cert.role} • {cert.experience}y Seniority</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Overall Score</p>
                  <p className={`text-6xl font-black tracking-tighter ${scoreColor}`}>{cert.overallScore.toFixed(1)}<span className="text-lg opacity-20 ml-1">/10</span></p>
                </div>
                <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Assessment Date</p>
                  <p className="text-xl font-black text-white mt-4">{new Date(cert.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Status</p>
                <p className="text-lg font-bold text-slate-200 leading-relaxed italic">
                  "This candidate has successfully completed a high-fidelity technical simulation. Their performance vectors align with industry-leading standards."
                </p>
              </div>
            </div>

            <div className="bg-black/20 rounded-[3.5rem] p-10 border border-white/5 aspect-square flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={cert.radarData}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  </RadarChart>
               </ResponsiveContainer>
               {/* Center Glow */}
               <div className="absolute inset-0 m-auto w-32 h-32 bg-indigo-600/10 rounded-full blur-[40px] -z-10"></div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
           <div className="p-12 bg-white text-black rounded-[3rem] shadow-3xl flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-left">
                 <h4 className="text-3xl font-black tracking-tighter mb-2">Test your own proficiency.</h4>
                 <p className="text-slate-500 font-medium">Initialize a neural simulation tailored to your profile.</p>
              </div>
              <Link to="/signup" className="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all shadow-2xl active:scale-95 whitespace-nowrap">
                 Initialize Terminal →
              </Link>
           </div>
           
           <div className="mt-12 opacity-30 grayscale flex justify-center items-center gap-8">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em]">Authored by Interview Sense AI</p>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em]">Neural Link v1.5</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;