import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Budget from './pages/Budget';
import Profile from './pages/Profile';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FinanceProvider>
      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="main-wrapper">
          {/* Navbar */}
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Page Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/add" element={<AddTransaction />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer style={{ padding: '16px 32px', borderTop: '1px solid rgba(30, 41, 59, 0.5)', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              © 2026 FinZ — AI-Powered Personal Financial Advisor for Gen-Z
            </p>
          </footer>
        </div>
      </div>
    </FinanceProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
