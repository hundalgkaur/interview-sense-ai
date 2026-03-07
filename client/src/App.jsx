import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
          <Route path="/interview" element={<Layout><InterviewPage /></Layout>} />
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
          <Route path="/results/:id" element={<Layout><ResultsPage /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
