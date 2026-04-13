const STATUS_CONFIG = {
  aman: { label: 'Aman', color: '#34d399', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)' },
  warning: { label: 'Warning', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.3)' },
  bahaya: { label: 'Bahaya', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.3)' },
};

const SIZES = {
  sm: { padding: '2px 8px', fontSize: '10px' },
  md: { padding: '4px 12px', fontSize: '11px' },
  lg: { padding: '6px 14px', fontSize: '12px' },
};

export default function Badge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.aman;
  const sizeStyle = SIZES[size] || SIZES.md;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: 600,
      borderRadius: '999px',
      border: `1px solid ${config.border}`,
      color: config.color,
      background: config.bg,
      ...sizeStyle,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: config.color }} />
      {config.label}
    </span>
  );
}
