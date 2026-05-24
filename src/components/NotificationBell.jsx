import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { budgetAlertAPI } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_EMOJIS } from '../utils/constants';
import { Bell, Warning, CheckCircle, X } from '@phosphor-icons/react';

export default function NotificationBell() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const currentMonth = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  })();

  const fetchAlerts = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const resp = await budgetAlertAPI.getAlerts(user.id, currentMonth);
      setAlerts(resp.data?.alerts || []);
    } catch {
      // Silently fail — alerts are not critical
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentMonth]);

  // Fetch alerts on mount and every 5 minutes
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Hanya tampilkan notifikasi yang dihasilkan oleh AI
  const displayAlerts = alerts.filter((a) => a.is_ai);
  const unreadCount = displayAlerts.filter((a) => !a.is_read).length;
  const hasWarnings = displayAlerts.some((a) => a.status === 'exceeded' || a.status === 'warning');

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchAlerts(); }}
        style={{
          position: 'relative', padding: '10px', borderRadius: '12px',
          color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
      >
        <Bell size={20} weight={unreadCount > 0 ? 'fill' : 'regular'} />
        {unreadCount > 0 && (
          <span className="animate-pulse-soft" style={{
            position: 'absolute', top: '6px', right: '6px',
            minWidth: '16px', height: '16px', borderRadius: '999px',
            background: hasWarnings ? '#ef4444' : '#6366f1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 700, color: 'white',
            padding: '0 4px',
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="glass-card animate-fade-in" style={{
          position: 'absolute', right: 0, top: '48px',
          width: '340px', maxHeight: '400px', overflowY: 'auto',
          zIndex: 50, border: '1px solid rgba(30,42,74,0.7)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderBottom: '1px solid rgba(30,42,74,0.5)',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
              Budget Alerts
            </h3>
            <button onClick={() => setIsOpen(false)} style={{
              padding: '4px', background: 'none', border: 'none',
              color: '#5a6d99', cursor: 'pointer',
            }}>
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{
                width: '24px', height: '24px', margin: '0 auto',
                border: '2px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
              }} />
            </div>
          ) : displayAlerts.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <CheckCircle size={32} color="#10b981" weight="duotone" style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13px', color: '#8b9cc4' }}>Semua budget aman!</p>
              <p style={{ fontSize: '11px', color: '#5a6d99', marginTop: '4px' }}>
                Tidak ada peringatan AI bulan ini
              </p>
            </div>
          ) : (
            <div>
              {displayAlerts.map((alert, i) => {
                const isExceeded = alert.status === 'exceeded';
                const isWarning = alert.status === 'warning';
                const color = isExceeded ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

                return (
                  <div
                    key={`${alert.category}-${i}`}
                    style={{
                      padding: '12px 16px',
                      borderBottom: i < alerts.length - 1 ? '1px solid rgba(21,29,53,0.5)' : 'none',
                      background: isExceeded ? 'rgba(239,68,68,0.03)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                        background: 'rgba(167,139,250,0.1)', color: '#a78bfa',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
                      }}>
                        🤖
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <p style={{
                            fontSize: '13px', fontWeight: 600, color: 'white',
                            textTransform: 'capitalize',
                          }}>
                            {alert.category}
                          </p>
                          {(isExceeded || isWarning) && (
                            <Warning size={12} color={color} weight="fill" />
                          )}
                        </div>
                        <p style={{ fontSize: '11px', color: '#8b9cc4', marginTop: '4px', lineHeight: '1.5' }}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
