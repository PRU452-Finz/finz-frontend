import { useState } from 'react';
import { List, MagnifyingGlass } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../utils/formatCurrency';
import NotificationBell from './NotificationBell';
import SearchModal from './SearchModal';

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(11, 15, 26, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(30, 41, 59, 0.4)',
      }}>
        <div className="navbar-inner" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onMenuToggle}
              className="lg:hidden"
              style={{
                padding: '8px', borderRadius: '10px', color: '#94a3b8',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              aria-label="Toggle menu"
            >
              <List size={22} />
            </button>
            <div>
              <p style={{ fontSize: '13px', color: '#64748b' }}>{getGreeting()} 👋</p>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginTop: '2px' }}>
                {user?.name || 'User'}
              </h2>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="navbar-search"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '12px',
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                color: '#64748b', fontSize: '13px', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <MagnifyingGlass size={16} />
              <span>Cari transaksi...</span>
              <kbd style={{
                marginLeft: '16px', padding: '2px 6px', borderRadius: '4px',
                background: 'rgba(30, 41, 59, 0.8)', fontSize: '10px', color: '#64748b',
                fontFamily: 'monospace',
              }}>⌘K</kbd>
            </button>

            {/* Notification Bell — connected to budget alerts */}
            <NotificationBell />

            {/* Avatar (mobile) */}
            <div
              className="lg:hidden"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #818cf8, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '13px', fontWeight: 700,
              }}
            >
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen((prev) => !prev)}
      />
    </>
  );
}
