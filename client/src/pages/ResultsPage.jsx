import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useInterview from "../hooks/useInterview";

const ResultsPage = () => {
  const { id } = useParams();
  const { getInterviewDetails, loading } = useInterview();
  const [interview, setInterview] = useState(null);

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

  if (loading || !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Generating Report...</p>
        </div>
      </div>
    );
  }

  const scoreColor = interview.overallScore >= 7 
    ? "text-emerald-600" 
    : interview.overallScore >= 4 
    ? "text-amber-600" 
    : "text-rose-600";

  const scoreBg = interview.overallScore >= 7 
    ? "bg-emerald-50" 
    : interview.overallScore >= 4 
    ? "bg-amber-50" 
    : "bg-rose-50";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <Link to="/dashboard" className="text-sm font-black text-blue-600 uppercase tracking-widest hover:opacity-70 transition mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Technical Proficiency Report</h1>
          <p className="text-gray-500 font-medium">{interview.role} • {interview.experience} Years EXP • {interview.country}</p>
        </div>
        <button className="px-6 py-3 bg-white border border-gray-100 text-gray-900 font-bold rounded-xl shadow-sm hover:shadow-md transition">
          Download PDF Report
        </button>
      </div>

      {/* Main Score & Summary */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-50/50 p-10 md:p-16 mb-16 border border-gray-50 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-32 -mt-32"></div>
        
        <div className="relative">
          <svg className="w-56 h-56 transform -rotate-90">
            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-50" />
            <circle
              cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - interview.overallScore / 10)}
              className={`${scoreColor} transition-all duration-1500 ease-out stroke-round`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-7xl font-black ${scoreColor}`}>{interview.overallScore.toFixed(1)}</span>
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Rating</span>
          </div>
        </div>

        <div className="flex-grow space-y-6 relative">
          <div className={`inline-block px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${scoreBg} ${scoreColor}`}>
            {interview.overallScore >= 8 ? "Advanced Proficiency" : interview.overallScore >= 5 ? "Intermediate" : "Beginner Level"}
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            {interview.overallScore >= 8 
              ? "You're ready for the big leagues!" 
              : interview.overallScore >= 6
              ? "Solid performance with room for growth."
              : "Focus on strengthening core concepts."}
          </h2>
          <p className="text-gray-500 text-xl leading-relaxed font-medium italic">
            {interview.overallScore >= 8 
              ? "Your technical responses show deep architectural understanding and clear professional communication. You're likely to pass most technical screens for this role."
              : interview.overallScore >= 6
              ? "You have a good grasp of the basics. To reach the next level, focus on providing more specific STAR-method examples and mentioning industry-standard tools."
              : "While you identified the key concepts, your answers lacked the depth required for this experience level. Review the ideal answers below to see what's missing."}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-12">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          Detailed Performance Log
          <div className="flex-grow h-[1px] bg-gray-100"></div>
        </h3>
        
        <div className="space-y-10">
          {interview.questions.map((q, index) => (
            <div key={index} className="group relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gray-50 group-hover:bg-blue-600 transition-colors rounded-full"></div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black">
                      {index + 1}
                    </span>
                    <div className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${
                      q.score >= 7 ? "bg-emerald-50 text-emerald-600" : q.score >= 4 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      Score: {q.score}/10
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 leading-tight">
                    {q.question}
                  </h4>
                </div>

                <div className="lg:w-2/3 space-y-6">
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Response</p>
                    <p className="text-gray-600 font-medium italic leading-relaxed whitespace-pre-line">
                      "{q.answer || "No response recorded."}"
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">AI Evaluation</p>
                    <p className="text-gray-700 font-bold leading-relaxed whitespace-pre-line text-sm">
                      {q.aiFeedback}
                    </p>
                  </div>

                  <div className="bg-emerald-50/30 rounded-2xl p-6 border border-emerald-100/50">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Recommended Answer Pattern</p>
                    <p className="text-emerald-900 font-bold leading-relaxed text-sm italic">
                      "{q.idealAnswer}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 text-center pb-20">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Want to improve this score?</h4>
        <Link
          to="/interview"
          className="px-12 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1 active:scale-95 inline-block"
        >
          Take Another Mock Interview →
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
