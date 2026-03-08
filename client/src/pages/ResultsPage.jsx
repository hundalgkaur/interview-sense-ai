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
      html2canvas: { scale: 2, useCORS: true, logging: false },
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
      <div className="min-h-screen flex items-center justify-center page-transition">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Assembling Proficiency Data...</p>
        </div>
      </div>
    );
  }

  const scoreColor = interview.overallScore >= 7 ? "text-emerald-600" : interview.overallScore >= 4 ? "text-amber-600" : "text-rose-600";
  const scoreBg = interview.overallScore >= 7 ? "bg-emerald-50" : interview.overallScore >= 4 ? "bg-amber-50" : "bg-rose-50";

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
    <div className="max-w-6xl mx-auto px-6 py-16 page-transition" id="report-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <Link to="/dashboard" data-html2canvas-ignore="true" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:opacity-70 transition mb-4 inline-block">
            ← Simulation Terminal
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Proficiency Analysis</h1>
          <p className="text-slate-500 font-medium">{interview.role} • {interview.experience} Years EXP • {interview.country}</p>
        </div>
        <button 
          onClick={downloadPDF}
          disabled={isDownloading}
          data-html2canvas-ignore="true"
          className="btn-secondary px-8 py-4 text-xs uppercase tracking-widest"
        >
          {isDownloading ? "Generating PDF..." : "Download Report PDF"}
        </button>
      </div>

      {/* Summary Section */}
      <div className="card-base p-8 md:p-16 mb-16 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="shrink-0 relative">
          <svg className="w-56 h-56 transform -rotate-90">
            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
            <circle
              cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - interview.overallScore / 10)}
              className={`${scoreColor} transition-all duration-2000 ease-out stroke-round shadow-lg`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-7xl font-black ${scoreColor}`}>{interview.overallScore.toFixed(1)}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
          </div>
        </div>

        <div className="w-full lg:w-1/3 h-64 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-grow space-y-6">
          <div className={`inline-block px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${scoreBg} ${scoreColor} border border-current opacity-50`}>
            {interview.overallScore >= 8 ? "Advanced" : interview.overallScore >= 5 ? "Intermediate" : "Entry Level"}
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {interview.overallScore >= 8 
              ? "Exceptional performance. You are market-ready." 
              : interview.overallScore >= 6
              ? "Strong foundation with specific growth areas."
              : "Further conceptual synthesis recommended."}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed font-medium italic border-l-4 border-slate-100 pl-8">
            {interview.overallScore >= 8 
              ? "Your technical vectors align with architectural leadership standards. Communication is clear and authoritative."
              : interview.overallScore >= 6
              ? "Core modules are functional. Suggest increasing granularity in your implementation explanations."
              : "Latency detected in conceptual retrieval. Review the gold standard responses to re-initialize your knowledge base."}
          </p>
        </div>
      </div>

      {/* Communication Section */}
      <div className="card-base p-10 md:p-12 mb-16 border-indigo-100 bg-indigo-50/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="flex-grow relative z-10">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-8">
            <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-lg text-white shadow-lg">🎙️</span> 
            Communication Behavioral Analysis
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Clarity Vector</p>
              <p className="text-4xl font-black text-slate-900">{commStats.clarityScore}<span className="text-lg opacity-20 ml-1">/10</span></p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Token Count</p>
              <p className="text-4xl font-black text-slate-900">{commStats.totalWords}</p>
            </div>
            <div className={`rounded-2xl p-6 border shadow-sm ${commStats.fillerCount > 5 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${commStats.fillerCount > 5 ? 'text-rose-600' : 'text-emerald-600'}`}>Filler Artifacts</p>
              <p className="text-4xl font-black text-slate-900">{commStats.fillerCount}</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative z-10">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Coach Verdict</p>
          <p className="text-lg font-bold leading-relaxed mb-6">
            {commStats.clarityScore >= 9.0 
              ? "Max clarity achieved. Minimal verbal noise detected." 
              : commStats.clarityScore >= 7.5
              ? "Nominal performance. Stream stabilization recommended."
              : "High signal-to-noise ratio. Practice thought structuring."}
          </p>
          {commStats.fillerCount > 0 && (
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Artifacts identified: <span className="text-indigo-400 italic">um, uh, like, basically</span>
            </p>
          )}
        </div>
      </div>

      {/* Question Breakdown */}
      <div className="space-y-12">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-4">
          Neural History Log
          <div className="flex-grow h-[1px] bg-slate-100"></div>
        </h3>
        
        <div className="space-y-12">
          {interview.questions.map((q, index) => (
            <div key={index} className="group relative">
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black shadow-lg">
                      {index + 1}
                    </span>
                    <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      q.score >= 7 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : q.score >= 4 ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      Rating: {q.score}/10
                    </div>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
                    {q.question}
                  </h4>
                </div>

                <div className="lg:w-2/3 space-y-8">
                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-inner">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Input Stream</p>
                    <p className="text-slate-600 font-medium italic leading-relaxed text-lg">
                      "{q.answer || "No data detected."}"
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-4">Examiner Analysis</p>
                    <p className="text-slate-800 font-bold leading-relaxed whitespace-pre-line text-lg">
                      {q.aiFeedback}
                    </p>
                  </div>

                  <div className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-4">Ideal Synthesis Pattern</p>
                    <p className="text-emerald-900 font-black leading-relaxed text-xl italic opacity-80">
                      "{q.idealAnswer}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 text-center pb-20" data-html2canvas-ignore="true">
        <h4 className="text-xl font-bold text-slate-900 mb-8">Evolve your capabilities.</h4>
        <Link
          to="/interview"
          className="btn-primary px-12 py-5"
        >
          Initialize New Simulation →
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
