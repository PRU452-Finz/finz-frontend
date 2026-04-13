import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
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
} from '@phosphor-icons/react';

export default function Dashboard() {
  const { summary, prediction, financialScore, recommendations, transactions } = useFinance();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#34d399';
    if (score >= 40) return '#fbbf24';
    return '#f87171';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Sangat Baik';
    if (score >= 60) return 'Cukup Baik';
    if (score >= 40) return 'Perlu Perbaikan';
    return 'Kurang Baik';
  };

  const scoreColor = getScoreColor(financialScore.score);

  const getRecIcon = (type) => {
    switch (type) {
      case 'warning': return <Warning size={16} color="#fbbf24" weight="fill" />;
      case 'important': return <ShieldCheck size={16} color="#f87171" weight="fill" />;
      default: return <Lightbulb size={16} color="#34d399" weight="fill" />;
    }
  };

  const getRecBorder = (type) => {
    switch (type) {
      case 'warning': return '#fbbf24';
      case 'important': return '#f87171';
      default: return '#34d399';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* ━━━ Header ━━━ */}
      <div style={{ marginBottom: '24px' }}>
        <p className="page-breadcrumb">Dashboard / Overview</p>
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      {/* ━━━━━━━━━━ ROW 1: Stat Cards ━━━━━━━━━━ */}
      <div className="dash-grid-stats" style={{ marginBottom: '20px' }}>
        {/* Featured Balance Card */}
        <div className="glass-card card-featured card-pad animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <p className="stat-label">Saldo Saat Ini</p>
            <span className="tag tag-teal">● Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Mini Donut */}
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#151d35" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(prediction.predicted_end_balance / prediction.current_balance) * 251} 251`}
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399' }}>
                  {Math.round((prediction.predicted_end_balance / prediction.current_balance) * 100)}%
                </span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#5a6d99', marginBottom: '4px' }}>Rp</p>
              <p className="stat-value" style={{ lineHeight: 1 }}>
                {(prediction.current_balance / 1000).toLocaleString('id-ID')}<span style={{ fontSize: '16px', color: '#8b9cc4' }}>.000</span>
              </p>
            </div>
          </div>
        </div>

        {/* Pengeluaran Card */}
        <div className="glass-card card-pad animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p className="stat-label">Pengeluaran</p>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(248, 113, 113, 0.1)' }}>
              <TrendDown size={18} color="#f87171" weight="duotone" />
            </div>
          </div>
          <p className="stat-value" style={{ marginBottom: '8px' }}>
            {formatCurrency(summary.totalSpending)}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendDown size={14} color="#f87171" />
            <span style={{ fontSize: '12px', color: '#f87171' }}>{summary.transactionCount} transaksi</span>
          </div>
        </div>

        {/* Prediksi Card */}
        <div className="glass-card card-pad animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p className="stat-label">Prediksi Sisa</p>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)' }}>
              <ChartLine size={18} color="#34d399" weight="duotone" />
            </div>
          </div>
          <p className="stat-value" style={{ marginBottom: '8px' }}>
            {formatCurrency(prediction.predicted_end_balance)}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendUp size={14} color="#34d399" />
            <span style={{ fontSize: '12px', color: '#34d399' }}>Saldo di Akhir Bulan</span>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━ ROW 2: Prediction + Financial Score ━━━━━━━━━━ */}
      <div className="dash-grid-2-1" style={{ marginBottom: '20px' }}>
        {/* Prediction Line Chart */}
        <Card title="Prediksi Sisa Saldo" subtitle="Tren pengeluaran harian bulan ini" delay={2}>
          <DailyLineChart data={summary.dailyBreakdown} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(21, 29, 53, 0.8)', flexWrap: 'wrap' }}>
            <Sparkle size={16} color="#a78bfa" weight="fill" />
            <p style={{ fontSize: '12px', color: '#5a6d99' }}>
              AI prediksi saldo akhir: <span style={{ color: '#34d399', fontWeight: 600 }}>{formatCurrency(prediction.predicted_end_balance)}</span>
            </p>
            <Badge status={prediction.status} size="sm" />
          </div>
        </Card>

        {/* Financial Health Score */}
        <Card delay={3}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
            <p className="stat-label" style={{ marginBottom: '20px' }}>Financial Health Score</p>
            <div style={{ position: 'relative', width: '110px', height: '110px', marginBottom: '12px' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#151d35" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(financialScore.score / 100) * 314} 314`}
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}>{financialScore.score}</span>
                <span style={{ fontSize: '9px', color: '#5a6d99' }}>dari 100</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: scoreColor, marginBottom: '20px' }}>
              {getScoreLabel(financialScore.score)}
            </p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(financialScore.breakdown).map(([key, value]) => (
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

      {/* ━━━━━━━━━━ ROW 3: Transactions + Budget Warning ━━━━━━━━━━ */}
      <div className="dash-grid-2-1" style={{ marginBottom: '20px' }}>
        {/* Recent Transactions */}
        <Card title="Riwayat Transaksi" subtitle="Transaksi terakhir" delay={4}
          action={
            <a href="/transactions" style={{ fontSize: '12px', color: '#34d399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Lihat Semua <ArrowRight size={12} />
            </a>
          }
        >
          {/* Table header */}
          <div className="txn-table-header">
            <span>DESKRIPSI</span>
            <span>TANGGAL</span>
            <span>METODE</span>
            <span style={{ textAlign: 'right' }}>NOMINAL</span>
          </div>
          {/* Rows */}
          {recentTransactions.map((t, i) => (
            <div key={t.id} className="txn-table-row" style={{
              borderBottom: i < recentTransactions.length - 1 ? '1px solid rgba(21, 29, 53, 0.5)' : 'none',
            }}>
              <div className="txn-desc" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: `${CATEGORY_COLORS[t.category]}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0,
                }}>
                  {CATEGORY_EMOJIS[t.category]}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>
                  <p style={{ fontSize: '11px', color: '#5a6d99' }}>{t.category}</p>
                </div>
              </div>
              {/* Desktop: separate columns */}
              <span className="txn-meta" style={{ fontSize: '12px', color: '#8b9cc4' }}>{formatDate(t.date)}</span>
              <div className="txn-meta">
                <span className="tag tag-purple" style={{ textTransform: 'capitalize' }}>{t.payment_method}</span>
              </div>
              <p className="txn-amount" style={{ fontSize: '13px', fontWeight: 600, color: '#f87171', textAlign: 'right' }}>
                -{formatCurrency(t.nominal)}
              </p>
            </div>
          ))}
        </Card>

        {/* Budget Warning / Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card card-featured card-pad animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Lightning size={18} color="#10b981" weight="fill" />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Budget Warning</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#8b9cc4', lineHeight: 1.7, marginBottom: '14px' }}>
              {prediction.message}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span style={{ fontSize: '12px', color: '#5a6d99' }}>Status:</span>
              <Badge status={prediction.status} />
            </div>
            <a href="/add" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Lightning size={16} weight="fill" />
                Tambah Transaksi
              </button>
            </a>
          </div>

          {recommendations.slice(0, 2).map((rec) => (
            <div key={rec.id} className="glass-card card-pad animate-fade-in-up stagger-6" style={{ opacity: 0, borderLeft: `3px solid ${getRecBorder(rec.type)}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{rec.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{rec.title}</h4>
                    {getRecIcon(rec.type)}
                  </div>
                  <p style={{ fontSize: '11px', color: '#5a6d99', lineHeight: 1.6 }}>{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━ ROW 4: Charts ━━━━━━━━━━ */}
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
