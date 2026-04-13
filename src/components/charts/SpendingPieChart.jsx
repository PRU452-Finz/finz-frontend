import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        background: 'rgba(15, 22, 41, 0.95)', border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '10px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <p style={{ fontSize: '11px', color: '#5a6d99', marginBottom: '4px' }}>{data.name}</p>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#34d399' }}>{formatCurrency(data.value)}</p>
        <p style={{ fontSize: '11px', color: '#8b9cc4' }}>{((data.value / data.payload.total) * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export default function SpendingPieChart({ data }) {
  const total = Object.values(data).reduce((s, v) => s + v, 0);

  const chartData = Object.entries(data)
    .map(([category, value]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value,
      total,
      color: CATEGORY_COLORS[category] || '#64748b',
      emoji: CATEGORY_EMOJIS[category] || '📦',
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#5a6d99', fontSize: '13px' }}>
        Belum ada data pengeluaran
      </div>
    );
  }

  return (
    <div className="pie-chart-layout">
      <div className="pie-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="pie-chart-legend">
        {chartData.map((item) => (
          <div key={item.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>{item.emoji}</span>
              <span style={{ fontSize: '13px', color: '#c1cbde' }}>{item.name}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
