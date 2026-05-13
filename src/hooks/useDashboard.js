import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

/**
 * Hook to get computed dashboard data.
 * Summary sudah dikompute oleh backend — hook ini hanya transform ke format chart.
 */
export default function useDashboard() {
  const { summary, prediction, financialScore, recommendations } = useFinance();

  const chartData = useMemo(() => {
    if (!summary) return { pieData: [], lineData: [], barData: [] };

    // Pie chart data — dari categoryBreakdown
    const pieData = Object.entries(summary.categoryBreakdown || {}).map(([category, value]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value,
      category,
    }));

    // Line chart data (daily) — dari dailyBreakdown
    const lineData = Object.entries(summary.dailyBreakdown || {})
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, amount]) => ({ date, amount }));

    // Bar chart data (monthly) — dari monthlyBreakdown
    const barData = Object.entries(summary.monthlyBreakdown || {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));

    return { pieData, lineData, barData };
  }, [summary]);

  // Hitung predictionStatus dari rasio saldo — null-safe
  const predictionStatus = useMemo(() => {
    if (!prediction || !prediction.current_balance) return 'aman';
    const ratio = prediction.predicted_end_balance / prediction.current_balance;
    if (ratio >= 0.5) return 'aman';
    if (ratio >= 0.2) return 'warning';
    return 'bahaya';
  }, [prediction]);

  return {
    summary,
    prediction,
    predictionStatus,
    financialScore,
    recommendations,
    chartData,
  };
}

