import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { budgetAPI, budgetAlertAPI } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_EMOJIS, CATEGORY_COLORS } from '../utils/constants';
import { CATEGORIES } from '../data/dummyData';
import Card from '../components/Card';
import {
  Wallet, Plus, Trash, Warning, CheckCircle, CaretDown, ArrowClockwise,
} from '@phosphor-icons/react';

export default function Budget() {
  const { user } = useAuth();
  const userId = user?.id || 1;

  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [hasBudget, setHasBudget] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formCategory, setFormCategory] = useState('');
  const [formLimit, setFormLimit] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [budgetResp, alertResp] = await Promise.all([
        budgetAPI.getAll(userId, currentMonth),
        budgetAlertAPI.getAlerts(userId, currentMonth),
      ]);
      setBudgets(budgetResp.data || []);
      setAlerts(alertResp.data?.alerts || []);
      setHasBudget(alertResp.data?.has_budget_set || false);
    } catch (err) {
      setError(err.message || 'Gagal memuat budget');
    } finally {
      setLoading(false);
    }
  }, [userId, currentMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formCategory || !formLimit) return;
    setFormSaving(true);
    try {
      await budgetAPI.createOrUpdate({
        user_id: userId,
        category: formCategory,
        limit_amount: Number(formLimit),
        month: currentMonth,
      });
      setShowForm(false);
      setFormCategory('');
      setFormLimit('');
      await fetchData();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan budget');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await budgetAPI.delete(id);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Gagal menghapus budget');
    }
  };

  // Build spending map from alerts
  const spentMap = {};
  alerts.forEach((a) => { spentMap[a.category] = a.spent; });

  const getProgressColor = (pct) => {
    if (pct >= 100) return '#ef4444';
    if (pct >= 80) return '#f59e0b';
    if (pct >= 60) return '#fbbf24';
    return '#10b981';
  };

  const getStatusBadge = (pct) => {
    if (pct >= 100) return { label: 'Melebihi', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
    if (pct >= 80) return { label: 'Hampir Penuh', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    return { label: 'Aman', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '14px', color: '#5a6d99' }}>Memuat budget...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="txn-page-header">
        <div>
          <p className="page-breadcrumb">Dashboard / Budget</p>
          <h1 className="page-title">Manajemen Budget</h1>
          <p style={{ fontSize: '13px', color: '#5a6d99', marginTop: '4px' }}>
            Periode: {currentMonth} • {budgets.length} kategori
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={fetchData} style={{
            padding: '10px', borderRadius: '12px', background: 'rgba(15,22,41,0.6)',
            border: '1px solid rgba(30,42,74,0.7)', color: '#8b9cc4', cursor: 'pointer',
          }}>
            <ArrowClockwise size={16} />
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px',
          }}>
            <Plus size={16} weight="bold" /> Set Budget
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="glass-card animate-fade-in-up" style={{
          marginBottom: '20px', padding: '16px 20px',
          borderLeft: '4px solid #f59e0b', background: 'linear-gradient(145deg, rgba(245,158,11,0.05), rgba(10,14,26,0.95))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Warning size={18} color="#f59e0b" weight="fill" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Budget Alert!</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {alerts.map((a) => (
              <span key={a.category} style={{
                padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                background: a.status === 'exceeded' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                color: a.status === 'exceeded' ? '#f87171' : '#fbbf24',
                textTransform: 'capitalize',
              }}>
                {CATEGORY_EMOJIS[a.category]} {a.category}: {a.percentage}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Budget Form */}
      {showForm && (
        <div className="animate-fade-in-up" style={{ marginBottom: '20px' }}>
          <Card title="Set Budget Kategori">
            <form onSubmit={handleSave} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ fontSize: '12px', color: '#5a6d99', marginBottom: '6px', display: 'block' }}>Kategori</label>
                <div style={{ position: 'relative' }}>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                    className="form-input form-select">
                    <option value="">Pilih kategori</option>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <CaretDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6d99', pointerEvents: 'none' }} />
                </div>
              </div>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ fontSize: '12px', color: '#5a6d99', marginBottom: '6px', display: 'block' }}>Batas (Rp)</label>
                <input type="number" value={formLimit} onChange={(e) => setFormLimit(e.target.value)}
                  placeholder="500000" className="form-input" min="0" />
              </div>
              <button type="submit" disabled={formSaving} className="btn-primary" style={{
                padding: '12px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                {formSaving ? 'Menyimpan...' : <><CheckCircle size={16} /> Simpan</>}
              </button>
            </form>
          </Card>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', fontSize: '13px',
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171',
        }}>
          {error}
          <button onClick={() => setError('')} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '12px' }}>✕</button>
        </div>
      )}

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Wallet size={48} color="#1e2a4a" weight="duotone" style={{ marginBottom: '14px' }} />
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#8b9cc4' }}>Belum ada budget</p>
            <p style={{ fontSize: '12px', color: '#5a6d99', marginTop: '6px' }}>Set budget untuk mengontrol pengeluaranmu</p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {budgets.map((b, idx) => {
            const limit = parseFloat(b.limit_amount);
            const spent = spentMap[b.category] || 0;
            const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const color = getProgressColor(pct);
            const badge = getStatusBadge(pct);

            return (
              <div key={b.id} className={`glass-card card-pad animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`} style={{ opacity: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: `${CATEGORY_COLORS[b.category]}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    }}>
                      {CATEGORY_EMOJIS[b.category]}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', textTransform: 'capitalize' }}>{b.category}</p>
                      <p style={{ fontSize: '11px', color: '#5a6d99' }}>
                        {formatCurrency(spent)} / {formatCurrency(limit)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                      background: badge.bg, color: badge.color,
                    }}>
                      {badge.label}
                    </span>
                    <button onClick={() => handleDelete(b.id)} style={{
                      padding: '6px', borderRadius: '6px', color: '#384770',
                      background: 'none', border: 'none', cursor: 'pointer',
                    }} title="Hapus">
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    flex: 1, height: '8px', borderRadius: '999px',
                    background: '#151d35', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '999px',
                      background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                      width: `${Math.min(pct, 100)}%`,
                      transition: 'width 0.8s ease-out',
                    }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color, minWidth: '40px', textAlign: 'right' }}>
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
