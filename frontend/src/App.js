import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewPage from './pages/NewPage';
import CharacterPages from './pages/CharacterPages';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TimelinePage from './pages/TimelinePage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/new-page" element={<NewPage />} />
        <Route path="/character/:name" element={<CharacterPages />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
      </Routes>
    </Router>
  );
}

export default App;
