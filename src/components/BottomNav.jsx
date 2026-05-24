import { NavLink, useLocation } from 'react-router-dom';
import {
  House,
  Receipt,
  ChartPieSlice,
  UserCircle,
} from '@phosphor-icons/react';

const tabs = [
  { to: '/dashboard', label: 'Dashboard', icon: House },
  { to: '/transactions', label: 'Transaksi', icon: Receipt },
  { to: '/statistik', label: 'Statistik', icon: ChartPieSlice },
  { to: '/profile', label: 'Profil', icon: UserCircle },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav mobile-only" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.to ||
          (tab.to === '/dashboard' && location.pathname === '/');

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <tab.icon size={24} weight={isActive ? 'fill' : 'regular'} />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
