import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';
import Card from '../components/Card';
import SpendingPieChart from '../components/charts/SpendingPieChart';
import DailyLineChart from '../components/charts/DailyLineChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import Badge from '../components/ui/Badge';
import {
  Sparkle,
  TrendUp,
  ChartPieSlice,
  ChartBar,
  ChartLine,
} from '@phosphor-icons/react';

export default function Statistik() {
  const { summary, prediction, financialScore, loading, error } = useFinance();

  // ─── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '14px', color: '#5a6d99' }}>Memuat statistik...</p>
      </div>
    );
  }

  // ─── Error ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '16px', color: '#f87171' }}>Gagal memuat data</p>
        <p style={{ fontSize: '13px', color: '#5a6d99' }}>{error}</p>
      </div>
    );
  }

  if (!summary || !financialScore) return null;

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

  return (
    <div className="page-transition animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p className="page-breadcrumb desktop-only">Statistik / Overview</p>
        <h1 className="page-title">Statistik</h1>
      </div>

      {/* Financial Health Score */}
      <div className="glass-card card-pad animate-fade-in-up stagger-1" style={{ opacity: 0, marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Score Ring */}
          <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
            <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#151d35" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(financialScore.score / 100) * 314} 314`}
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>{financialScore.score}</span>
              <span style={{ fontSize: '9px', color: '#5a6d99' }}>dari 100</span>
            </div>
          </div>

          {/* Score Details */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#5a6d99', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Financial Health Score
            </p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: scoreColor, marginBottom: '16px' }}>
              {getScoreLabel(financialScore.score)}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
        </div>
      </div>

      {/* Charts Grid */}
      <div className="stats-grid">
        {/* Prediction Line Chart */}
        <Card title="Prediksi Sisa Saldo" subtitle="Tren pengeluaran harian" delay={2}>
          <DailyLineChart data={summary.dailyBreakdown} />
          {prediction && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(21, 29, 53, 0.8)', flexWrap: 'wrap' }}>
              <Sparkle size={16} color="#a78bfa" weight="fill" />
              <p style={{ fontSize: '12px', color: '#5a6d99' }}>
                AI prediksi saldo akhir: <span style={{ color: '#34d399', fontWeight: 600 }}>{formatCurrency(prediction.predicted_end_balance)}</span>
              </p>
              <Badge status={prediction.status} size="sm" />
            </div>
          )}
        </Card>

        {/* Spending Pie Chart */}
        <Card title="Pengeluaran per Kategori" subtitle="Distribusi bulan ini" delay={3}>
          <SpendingPieChart data={summary.categoryBreakdown} />
        </Card>

        {/* Monthly Bar Chart */}
        <Card title="Pengeluaran Bulanan" subtitle="Riwayat per bulan" delay={4}>
          <MonthlyBarChart data={summary.monthlyBreakdown} />
        </Card>
      </div>
    </div>
  );
}
