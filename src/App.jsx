import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/Home';
import Roadmap from './pages/dashboard/Roadmap';
import Settings from './pages/dashboard/Settings';
import Reports from './pages/dashboard/Reports';
import Profile from './pages/dashboard/Profile';
import Chat from './pages/dashboard/Chat';
import Submit from './pages/dashboard/Submit'; // Import Submit Page
// Actually Reports was defined inline. Let's move it to its own file or keep it simple.
// I earlier created `src/pages/dashboard/Reports.jsx`. I should use THAT.

import { ThemeProvider } from './context/ThemeContext';
import { ReportProvider } from './context/ReportContext';

function App() {
  return (
    <ThemeProvider>
      <ReportProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="chat" element={<Chat />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reports" element={<Reports />} />
              <Route path="submit" element={<Submit />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch all - redirect to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ReportProvider>
    </ThemeProvider>
  );
}

export default App;
