import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { CATEGORY_EMOJIS, CATEGORY_COLORS } from '../utils/constants';
import { MagnifyingGlass, X, ArrowRight } from '@phosphor-icons/react';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { transactions } = useFinance();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input saat modal dibuka
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim() || !transactions) return [];
    const q = query.toLowerCase();
    return transactions
      .filter((t) =>
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        String(t.nominal).includes(q)
      )
      .slice(0, 8);
  }, [query, transactions]);

  if (!isOpen) return null;

  const handleSelect = (t) => {
    onClose();
    navigate('/transactions');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }}
      />
      {/* Modal */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '520px', zIndex: 101, padding: '0 16px',
      }}>
        <div className="glass-card animate-fade-in-up" style={{ overflow: 'hidden' }}>
          {/* Search Input */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px 20px', borderBottom: '1px solid rgba(30,42,74,0.5)',
          }}>
            <MagnifyingGlass size={20} color="#5a6d99" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari transaksi..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: '15px', color: 'white', fontFamily: 'inherit',
              }}
            />
            <button onClick={onClose} style={{
              padding: '4px 8px', borderRadius: '6px', fontSize: '10px',
              background: 'rgba(30,42,74,0.8)', border: '1px solid rgba(51,65,85,0.5)',
              color: '#64748b', cursor: 'pointer', fontFamily: 'monospace',
            }}>ESC</button>
          </div>

          {/* Results */}
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {query.trim() && results.length === 0 && (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#5a6d99' }}>Tidak ada hasil untuk "{query}"</p>
              </div>
            )}
            {results.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                  padding: '12px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                  borderBottom: '1px solid rgba(21,29,53,0.4)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${CATEGORY_COLORS[t.category] || '#64748b'}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', flexShrink: 0,
                }}>
                  {CATEGORY_EMOJIS[t.category] || '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '13px', fontWeight: 500, color: 'white',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{t.description}</p>
                  <p style={{ fontSize: '11px', color: '#5a6d99' }}>
                    {t.category} • {formatDate(t.date)}
                  </p>
                </div>
                <p style={{
                  fontSize: '13px', fontWeight: 600, flexShrink: 0,
                  color: t.transaction_type === 'income' ? '#10b981' : '#f87171',
                }}>
                  {t.transaction_type === 'income' ? '+' : '-'}{formatCurrency(t.nominal)}
                </p>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          {!query.trim() && (
            <div style={{
              padding: '14px 20px', borderTop: '1px solid rgba(30,42,74,0.5)',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <span style={{ fontSize: '11px', color: '#384770' }}>
                Ketik untuk mencari transaksi berdasarkan deskripsi, kategori, atau nominal
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
