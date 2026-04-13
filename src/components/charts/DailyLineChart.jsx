import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDateShort } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 22, 41, 0.95)', border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '10px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <p style={{ fontSize: '11px', color: '#5a6d99', marginBottom: '4px' }}>{formatDateShort(label)}</p>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#34d399' }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function DailyLineChart({ data }) {
  const chartData = Object.entries(data)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, value]) => ({
      date,
      amount: value,
      label: formatDateShort(date),
    }));

  if (chartData.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px', color: '#5a6d99', fontSize: '13px' }}>
        Belum ada data harian
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#151d35" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#5a6d99', fontSize: 10 }}
            axisLine={{ stroke: '#151d35' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#5a6d99', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}rb`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#colorAmount)"
            dot={{ r: 3, fill: '#10b981', stroke: '#0f1629', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#34d399', stroke: '#10b981', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
