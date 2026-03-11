import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useInterview from "../hooks/useInterview";
import Editor from "@monaco-editor/react";

const InterviewPage = () => {
  // Setup state
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState("");
  const [persona, setPersona] = useState("standard");
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Interview state
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [followUpQuestion, setFollowUpQuestion] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userStreak, setUserStreak] = useState(0);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef(null);

  const { startNewInterview, submitInterviewAnswer, uploadResume, getInterviewDetails, loading } = useInterview();
  const navigate = useNavigate();

  // Timer Logic
  useEffect(() => {
    if (interview && !feedback && !isEvaluating) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitAnswer(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interview, currentQuestionIndex, feedback, isEvaluating]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- AI Speaking (TTS) Logic ---
  const speak = (text) => {
    if (isMuted || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Natural')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger speech
  useEffect(() => {
    if (interview && !feedback) {
      const currentQuestion = interview.questions[currentQuestionIndex];
      if (currentQuestion.type === "coding" && !answer) {
        setAnswer(currentQuestion.initialCode || "// Start coding here...");
      }
      const timer = setTimeout(() => speak(followUpQuestion || currentQuestion.question), 600);
      return () => clearTimeout(timer);
    }
    if (followUpQuestion) {
      const timer = setTimeout(() => speak(followUpQuestion), 600);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, interview, feedback, followUpQuestion, isMuted]);

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setAnswer(prev => {
           if (prev.endsWith(finalTranscript.trim())) return prev;
           return prev + ' ' + finalTranscript;
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      recognition.stop();
    } else {
      if (!recognition) {
        alert("Voice recognition is not supported in your browser.");
        return;
      }
      recognition.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/login");
      return;
    }
    const queryParams = new URLSearchParams(window.location.search);
    const resumeId = queryParams.get('resume');
    
    // Auto-fill from Chrome Extension
    const extRole = queryParams.get('ext_role');
    if (extRole) {
      setRole(decodeURIComponent(extRole));
    }

    if (resumeId) {
      const loadPending = async () => {
        try {
          const data = await getInterviewDetails(resumeId);
          const unansweredIndex = data.questions.findIndex(q => !q.answer);
          setInterview(data);
          setCurrentQuestionIndex(unansweredIndex !== -1 ? unansweredIndex : 0);
          setTimeLeft(300);
        } catch (err) {
          setLocalError("Could not load simulation.");
        }
      };
      loadPending();
    }
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      let resumeText = "";
      if (resumeFile) {
        setIsUploading(true);
        resumeText = await uploadResume(resumeFile);
        setIsUploading(false);
      }
      const data = await startNewInterview(role, country, parseInt(experience), resumeText, persona);
      setInterview(data);
      setTimeLeft(300);
    } catch (err) {
      setIsUploading(false);
      setLocalError(err.response?.data?.message || "Failed to start simulation.");
    }
  };

  const handleSubmitAnswer = async (isAutoSubmit = false) => {
    if (!isAutoSubmit && !answer.trim()) return;
    
    if (isRecording) {
      setIsRecording(false);
      if (recognition) recognition.stop();
    }

    try {
      setIsEvaluating(true);
      const data = await submitInterviewAnswer(interview._id, currentQuestionIndex, answer || "No answer provided due to timeout.");
      if (data.followUp && !followUpQuestion) {
        setFollowUpQuestion(data.followUp);
        setAnswer("");
        setTimeLeft(120);
      } else {
        setFeedback(data);
        setFollowUpQuestion(null);
        if (data.streak) setUserStreak(data.streak);
      }
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
      setFollowUpQuestion(null);
      setAnswer("");
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(300);
    }
  };

  // 1. Setup View
  if (!interview) {
    return (
      <div className="min-h-screen bg-[#050505] selection:bg-indigo-500/30 font-sans pt-24 lg:pt-32">
        <div className="max-w-6xl mx-auto px-6 py-20 page-transition">
          <div className="flex items-center justify-between mb-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-all group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Exit Terminal
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Online</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-5/12">
              <p className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Simulation Config</p>
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
                Neural <br/> Terminal.
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed font-medium mb-12 max-w-sm">
                Define your professional parameters to initialize a high-fidelity interview simulation.
              </p>
              
              <div className="space-y-6">
                {[
                  { label: 'Intelligence', value: 'Gemini 1.5 Pro' },
                  { label: 'Latency', value: '< 200ms' },
                  { label: 'Modules', value: 'TTS / STT / Code' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-xs font-black text-white uppercase tracking-widest">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-7/12 w-full">
              <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
                
                {localError && (
                  <div className="mb-10 p-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-shake">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center">!</span>
                    {localError}
                  </div>
                )}

                <form onSubmit={handleStart} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Position</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Frontend Lead"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Examiner Persona</label>
                      <select
                        value={persona}
                        onChange={(e) => setPersona(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
                      >
                        <option value="standard" className="bg-[#0a0a0a]">Standard Professional</option>
                        <option value="bar-raiser" className="bg-[#0a0a0a]">FAANG Bar-Raiser</option>
                        <option value="startup" className="bg-[#0a0a0a]">Startup Founder</option>
                        <option value="mentor" className="bg-[#0a0a0a]">The Mentor</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Region</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. UK"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Exp Years</label>
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Knowledge Base (PDF Resume)</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label 
                        htmlFor="resume-upload"
                        className={`flex items-center justify-between w-full px-8 py-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                          resumeFile ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-500" : "border-white/10 bg-white/5 text-slate-500 hover:border-indigo-500/30 hover:bg-white/10"
                        }`}
                      >
                        <span className="font-black text-[10px] uppercase tracking-widest">
                          {resumeFile ? resumeFile.name : "Inject Resume Metadata"}
                        </span>
                        <span className="text-xl opacity-50">{resumeFile ? "✓" : "+"}</span>
                      </label>
                      {resumeFile && (
                        <button 
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-white text-black rounded-full text-xs font-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isUploading}
                    className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isUploading ? "Injecting Data..." : loading ? "Initializing Neural Link..." : "Start Assessment →"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Session View
  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <div className={`min-h-screen bg-[#050505] selection:bg-indigo-500/30 font-sans transition-all duration-700`}>
      <div className={`mx-auto px-6 py-12 page-transition ${currentQuestion.type === "coding" && !feedback ? "max-w-[98%] lg:px-12" : "max-w-6xl"}`}>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-indigo-500/20">Input Active</span>
              <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{interview.role} • {interview.persona} Persona</span>
              {userStreak > 0 && (
                <span className="px-4 py-1.5 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-rose-500/20 animate-pulse">
                  🔥 {userStreak} Day Streak
                </span>
              )}
              {!feedback && (
                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border flex items-center gap-3 transition-all ${
                  timeLeft <= 60 ? "bg-rose-500/10 text-rose-500 border-rose-500/30 animate-pulse" : "bg-white/5 text-slate-300 border-white/10"
                }`}>
                  <span className="opacity-50">Timer:</span> {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none">Challenge {currentQuestionIndex + 1} of {interview.questions.length}</h2>
          </div>
          <div className="w-full md:w-80">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Progress</span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[3.5rem] border border-white/10 shadow-3xl overflow-hidden">
          <div className="p-8 md:p-16">
            <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-10">
              <div className="flex-grow">
                {followUpQuestion ? (
                  <div className="animate-fade-in">
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg mb-6 inline-block border border-amber-500/20">Neural Expansion</span>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight italic">
                      "{followUpQuestion}"
                    </h3>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg mb-6 inline-block border ${currentQuestion.type === 'coding' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                      {currentQuestion.type === 'coding' ? 'Implementation Task' : 'Theoretical Analysis'}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                      "{currentQuestion.question}"
                    </h3>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => speak(followUpQuestion || currentQuestion.question)}
                  className="w-14 h-14 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/10 group"
                  title="Speak Question"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🔊</span>
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-sm ${
                    isMuted ? "bg-rose-500/10 text-rose-500 border-rose-500/30" : "bg-white/5 text-slate-400 border-white/10"
                  }`}
                  title="Mute/Unmute"
                >
                  <span className="text-xl">{isMuted ? "🔇" : "🔔"}</span>
                </button>
              </div>
            </div>

            {!feedback ? (
              <div className={`flex flex-col ${currentQuestion.type === "coding" ? "lg:flex-row" : ""} gap-12`}>
                <div className={currentQuestion.type === "coding" ? "lg:w-[70%]" : "w-full"}>
                  <div className="relative mb-10 group">
                    {currentQuestion.type === "coding" ? (
                      <div className="rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl h-[600px] bg-[#1e1e1e]">
                        <Editor
                          height="100%"
                          defaultLanguage="javascript"
                          theme="vs-dark"
                          value={answer}
                          onChange={(value) => setAnswer(value || "")}
                          options={{
                            fontSize: 16,
                            minimap: { enabled: false },
                            padding: { top: 30 },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        />
                      </div>
                    ) : (
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Initialize professional synthesis..."
                        className="w-full h-96 px-10 py-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07] outline-none transition-all text-2xl font-medium text-white placeholder:text-slate-700 resize-none shadow-inner"
                      ></textarea>
                    )}
                    
                    <button
                      onClick={toggleRecording}
                      className={`absolute bottom-8 left-8 w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all shadow-2xl z-10 border-2 ${
                        isRecording 
                          ? "bg-rose-600 text-white border-rose-400 animate-pulse" 
                          : "bg-black/50 backdrop-blur-md text-slate-400 border-white/10 hover:text-white hover:border-indigo-500/50"
                      }`}
                    >
                      <span className="text-2xl">{isRecording ? "⏹" : "🎤"}</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] italic">
                      <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                      {currentQuestion.type === "coding" ? "Synthesize clean, algorithmic solutions." : "Communicate with technical precision."}
                    </div>
                    <button
                      onClick={() => handleSubmitAnswer(false)}
                      disabled={isEvaluating || !answer.trim()}
                      className="bg-indigo-600 text-white px-16 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.2)] active:scale-95 disabled:opacity-30"
                    >
                      {isEvaluating ? "Processing Analysis..." : "Submit Response →"}
                    </button>
                  </div>
                </div>

                {currentQuestion.type === "coding" && (
                  <div className="lg:w-[30%] bg-white/[0.03] rounded-[2.5rem] p-12 border border-white/5">
                    <h4 className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[9px] mb-10">Neural constraints</h4>
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Parameter</p>
                        <p className="text-slate-300 font-medium leading-relaxed italic border-l-2 border-indigo-500/30 pl-8 text-sm">
                          "Optimize for O(n) time complexity where applicable."
                        </p>
                      </div>
                      
                      <div className="p-8 bg-indigo-600/5 rounded-3xl border border-indigo-500/10">
                        <p className="text-emerald-400 font-black text-[9px] uppercase tracking-widest mb-6">Neural Link</p>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Speech matrix is integrated. Use voice-overs to explain complex architectural decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (() => {
              const parseFeedback = (text) => {
                const sections = {
                  summary: "",
                  strengths: "",
                  improvements: "",
                  advice: ""
                };
                if (!text) return sections;
                const summaryMatch = text.match(/SUMMARY:\s*(.*?)(?=\n[A-Z\s]+:|$)/s);
                const strengthsMatch = text.match(/STRENGTHS:\s*(.*?)(?=\n[A-Z\s]+:|$)/s);
                const improvementsMatch = text.match(/AREAS FOR IMPROVEMENT:\s*(.*?)(?=\n[A-Z\s]+:|$)/s);
                const adviceMatch = text.match(/TEACHER'S ADVICE:\s*(.*?)(?=\n[A-Z\s]+:|$)/s);
                sections.summary = summaryMatch ? summaryMatch[1].trim() : "";
                sections.strengths = strengthsMatch ? strengthsMatch[1].trim() : "";
                sections.improvements = improvementsMatch ? improvementsMatch[1].trim() : "";
                sections.advice = adviceMatch ? adviceMatch[1].trim() : "";
                return sections;
              };

              const parsed = parseFeedback(feedback.aiFeedback);
              const tier = feedback.score >= 8 ? "Advanced" : feedback.score >= 5 ? "Intermediate" : "Growth Required";
              const tierColor = feedback.score >= 8 ? "text-emerald-400" : feedback.score >= 5 ? "text-indigo-400" : "text-rose-400";

              return (
                <div className="space-y-12 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Neural Proficiency</p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-8xl font-black tracking-tighter">{feedback.score}</span>
                        <span className="text-xl font-bold opacity-30">/10</span>
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-black/20 rounded-xl inline-block border border-white/10`}>
                        Tier: <span className={tierColor}>{tier}</span>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-3 bg-white/[0.03] p-10 lg:p-12 rounded-[3.5rem] text-white border border-white/10 shadow-xl flex flex-col justify-center relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-indigo-400 relative z-10">Executive Summary</p>
                       <p className="text-3xl font-bold leading-tight tracking-tight text-slate-100 relative z-10">
                        {parsed.summary || feedback.aiFeedback.split('\n')[0] || "Synthesis complete."}
                       </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-emerald-500/5 p-10 rounded-[3rem] border border-emerald-500/10 group hover:bg-emerald-500/[0.08] transition-all duration-500">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">✓</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Neural Strengths</p>
                      </div>
                      <p className="text-lg font-medium leading-relaxed text-slate-300">{parsed.strengths}</p>
                    </div>

                    <div className="bg-rose-500/5 p-10 rounded-[3rem] border border-rose-500/10 group hover:bg-rose-500/[0.08] transition-all duration-500">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500 text-lg">!</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Growth Optimization</p>
                      </div>
                      <p className="text-lg font-medium leading-relaxed text-slate-300">{parsed.improvements}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-700">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
                      <div className="shrink-0">
                        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl shadow-2xl shadow-indigo-500/40">💡</div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-indigo-400">Neural Coaching Protocol</p>
                        <p className="text-2xl font-bold text-slate-100 leading-relaxed italic">"{parsed.advice}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-600/10 p-12 rounded-[3.5rem] border border-indigo-500/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-indigo-400">Target Benchmark</p>
                    <p className="text-2xl font-black text-slate-100 leading-relaxed italic opacity-90">"{feedback.idealAnswer}"</p>
                  </div>

                  <div className="flex justify-end pt-8">
                    <button
                      onClick={handleNextQuestion}
                      className="bg-white text-black px-20 py-7 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-slate-200 transition-all shadow-2xl active:scale-95 group"
                    >
                      {feedback.isCompleted ? "Sim Terminal Exit" : "Next Protocol"} <span className="group-hover:translate-x-2 transition-transform inline-block ml-2">→</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;