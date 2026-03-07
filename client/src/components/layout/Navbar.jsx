import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-6 transition-transform">
            IS
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            InterviewSense
          </span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold transition">
                  Dashboard
                </Link>
                <Link to="/interview" className="text-gray-600 hover:text-blue-600 font-semibold transition">
                  New Interview
                </Link>
              </div>
              <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Candidate</p>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-bold transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-blue-200 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
