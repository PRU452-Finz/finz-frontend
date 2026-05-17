export const CATEGORY_COLORS = {
  makanan: '#f97316',
  transport: '#3b82f6',
  hiburan: '#a855f7',
  belanja: '#ec4899',
  tagihan: '#ef4444',
  pendidikan: '#06b6d4',
  kesehatan: '#10b981',
  gaji: '#22c55e',
  bonus: '#84cc16',
  investasi: '#14b8a6',
  pemasukan: '#0ea5e9',
  lainnya: '#64748b',
};

export const CATEGORY_EMOJIS = {
  makanan: '🍔',
  transport: '🚗',
  hiburan: '🎮',
  belanja: '🛍️',
  tagihan: '📱',
  pendidikan: '📚',
  kesehatan: '💊',
  gaji: '💰',
  bonus: '🎁',
  investasi: '📈',
  pemasukan: '💵',
  lainnya: '📦',
};

export const STATUS_CONFIG = {
  aman: {
    label: 'Aman',
    color: 'text-accent-500',
    bg: 'bg-accent-500/10',
    border: 'border-accent-500/30',
    glow: 'glow-accent',
  },
  warning: {
    label: 'Warning',
    color: 'text-warning-400',
    bg: 'bg-warning-400/10',
    border: 'border-warning-400/30',
    glow: '',
  },
  bahaya: {
    label: 'Bahaya',
    color: 'text-danger-500',
    bg: 'bg-danger-500/10',
    border: 'border-danger-500/30',
    glow: 'glow-danger',
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
