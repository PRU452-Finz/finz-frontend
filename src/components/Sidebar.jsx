import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  House,
  Receipt,
  PlusCircle,
  Wallet,
  UserCircle,
  SignOut,
  X,
  Lightning,
} from '@phosphor-icons/react';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: House },
  { to: '/transactions', label: 'Transaksi', icon: Receipt },
  { to: '/add', label: 'Tambah', icon: PlusCircle },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/profile', label: 'Profil', icon: UserCircle },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 24px 20px',
          borderBottom: '1px solid rgba(16, 185, 129, 0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="glow-primary" style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lightning size={20} weight="fill" color="white" />
            </div>
            <div>
              <h1 className="gradient-text" style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>FinZ</h1>
              <p style={{ fontSize: '9px', color: '#5a6d99', letterSpacing: '2px', textTransform: 'uppercase' }}>Smart Finance</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden" style={{ padding: '4px', color: '#5a6d99', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ padding: '8px 14px', fontSize: '10px', fontWeight: 700, color: '#384770', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Menu
          </p>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '10px',
                fontSize: '13px', fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                color: isActive ? '#34d399' : '#8b9cc4',
                borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
              })}
            >
              <link.icon size={18} weight="duotone" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(16, 185, 129, 0.06)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
            padding: '11px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
            color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.2s',
          }}>
            <SignOut size={18} weight="duotone" />
            Keluar
          </button>
        </div>

        {/* Profile */}
        <div style={{ padding: '12px 16px 20px' }}>
          <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '13px', fontWeight: 700, flexShrink: 0,
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: '10px', color: '#5a6d99' }}>{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
