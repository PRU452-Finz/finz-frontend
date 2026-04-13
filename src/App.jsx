import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FinanceProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </FinanceProvider>
  );
}
