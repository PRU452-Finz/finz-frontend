import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import MobileHeader from './components/MobileHeader';
import ChatbotUI from './components/ChatbotUI';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Budget from './pages/Budget';
import Profile from './pages/Profile';
import Statistik from './pages/Statistik';
import LandingPage from './pages/LandingPage';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FinanceProvider>
      <div className="app-layout">
        {/* Desktop Sidebar — hidden on mobile via CSS */}
        <div className="desktop-only">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="main-wrapper">
          {/* Desktop Navbar — hidden on mobile via CSS */}
          <div className="desktop-only">
            <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          </div>

          {/* Mobile Header — hidden on desktop via CSS */}
          <MobileHeader />

          {/* Page Content */}
          <main className="main-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/add" element={<AddTransaction />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/statistik" element={<Statistik />} />
            </Routes>
          </main>

          {/* Desktop Footer — hidden on mobile via CSS */}
          <footer className="desktop-only" style={{ padding: '16px 32px', borderTop: '1px solid rgba(30, 41, 59, 0.5)', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              © 2026 FinZ — AI-Powered Personal Financial Advisor for Gen-Z
            </p>
          </footer>
        </div>

        {/* Mobile Bottom Nav — hidden on desktop via CSS */}
        <BottomNav />

        {/* AI Chatbot — floating, tersedia di semua halaman */}
        <ChatbotUI />
      </div>
    </FinanceProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth pages — no sidebar/navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected app pages — with sidebar/navbar */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
