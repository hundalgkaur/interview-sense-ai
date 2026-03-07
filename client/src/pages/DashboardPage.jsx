import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useInterview from "../hooks/useInterview";

const DashboardPage = () => {
  const { user } = useAuth();
  const { interviews, fetchInterviews, loading } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/login");
    } else {
      fetchInterviews();
    }
  }, []);

  const averageScore = interviews.length > 0
    ? (interviews.reduce((acc, i) => acc + i.overallScore, 0) / interviews.length).toFixed(1)
    : "0";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 font-medium">
            You've completed <span className="text-blue-600 font-bold">{interviews.length}</span> mock interviews so far.
          </p>
        </div>
        <Link
          to="/interview"
          className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1"
        >
          <span>Start New Interview</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-6">
            📝
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">
            Total Sessions
          </p>
          <h3 className="text-5xl font-black text-gray-900 leading-none">
            {interviews.length}
          </h3>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-6">
            🎯
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">
            Average Proficiency
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-5xl font-black text-indigo-600 leading-none">
              {averageScore}
            </h3>
            <span className="text-xl text-gray-300 font-bold">/10</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-6">
            🔥
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">
            Current Status
          </p>
          <h3 className="text-4xl font-black text-emerald-600 leading-none uppercase tracking-tighter">
            Interview Ready
          </h3>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Sessions</h2>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition">View all activity</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-5">Role & Target</th>
                <th className="px-8 py-5">Experience</th>
                <th className="px-8 py-5 text-center">Score</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-bold">Analyzing history...</p>
                    </div>
                  </td>
                </tr>
              ) : interviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="text-4xl mb-4">👻</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">No data yet</h4>
                      <p className="text-gray-400 mb-6">Start your first mock interview to see your progress here.</p>
                      <Link to="/interview" className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl">Start Now</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                interviews.map((interview) => (
                  <tr key={interview._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{interview.role}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{interview.country}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-500 font-medium">
                      {interview.experience} Years
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <div className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 ${
                          interview.overallScore >= 7
                            ? "bg-emerald-50 text-emerald-700"
                            : interview.overallScore >= 4
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            interview.overallScore >= 7 ? "bg-emerald-500" : interview.overallScore >= 4 ? "bg-amber-500" : "bg-rose-500"
                          }`}></div>
                          {interview.overallScore.toFixed(1)}/10
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-400 text-sm font-medium">
                      {new Date(interview.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link
                        to={`/results/${interview._id}`}
                        className="px-6 py-2 bg-white border border-gray-100 text-gray-900 font-bold rounded-lg hover:border-blue-600 hover:text-blue-600 transition shadow-sm"
                      >
                        Details
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
