import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../components/layout/Layout";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-40 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Trusted by 10,000+ candidates globally
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-gray-900 mb-8 tracking-tight leading-[0.9]">
              Master your next <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Technical Interview.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience AI-powered mock interviews tailored to your role, country, and
              experience. Get real-time feedback and detailed scoring.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to={user ? "/interview" : "/login"}
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-[0_20px_50px_rgba(37,_99,_235,_0.3)] hover:shadow-[0_20px_50px_rgba(37,_99,_235,_0.5)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                Start Free Interview →
              </Link>
              {!user && (
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 font-bold text-lg rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-300"
                >
                  Create Account
                </Link>
              )}
            </div>
            
            <div className="mt-20 flex flex-wrap justify-center gap-10 opacity-40 grayscale contrast-125">
              <span className="text-2xl font-black tracking-tighter">GOOGLE</span>
              <span className="text-2xl font-black tracking-tighter">META</span>
              <span className="text-2xl font-black tracking-tighter">AMAZON</span>
              <span className="text-2xl font-black tracking-tighter">NETFLIX</span>
              <span className="text-2xl font-black tracking-tighter">APPLE</span>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <section className="bg-white py-24 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="group">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  🚀
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">AI-Generated</h3>
                <p className="text-gray-500 leading-relaxed">
                  Dynamic questions powered by Google Gemini tailored specifically to your tech stack and experience level.
                </p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  📊
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Detailed Scoring</h3>
                <p className="text-gray-500 leading-relaxed">
                  Receive a professional examiner report for every answer with strengths, weaknesses, and teacher's advice.
                </p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                  🌍
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Regional Insights</h3>
                <p className="text-gray-500 leading-relaxed">
                  Interviews that reflect the specific technical expectations and cultural nuances of your target country.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
