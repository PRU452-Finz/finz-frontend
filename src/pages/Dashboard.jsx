import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, formatDateShort } from '../utils/formatCurrency';
import Card from '../components/Card';
import Badge from '../components/ui/Badge';
import SpendingPieChart from '../components/charts/SpendingPieChart';
import DailyLineChart from '../components/charts/DailyLineChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import { CATEGORY_EMOJIS, CATEGORY_COLORS } from '../utils/constants';
import {
  Wallet,
  TrendDown,
  TrendUp,
  ChartLine,
  Lightning,
  Lightbulb,
  ShieldCheck,
  Warning,
  ArrowRight,
  Sparkle,
  Plus,
  CreditCard,
  Money,
} from '@phosphor-icons/react';

function useIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export default function Dashboard() {
  const { summary, prediction, financialScore, recommendations, transactions, loading, error } = useFinance();
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '14px', color: '#5a6d99' }}>Memuat dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '16px', color: '#f87171' }}>Gagal memuat data</p>
        <p style={{ fontSize: '13px', color: '#5a6d99' }}>{error}</p>
      </div>
    );
  }

  if (!summary) return null;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentBalance = (summary?.totalIncome || 0) - (summary?.totalSpending || 0);

  const getScoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#34d399' : s >= 40 ? '#fbbf24' : '#f87171';
  const getScoreLabel = (s) => s >= 80 ? 'Sangat Baik' : s >= 60 ? 'Cukup Baik' : s >= 40 ? 'Perlu Perbaikan' : 'Kurang Baik';
  const scoreColor = financialScore ? getScoreColor(financialScore.score) : '#5a6d99';
  const getRecIcon = (type) => {
    if (type === 'warning') return <Warning size={16} color="#fbbf24" weight="fill" />;
    if (type === 'important') return <ShieldCheck size={16} color="#f87171" weight="fill" />;
    return <Lightbulb size={16} color="#34d399" weight="fill" />;
  };
  const getRecBorder = (type) => type === 'warning' ? '#fbbf24' : type === 'important' ? '#f87171' : '#34d399';

  const balancePercent = prediction && prediction.current_balance > 0
    ? Math.min(Math.round((prediction.predicted_end_balance / prediction.current_balance) * 100), 100)
    : 0;

  const balanceDash = prediction && prediction.current_balance > 0
    ? Math.min((prediction.predicted_end_balance / prediction.current_balance) * 251, 251)
    : 0;

  // ═══════════ MOBILE LAYOUT ═══════════
  if (isMobile) {
    return (
      <div className="page-transition">
        {/* Hero Balance Card */}
        <div className="hero-balance">
          <p className="hero-label">Total Saldo</p>
          <p className="hero-amount">{formatCurrency(currentBalance)}</p>

          {/* Progress Bar */}
          <div className="hero-progress-track">
            <div className="hero-progress-bar" style={{ width: `${balancePercent}%` }} />
          </div>

          {/* Prediction Row */}
          <div className="hero-prediction">
            <div className="hero-pred-left">
              <ChartLine size={16} color="#34d399" weight="duotone" />
              <span className="hero-pred-label">Prediksi Akhir Bulan</span>
            </div>
            {prediction ? (
              <span className="hero-pred-amount">{formatCurrency(prediction.predicted_end_balance)}</span>
            ) : (
              <span className="hero-pred-amount" style={{ fontSize: '11px', color: '#94a3b8' }}>AI menganalisa...</span>
            )}
          </div>
        </div>

        {/* Income / Expense Row */}
        <div className="summary-row">
          <div className="summary-card">
            <div className="summary-card-icon income">
              <TrendUp size={20} color="#34d399" weight="duotone" />
            </div>
            <div>
              <div className="insight-score-circle" style={{ '--score-color': scoreColor, border: `4px solid ${scoreColor}` }}>
                {financialScore ? (
                  <span className="insight-score-value">{financialScore.score}</span>
                ) : (
                  <span className="insight-score-value" style={{ fontSize: '16px' }}>--</span>
                )}
              </div>
            </div>
            <div className="insight-score-info">
              <p className="insight-score-status" style={{ color: scoreColor }}>
                {financialScore ? getScoreLabel(financialScore.score) : 'Menganalisa...'}
              </p>
              <p className="insight-score-desc">
                {financialScore ? 'Skor finansial berdasarkan aktivitas Anda bulan ini.' : 'AI sedang menilai kebiasaan finansial Anda.'}
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-card-icon expense">
              <TrendDown size={20} color="#f87171" weight="duotone" />
            </div>
            <div>
              <p className="summary-card-label">Pengeluaran</p>
              <p className="summary-card-amount">{formatCurrency(summary.totalSpending)}</p>
            </div>
          </div>
        </div>

        {/* Budget Alert */}
        {prediction?.message && (
          <div className="mobile-alert">
            <Lightning size={18} color="#10b981" weight="fill" className="mobile-alert-icon" />
            <div>
              <p className="mobile-alert-title">Budget Warning</p>
              <p className="mobile-alert-text">{prediction.message}</p>
            </div>
          </div>
        )}

        {/* Transaction Section */}
        <div className="mobile-section-header">
          <h2 className="mobile-section-title">Riwayat Transaksi</h2>
          <a href="/transactions" className="mobile-section-action">
            Semua <ArrowRight size={14} />
          </a>
        </div>

        <div className="mobile-txn-card">
          {recentTransactions.map((t) => (
            <div key={t.id} className="list-tile">
              <div className="list-tile-icon" style={{ background: `${CATEGORY_COLORS[t.category]}15` }}>
                {CATEGORY_EMOJIS[t.category]}
              </div>
              <div className="list-tile-content">
                <p className="list-tile-title">{t.description}</p>
                <div className="list-tile-subtitle">
                  <span>{formatDateShort(t.date)}</span>
                  <span className="dot" />
                  <span style={{ textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    {t.payment_method === 'cash'
                      ? <><Money size={11} /> Cash</>
                      : <><CreditCard size={11} /> Bank</>
                    }
                  </span>
                </div>
              </div>
              <p className={`list-tile-amount ${t.transaction_type === 'income' ? 'income' : 'expense'}`}>
                {t.transaction_type === 'income' ? '+' : '-'}{formatCurrency(t.nominal)}
              </p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {recommendations.slice(0, 2).map((rec) => (
          <div key={rec.id} className="mobile-rec-card" style={{ borderLeft: `3px solid ${getRecBorder(rec.type)}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              {getRecIcon(rec.type)}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{rec.title}</h4>
                <p style={{ fontSize: '11px', color: '#5a6d99', lineHeight: 1.6 }}>{rec.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* FAB */}
        <a href="/add" className="fab mobile-only" aria-label="Tambah transaksi">
          <Plus size={26} weight="bold" />
        </a>
      </div>
    );
  }

  // ═══════════ DESKTOP LAYOUT ═══════════
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <p className="page-breadcrumb">Dashboard / Overview</p>
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="dash-grid-stats" style={{ marginBottom: '20px' }}>
        <div className="glass-card card-featured card-pad animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <p className="stat-label">Saldo Saat Ini</p>
            <span className="tag tag-teal">● Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#151d35" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${balanceDash} 251`} style={{ transition: 'stroke-dasharray 1s ease-out' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399' }}>{balancePercent}%</span>
              </div>
            </div>
            <p className="stat-value" style={{ lineHeight: 1 }}>{formatCurrency(prediction ? prediction.current_balance : currentBalance)}</p>
          </div>
        </div>

        <div className="glass-card card-pad animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p className="stat-label">Pemasukan</p>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)' }}><TrendUp size={18} color="#34d399" weight="duotone" /></div>
          </div>
          <p className="stat-value" style={{ marginBottom: '8px' }}>{formatCurrency(summary.totalIncome)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wallet size={14} color="#34d399" />
            <span style={{ fontSize: '12px', color: '#34d399' }}>Bulan ini</span>
          </div>
        </div>

        <div className="glass-card card-pad animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p className="stat-label">Pengeluaran</p>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(248, 113, 113, 0.1)' }}><TrendDown size={18} color="#f87171" weight="duotone" /></div>
          </div>
          <p className="stat-value" style={{ marginBottom: '8px' }}>{formatCurrency(summary.totalSpending)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendDown size={14} color="#f87171" />
            <span style={{ fontSize: '12px', color: '#f87171' }}>{summary.transactionCount} transaksi</span>
          </div>
        </div>

        <div className="glass-card card-pad animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p className="stat-label">Prediksi Sisa</p>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)' }}><ChartLine size={18} color="#34d399" weight="duotone" /></div>
          </div>
          <p className="stat-value" style={{ marginBottom: '8px' }}>{prediction ? formatCurrency(prediction.predicted_end_balance) : '--'}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendUp size={14} color="#34d399" />
            <span style={{ fontSize: '12px', color: '#34d399' }}>Saldo di Akhir Bulan</span>
          </div>
        </div>
      </div>

      <div className="dash-grid-2-1" style={{ marginBottom: '20px' }}>
        <Card title="Prediksi Sisa Saldo" subtitle="Tren pengeluaran harian bulan ini" delay={2}>
          <DailyLineChart data={summary.dailyBreakdown} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(21, 29, 53, 0.8)', flexWrap: 'wrap' }}>
            <Sparkle size={16} color="#a78bfa" weight="fill" />
            <p style={{ fontSize: '12px', color: '#5a6d99' }}>AI prediksi saldo akhir: <span style={{ color: '#34d399', fontWeight: 600 }}>{prediction ? formatCurrency(prediction.predicted_end_balance) : 'Menganalisa...'}</span></p>
            {prediction && <Badge status={prediction.status} size="sm" />}
          </div>
        </Card>

        <Card delay={3}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
            <p className="stat-label" style={{ marginBottom: '20px' }}>Financial Health Score</p>
            <div style={{ position: 'relative', width: '110px', height: '110px', marginBottom: '12px' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#151d35" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={financialScore ? `${(financialScore.score / 100) * 314} 314` : '0 314'} style={{ transition: 'stroke-dasharray 1s ease-out' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}>{financialScore ? financialScore.score : '--'}</span>
                <span style={{ fontSize: '9px', color: '#5a6d99' }}>dari 100</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: scoreColor, marginBottom: '20px' }}>
              {financialScore ? getScoreLabel(financialScore.score) : 'Menganalisa...'}
            </p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {financialScore && Object.entries(financialScore.breakdown).map(([key, value]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                    <span style={{ color: '#5a6d99', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                    <span style={{ color: '#c1cbde', fontWeight: 500 }}>{value}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', borderRadius: '999px', background: '#151d35', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #10b981, #34d399)', width: `${value}%`, transition: 'width 1s ease-out' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="dash-grid-2-1" style={{ marginBottom: '20px' }}>
        <Card title="Riwayat Transaksi" subtitle="Transaksi terakhir" delay={4}
          action={<a href="/transactions" style={{ fontSize: '12px', color: '#34d399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Lihat Semua <ArrowRight size={12} /></a>}
        >
          <div className="txn-table-header">
            <span>DESKRIPSI</span><span>TANGGAL</span><span>METODE</span><span style={{ textAlign: 'right' }}>NOMINAL</span>
          </div>
          {recentTransactions.map((t, i) => (
            <div key={t.id} className="txn-table-row" style={{ borderBottom: i < recentTransactions.length - 1 ? '1px solid rgba(21, 29, 53, 0.5)' : 'none' }}>
              <div className="txn-desc" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${CATEGORY_COLORS[t.category]}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{CATEGORY_EMOJIS[t.category]}</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>
                  <p style={{ fontSize: '11px', color: '#5a6d99' }}>{t.category}</p>
                </div>
              </div>
              <span className="txn-meta" style={{ fontSize: '12px', color: '#8b9cc4' }}>{formatDate(t.date)}</span>
              <div className="txn-meta"><span className="tag tag-purple" style={{ textTransform: 'capitalize' }}>{t.payment_method}</span></div>
              <p className="txn-amount" style={{ fontSize: '13px', fontWeight: 600, color: t.transaction_type === 'income' ? '#10b981' : '#f87171', textAlign: 'right' }}>{t.transaction_type === 'income' ? '+' : '-'}{formatCurrency(t.nominal)}</p>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card card-featured card-pad animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Lightning size={18} color="#10b981" weight="fill" />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Budget Warning</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#8b9cc4', lineHeight: 1.7, marginBottom: '14px' }}>{prediction.message}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span style={{ fontSize: '12px', color: '#5a6d99' }}>Status:</span>
              <Badge status={prediction.status} />
            </div>
            <a href="/add" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Lightning size={16} weight="fill" /> Tambah Transaksi
              </button>
            </a>
          </div>
          {recommendations.slice(0, 2).map((rec) => (
            <div key={rec.id} className="glass-card card-pad animate-fade-in-up stagger-6" style={{ opacity: 0, borderLeft: `3px solid ${getRecBorder(rec.type)}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {getRecIcon(rec.type)}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>{rec.title}</h4>
                  <p style={{ fontSize: '11px', color: '#5a6d99', lineHeight: 1.6 }}>{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-grid-half">
        <Card title="Pengeluaran per Kategori" subtitle="Distribusi bulan ini" delay={5}>
          <SpendingPieChart data={summary.categoryBreakdown} />
        </Card>
        <Card title="Pengeluaran Bulanan" subtitle="Riwayat per bulan" delay={6}>
          <MonthlyBarChart data={summary.monthlyBreakdown} />
        </Card>
      </div>
    </div>
  );
}
