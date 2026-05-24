import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../utils/formatCurrency';
import NotificationBell from './NotificationBell';

export default function MobileHeader() {
  const { user } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <header className="mobile-header mobile-only">
      <div className="mobile-header-left">
        <div className="mobile-avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <p className="mobile-greeting">{getGreeting()}</p>
          <p className="mobile-username">{firstName}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <NotificationBell />
      </div>
    </header>
  );
}
