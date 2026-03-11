import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useInterview from "../hooks/useInterview";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import html2pdf from 'html2pdf.js';

const ResultsPage = () => {
  const { id } = useParams();
  const { getInterviewDetails, loading } = useInterview();
  const [interview, setInterview] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getInterviewDetails(id);
        setInterview(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [id]);

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin: [10, 10],
      filename: `Interview_Report_${interview.role.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#050505' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    setIsDownloading(true);
    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    });
  };

  if (loading || !interview) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center page-transition">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Assembling Neural Proficiency Data...</p>
        </div>
      </div>
    );
  }

  const scoreColor = interview.overallScore >= 7 ? "text-emerald-400" : interview.overallScore >= 4 ? "text-amber-400" : "text-rose-400";
  const scoreBg = interview.overallScore >= 7 ? "bg-emerald-500/10 border-emerald-500/20" : interview.overallScore >= 4 ? "bg-amber-500/10 border-amber-500/20" : "bg-rose-500/10 border-rose-500/20";

  const analyzeCommunication = () => {
    let fillerCount = 0;
    let totalWords = 0;
    const fillerWords = ["um", "uh", "like", "basically", "actually", "literally", "obviously"];
    interview.questions.forEach(q => {
      if (q.answer && q.type !== 'coding') {
        const words = q.answer.toLowerCase().split(/\s+/);
        totalWords += words.length;
        words.forEach(word => {
          const cleanWord = word.replace(/[^a-z]/g, '');
          if (fillerWords.includes(cleanWord)) fillerCount++;
        });
        const youKnows = (q.answer.toLowerCase().match(/\byou know\b/g) || []).length;
        fillerCount += youKnows;
      }
    });
    const clarityScore = totalWords === 0 ? 10 : Math.max(0, 10 - (fillerCount / totalWords) * 100).toFixed(1);
    return { fillerCount, totalWords, clarityScore };
  };

  const commStats = analyzeCommunication();

  const radarData = [
    { subject: 'Technical', score: interview.questions[0]?.score || interview.overallScore, fullMark: 10 },
    { subject: 'Logic', score: interview.questions[1]?.score || interview.overallScore, fullMark: 10 },
    { subject: 'Comm', score: parseFloat(commStats.clarityScore) || interview.overallScore, fullMark: 10 },
    { subject: 'Exp', score: interview.questions[3]?.score || interview.overallScore, fullMark: 10 },
    { subject: 'Standard', score: interview.questions[4]?.score || interview.overallScore, fullMark: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-indigo-500/30 font-sans pt-24 lg:pt-32">
      <div className="max-w-6xl mx-auto px-6 py-20 page-transition" id="report-content">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10">
          <div>
            <Link to="/dashboard" data-html2canvas-ignore="true" className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] hover:text-white transition-all mb-6 inline-block">
              ← Simulation Terminal
            </Link>
            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-4">Proficiency Report.</h1>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
              {interview.role} • {interview.experience}y EXP • {interview.country}
            </p>
          </div>
          <button 
            onClick={downloadPDF}
            disabled={isDownloading}
            data-html2canvas-ignore="true"
            className="bg-white text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-2xl active:scale-95"
          >
            {isDownloading ? "Generating PDF..." : "Export Neural Report →"}
          </button>
        </div>

        {/* Summary Matrix Section */}
        <div className="bg-white/[0.03] backdrop-blur-2xl p-10 md:p-16 mb-16 rounded-[4rem] border border-white/10 shadow-3xl flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
          
          <div className="shrink-0 relative group">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle cx="128" cy="128" r="115" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
              <circle
                cx="128" cy="128" r="115" stroke="currentColor" strokeWidth="16" fill="transparent"
                strokeDasharray={2 * Math.PI * 115}
                strokeDashoffset={2 * Math.PI * 115 * (1 - interview.overallScore / 10)}
                className={`transition-all duration-[3000ms] ease-out stroke-round ${scoreColor.replace('text-', 'stroke-')}`}
                style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-8xl font-black tracking-tighter ${scoreColor}`}>{interview.overallScore.toFixed(1)}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Rating</span>
            </div>
          </div>

          <div className="w-full lg:w-1/3 h-72 shrink-0 bg-white/[0.02] rounded-[3rem] p-6 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-grow space-y-8">
            <div className={`inline-block px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] ${scoreBg} ${scoreColor} border`}>
              {interview.overallScore >= 8 ? "Advanced Proficiency" : interview.overallScore >= 5 ? "Intermediate Tier" : "Entry Level Signal"}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              {interview.overallScore >= 8 
                ? "Exceptional performance. You are market-ready." 
                : interview.overallScore >= 6
                ? "Strong foundation with specific growth areas."
                : "Further conceptual synthesis recommended."}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium italic border-l-2 border-indigo-500/30 pl-8">
              {interview.overallScore >= 8 
                ? "Your technical vectors align with architectural leadership standards. Communication is authoritative and high-signal."
                : interview.overallScore >= 6
                ? "Core modules are functional. Suggest increasing granularity in your technical implementation explanations."
                : "Latency detected in conceptual retrieval. Review the gold standard responses to re-initialize your knowledge base."}
            </p>
          </div>
        </div>

        {/* Communication Behavioral Section */}
        <div className="bg-white/[0.03] p-12 md:p-16 mb-20 rounded-[4rem] border border-white/10 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10"></div>
          
          <div className="flex-grow relative z-10 w-full">
            <h3 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-4 mb-12">
              <span className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl text-white shadow-2xl shadow-indigo-500/30">🎙️</span> 
              Behavioral Stream Analysis
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="bg-white/[0.02] rounded-[2.5rem] p-10 border border-white/5 shadow-inner">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Clarity Factor</p>
                <p className="text-5xl font-black text-white tracking-tighter">{commStats.clarityScore}<span className="text-lg opacity-20 ml-1">/10</span></p>
              </div>
              <div className="bg-white/[0.02] rounded-[2.5rem] p-10 border border-white/5 shadow-inner">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Token Volume</p>
                <p className="text-5xl font-black text-white tracking-tighter">{commStats.totalWords}</p>
              </div>
              <div className={`rounded-[2.5rem] p-10 border shadow-inner ${commStats.fillerCount > 5 ? 'bg-rose-500/5 border-rose-500/10' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${commStats.fillerCount > 5 ? 'text-rose-500' : 'text-emerald-500'}`}>Filler Artifacts</p>
                <p className="text-5xl font-black text-white tracking-tighter">{commStats.fillerCount}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 bg-[#0a0a0a] rounded-[3.5rem] p-10 text-white shadow-3xl border border-white/5 relative z-10">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Neural Coach Verdict</p>
            <p className="text-xl font-bold leading-relaxed mb-8 text-slate-200">
              {commStats.clarityScore >= 9.0 
                ? "Max clarity achieved. Minimal verbal noise detected in the stream." 
                : commStats.clarityScore >= 7.5
                ? "Nominal performance. Stream stabilization recommended for high-stakes scenarios."
                : "High signal-to-noise ratio. Practice thought structuring using the STAR method."}
            </p>
            {commStats.fillerCount > 0 && (
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-loose">
                Artifacts identified: <span className="text-indigo-500 italic">um, uh, like, basically</span>
              </p>
            )}
          </div>
        </div>

        {/* Question History Breakdown */}
        <div className="space-y-16">
          <div className="flex items-center gap-6 mb-20">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] whitespace-nowrap">Neural Session Log</h3>
            <div className="flex-grow h-px bg-white/5"></div>
          </div>
          
          <div className="space-y-24">
            {interview.questions.map((q, index) => (
              <div key={index} className="group relative">
                <div className="flex flex-col lg:flex-row gap-16">
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center text-xl font-black shadow-2xl shadow-indigo-500/20">
                        {index + 1}
                      </span>
                      <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border ${
                        q.score >= 7 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : q.score >= 4 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}>
                        Rating: {q.score}/10
                      </div>
                    </div>
                    <h4 className="text-3xl font-black text-white leading-tight tracking-tight group-hover:text-indigo-500 transition-colors duration-500">
                      {q.question}
                    </h4>
                  </div>

                  <div className="lg:w-2/3 space-y-10">
                    <div className="bg-white/[0.02] rounded-[3rem] p-10 border border-white/5 shadow-inner">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">User Input Stream</p>
                      <p className="text-slate-300 font-medium italic leading-relaxed text-xl">
                        "{q.answer || "No data detected."}"
                      </p>
                    </div>
                    
                    <div className="bg-white/[0.05] rounded-[3rem] p-10 border border-white/10 shadow-2xl">
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Neural Evaluation</p>
                      <p className="text-slate-100 font-bold leading-relaxed whitespace-pre-line text-lg">
                        {q.aiFeedback}
                      </p>
                    </div>

                    <div className="bg-emerald-500/5 rounded-[3rem] p-10 border border-emerald-500/10">
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Gold Standard Synthesis</p>
                      <p className="text-emerald-50 font-black leading-relaxed text-2xl italic opacity-70">
                        "{q.idealAnswer}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-40 text-center pb-20" data-html2canvas-ignore="true">
          <div className="max-w-2xl mx-auto mb-20 p-12 bg-white/[0.03] border border-white/10 rounded-[3rem] backdrop-blur-xl shadow-3xl">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Viral Growth Protocol</p>
            <h4 className="text-3xl font-black text-white tracking-tighter mb-4">Share Your Proficiency.</h4>
            <p className="text-slate-500 mb-10 font-medium leading-relaxed">Broadcast your neural certification to your professional network. High scores drive 3x more profile views.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="relative group/tooltip">
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/certificate/${interview._id}`;
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="bg-[#0077b5] text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-90 transition-all active:scale-95"
                >
                  <span>in</span> Share to LinkedIn
                </button>
                {window.location.hostname === 'localhost' && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-slate-900 border border-white/10 rounded-2xl text-[9px] text-slate-400 font-bold leading-relaxed opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
                    <span className="text-amber-500">Note:</span> LinkedIn cannot generate a preview for 'localhost'. This will work perfectly once you deploy to a public URL.
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/certificate/${interview._id}`;
                  navigator.clipboard.writeText(url);
                  alert("Neural link copied to clipboard!");
                }}
                className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3"
              >
                📋 Copy Public Link
              </button>
            </div>
          </div>

          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-12">Evolve your capabilities further.</p>
          <Link
            to="/interview"
            className="bg-indigo-600 text-white px-20 py-7 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-2 active:scale-95"
          >
            Re-Initialize Terminal →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;