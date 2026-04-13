import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const MONTH_NAMES = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'Mei', '06': 'Jun', '07': 'Jul', '08': 'Agu',
  '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 22, 41, 0.95)', border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '10px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <p style={{ fontSize: '11px', color: '#5a6d99', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa' }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function MonthlyBarChart({ data }) {
  const chartData = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => {
      const [year, m] = month.split('-');
      return { month: `${MONTH_NAMES[m]} ${year.slice(2)}`, amount: value };
    });

  if (chartData.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px', color: '#5a6d99', fontSize: '13px' }}>
        Belum ada data bulanan
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#151d35" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#5a6d99', fontSize: 10 }}
            axisLine={{ stroke: '#151d35' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#5a6d99', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="amount"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
