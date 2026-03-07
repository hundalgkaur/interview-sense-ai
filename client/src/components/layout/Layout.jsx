import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-100 py-10 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold text-sm">
              IS
            </div>
            <span className="font-bold text-gray-400">InterviewSense AI</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition">Contact Support</a>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} InterviewSense. AI Powered Mock Interviews.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
