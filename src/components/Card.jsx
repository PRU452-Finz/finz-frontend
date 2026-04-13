export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  noPadding = false,
  animate = true,
  delay = 0,
}) {
  const delayClass = delay > 0 ? `stagger-${Math.min(delay, 6)}` : '';

  return (
    <div
      className={`
        glass-card
        ${animate ? `animate-fade-in-up ${delayClass}` : ''}
        ${className}
      `}
      style={animate && delay > 0 ? { opacity: 0 } : undefined}
    >
      {(title || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 24px 12px',
        }}>
          <div>
            {title && <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={noPadding ? {} : { padding: '12px 24px 24px' }}>
        {children}
      </div>
    </div>
  );
}
