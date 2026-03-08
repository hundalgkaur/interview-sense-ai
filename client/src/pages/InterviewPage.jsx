import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInterview from "../hooks/useInterview";
import Editor from "@monaco-editor/react";

const InterviewPage = () => {
  // Setup state
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState("");
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

  const { startNewInterview, submitInterviewAnswer, uploadResume, getInterviewDetails, loading } = useInterview();
  const navigate = useNavigate();

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
    if (resumeId) {
      const loadPending = async () => {
        try {
          const data = await getInterviewDetails(resumeId);
          const unansweredIndex = data.questions.findIndex(q => !q.answer);
          setInterview(data);
          setCurrentQuestionIndex(unansweredIndex !== -1 ? unansweredIndex : 0);
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
      const data = await startNewInterview(role, country, parseInt(experience), resumeText);
      setInterview(data);
    } catch (err) {
      setIsUploading(false);
      setLocalError(err.response?.data?.message || "Failed to start simulation.");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    try {
      setIsEvaluating(true);
      const data = await submitInterviewAnswer(interview._id, currentQuestionIndex, answer);
      if (data.followUp && !followUpQuestion) {
        setFollowUpQuestion(data.followUp);
        setAnswer("");
      } else {
        setFeedback(data);
        setFollowUpQuestion(null);
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
    }
  };

  // 1. Setup View
  if (!interview) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 page-transition">
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-indigo-600 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </button>
        </div>

        <div className="card-base shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row min-h-[600px]">
          <div className="md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl mb-10 shadow-lg shadow-indigo-500/20">
                🎯
              </div>
              <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">Configure Simulation</h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                Our AI will generate technical challenges based on your career profile and target seniority.
              </p>
              
              <ul className="space-y-5">
                {['Live Code Review', 'Speech Synthesis', 'Behavioral Coaching', 'Deep Analytics'].map((item) => (
                  <li key={item} className="flex items-center gap-4 font-bold text-xs uppercase tracking-widest text-slate-300">
                    <span className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-[10px]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              Standard Engine: Gemini 1.5
            </div>
          </div>
          
          <div className="md:w-7/12 p-12 lg:p-16">
            {localError && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
                <span>⚠️</span> {localError}
              </div>
            )}

            <form onSubmit={handleStart} className="space-y-8">
              <div className="space-y-2">
                <label className="label-caps">Target Position</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label-caps">Country/Region</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United Kingdom"
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps">Years of Experience</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Years"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-caps">Resume Knowledge Base (Optional PDF)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label 
                    htmlFor="resume-upload"
                    className={`flex items-center justify-between w-full px-6 py-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                      resumeFile ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-indigo-300"
                    }`}
                  >
                    <span className="font-bold text-sm">
                      {resumeFile ? resumeFile.name : "Select PDF resume..."}
                    </span>
                    <span className="text-xl">{resumeFile ? "📄" : "📤"}</span>
                  </label>
                  {resumeFile && (
                    <button 
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full text-xs flex items-center justify-center shadow-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isUploading}
                className="btn-primary w-full py-5 text-lg"
              >
                {isUploading ? "Processing Knowledge Base..." : loading ? "Generating Simulation..." : "Start Simulation →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Session View
  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <div className={`mx-auto px-6 py-12 page-transition transition-all duration-500 ${currentQuestion.type === "coding" && !feedback ? "max-w-[95%] lg:px-12" : "max-w-5xl"}`}>
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Live Session</span>
            <span className="text-slate-400 font-bold text-sm">{interview.role} • {interview.experience} Years</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Challenge {currentQuestionIndex + 1} of {interview.questions.length}</h2>
        </div>
        <div className="w-full md:w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
            <span className="text-sm font-black text-indigo-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card-base shadow-2xl shadow-slate-200/50">
        <div className="p-8 md:p-16">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
            <div className="flex-grow">
              {followUpQuestion ? (
                <div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 inline-block border border-amber-100">Neural Follow-up</span>
                  <h3 className="text-3xl font-black text-indigo-600 leading-tight">
                    "{followUpQuestion}"
                  </h3>
                </div>
              ) : (
                <div>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 inline-block border ${currentQuestion.type === 'coding' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
                    {currentQuestion.type === 'coding' ? 'Implementation Task' : 'Conceptual Question'}
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">
                    "{currentQuestion.question}"
                  </h3>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => speak(followUpQuestion || currentQuestion.question)}
                className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all border border-slate-100 shadow-sm"
                title="Speak Question"
              >
                <span className="text-lg">🔊</span>
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border shadow-sm ${
                  isMuted ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                }`}
                title="Mute/Unmute"
              >
                <span className="text-lg">{isMuted ? "🔇" : "🔔"}</span>
              </button>
            </div>
          </div>

          {!feedback ? (
            <div className={`flex flex-col ${currentQuestion.type === "coding" ? "lg:flex-row" : ""} gap-10`}>
              <div className={currentQuestion.type === "coding" ? "lg:w-2/3" : "w-full"}>
                <div className="relative mb-8">
                  {currentQuestion.type === "coding" ? (
                    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-inner h-[500px]">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-light"
                        value={answer}
                        onChange={(value) => setAnswer(value || "")}
                        options={{
                          fontSize: 15,
                          minimap: { enabled: false },
                          padding: { top: 20 },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  ) : (
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Enter your professional technical response here..."
                      className="w-full h-80 px-8 py-8 rounded-3xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all text-xl font-medium text-slate-800 resize-none shadow-inner"
                    ></textarea>
                  )}
                  
                  <button
                    onClick={toggleRecording}
                    className={`absolute bottom-6 left-6 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg z-10 border ${
                      isRecording 
                        ? "bg-rose-600 text-white border-rose-400 animate-pulse" 
                        : "bg-white text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-200"
                    }`}
                  >
                    <span className="text-xl">{isRecording ? "⏹" : "🎤"}</span>
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                    {currentQuestion.type === "coding" ? "Write clean, performant code." : "Synthesize your answer clearly."}
                  </div>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isEvaluating || !answer.trim()}
                    className="btn-primary px-12"
                  >
                    {isEvaluating ? "Analyzing..." : "Submit Response →"}
                  </button>
                </div>
              </div>

              {currentQuestion.type === "coding" && (
                <div className="lg:w-1/3 bg-slate-900 rounded-[2rem] p-10 text-white shadow-xl">
                  <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-8">Requirement Log</h4>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-slate-500 text-[10px] font-black uppercase">Constraint</p>
                      <p className="text-slate-200 font-medium leading-relaxed italic border-l-2 border-indigo-500/50 pl-6">
                        "Implement the logic using industry-standard best practices."
                      </p>
                    </div>
                    
                    <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <p className="text-emerald-400 font-black text-[10px] uppercase mb-4">Neural Guidance</p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Voice capture is active. You can explain your logic verbally while coding.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-200">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Simulation Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-black">{feedback.score}</span>
                    <span className="text-xl font-bold opacity-40">/10</span>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-indigo-400">AI Evaluation Report</p>
                   <p className="text-lg font-medium leading-relaxed whitespace-pre-line text-slate-300">{feedback.aiFeedback}</p>
                </div>
              </div>

              <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100">
                <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-emerald-700">Gold Standard Reference</p>
                <p className="text-xl font-bold text-emerald-900 leading-relaxed italic">"{feedback.idealAnswer}"</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="btn-primary px-12 py-5"
                >
                  {feedback.isCompleted ? "Sim Complete" : "Next Challenge →"}
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
