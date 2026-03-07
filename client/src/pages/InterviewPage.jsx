import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInterview from "../hooks/useInterview";

const InterviewPage = () => {
  // Setup state
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState("");
  
  // Interview state
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [localError, setLocalError] = useState(null);

  const { startNewInterview, submitInterviewAnswer, loading } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/login");
    }
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const data = await startNewInterview(role, country, parseInt(experience));
      setInterview(data);
    } catch (err) {
      setLocalError(err.response?.data?.message || "Failed to start interview. Check if server is running.");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    try {
      setIsEvaluating(true);
      const data = await submitInterviewAnswer(interview._id, currentQuestionIndex, answer);
      setFeedback(data);
      setIsEvaluating(false);
    } catch (err) {
      setIsEvaluating(false);
      console.error(err);
    }
  };

  const handleNextQuestion = () => {
    if (feedback?.isCompleted) {
      navigate(`/results/${interview._id}`);
    } else {
      setFeedback(null);
      setAnswer("");
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // 1. Setup Form View
  if (!interview) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-8">
                🎯
              </div>
              <h1 className="text-4xl font-black mb-6 tracking-tight">Configure Your Session</h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Our AI will generate custom technical questions based on your specific career profile and target market.
              </p>
              
              <ul className="space-y-4">
                {['Custom Questions', 'Real-time AI Feedback', 'Performance Scoring', 'Regional Context'].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest">
                    <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 text-blue-200 text-xs font-bold uppercase tracking-widest">
              Powered by Google Gemini 1.5 Flash
            </div>
          </div>
          
          <div className="md:w-1/2 p-12">
            {localError && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                <span className="text-lg">⚠️</span> {localError}
              </div>
            )}

            <form onSubmit={handleStart} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Target Job Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. USA"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Experience</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Years"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating Questions...
                  </div>
                ) : "Start Interview Now →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Interview View
  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header & Progress */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">LIVE SESSION</span>
            <span className="text-gray-400 font-bold text-sm tracking-tight">{interview.role} • {interview.experience} Years EXP</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Question {currentQuestionIndex + 1} of {interview.questions.length}</h2>
        </div>
        <div className="w-full md:w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overall Progress</span>
            <span className="text-sm font-black text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-10 md:p-16">
          <h3 className="text-3xl font-black text-gray-900 mb-12 leading-tight">
            "{currentQuestion.question}"
          </h3>

          {!feedback ? (
            <div className="space-y-8">
              <div className="relative">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Structure your answer clearly using technical examples..."
                  className="w-full h-80 px-8 py-8 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-xl font-medium text-gray-800 resize-none shadow-inner"
                ></textarea>
                <div className="absolute bottom-6 right-8 text-xs font-bold text-gray-300 uppercase tracking-widest">
                  Minimum 20 words recommended
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-gray-400 text-sm font-medium italic">
                  Take your time. You can't edit your answer after submitting.
                </div>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !answer.trim()}
                  className="px-12 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-xl disabled:opacity-50 active:scale-95"
                >
                  {isEvaluating ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Evaluating...
                    </div>
                  ) : "Submit Answer →"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-lg shadow-blue-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">AI Proficiency Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black">{feedback.score}</span>
                    <span className="text-xl font-bold opacity-40">/10</span>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-gray-900 p-8 rounded-[2rem] text-white shadow-lg shadow-gray-100">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-blue-400">Examiner Feedback</p>
                   <p className="text-lg font-medium leading-relaxed whitespace-pre-line text-gray-200">{feedback.aiFeedback}</p>
                </div>
              </div>

              <div className="bg-emerald-50 p-10 rounded-[2rem] border border-emerald-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-emerald-700">Ideal Professional Answer</p>
                <p className="text-xl font-bold text-emerald-900 leading-relaxed italic">"{feedback.idealAnswer}"</p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextQuestion}
                  className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-100 hover:-translate-y-1 active:scale-95"
                >
                  {feedback.isCompleted ? "Finish & View Results →" : "Continue to Next Question →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
