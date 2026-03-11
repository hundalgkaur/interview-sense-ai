import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import CertificatePage from './pages/CertificatePage';
import QuestionsPage from './pages/QuestionsPage';
import PinterestHome from './pages/PinterestHome';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans transition-colors duration-500">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/vault" element={<QuestionsPage />} />
            <Route path="/certificate/:id" element={<CertificatePage />} />
            <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
            <Route path="/pinterest" element={<PinterestHome />} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/interview" element={<Layout><InterviewPage /></Layout>} />
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
            <Route path="/results/:id" element={<Layout><ResultsPage /></Layout>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
