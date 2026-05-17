import { useState, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../data/dummyData';
import { formatCurrency } from '../utils/formatCurrency';
import {
  X, FloppyDisk, CurrencyDollar, Tag, CalendarBlank,
  CreditCard, TextAlignLeft, CaretDown,
} from '@phosphor-icons/react';

const INCOME_CATEGORIES = ['gaji', 'bonus', 'investasi', 'pemasukan'];

export default function EditTransactionModal({ transaction, onClose, onSave }) {
  const [form, setForm] = useState({
    nominal: '',
    category: '',
    date: '',
    payment_method: 'ewallet',
    description: '',
    transaction_type: 'expense',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setForm({
        nominal: transaction.nominal || transaction.amount || '',
        category: transaction.category || '',
        date: transaction.date ? transaction.date.slice(0, 10) : '',
        payment_method: transaction.payment_method || 'ewallet',
        description: transaction.description || '',
        transaction_type: transaction.transaction_type || 'expense',
      });
    }
  }, [transaction]);

  if (!transaction) return null;

  const isIncome = form.transaction_type === 'income';
  const filteredCategories = CATEGORIES.filter((c) =>
    isIncome ? INCOME_CATEGORIES.includes(c.value) : !INCOME_CATEGORIES.includes(c.value)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleTypeToggle = (type) => {
    setForm((prev) => ({ ...prev, transaction_type: type, category: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nominal || Number(form.nominal) <= 0) {
      setError('Nominal harus lebih dari 0');
      return;
    }
    if (!form.category) {
      setError('Pilih kategori');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        id: transaction.id,
        nominal: Number(form.nominal),
        category: form.category,
        date: form.date,
        payment_method: form.payment_method,
        description: form.description,
        transaction_type: form.transaction_type,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const labelStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '12px', fontWeight: 500, color: '#8b9cc4', marginBottom: '6px',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }}
      />
      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%', maxWidth: '480px', zIndex: 101,
        padding: '0 16px',
      }}>
        <div className="glass-card animate-fade-in-up" style={{ padding: '24px' }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>
              Edit Transaksi
            </h2>
            <button onClick={onClose} style={{
              padding: '6px', borderRadius: '8px', background: 'rgba(30,42,74,0.5)',
              border: 'none', color: '#5a6d99', cursor: 'pointer',
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Type Toggle */}
          <div style={{
            display: 'flex', gap: '4px', padding: '4px',
            background: 'rgba(15,22,41,0.6)', borderRadius: '12px',
            marginBottom: '20px',
          }}>
            {[
              { value: 'expense', label: 'Pengeluaran', color: '#f87171' },
              { value: 'income', label: 'Pemasukan', color: '#10b981' },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTypeToggle(t.value)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  border: 'none', transition: 'all 0.2s',
                  background: form.transaction_type === t.value ? `${t.color}18` : 'transparent',
                  color: form.transaction_type === t.value ? t.color : '#5a6d99',
                  boxShadow: form.transaction_type === t.value
                    ? `0 0 0 1px ${t.color}30` : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Nominal */}
            <div>
              <label style={labelStyle}>
                <CurrencyDollar size={14} /> Nominal (Rp)
              </label>
              <input
                type="number" name="nominal" value={form.nominal}
                onChange={handleChange} placeholder="0"
                className="form-input" min="0"
                style={{ fontSize: '18px', fontWeight: 700 }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>
                <Tag size={14} /> Kategori
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  name="category" value={form.category}
                  onChange={handleChange} className="form-input form-select"
                >
                  <option value="">Pilih kategori</option>
                  {filteredCategories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <CaretDown size={14} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', color: '#5a6d99', pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Date + Payment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  <CalendarBlank size={14} /> Tanggal
                </label>
                <input
                  type="date" name="date" value={form.date}
                  onChange={handleChange} className="form-input"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  <CreditCard size={14} /> Metode
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="payment_method" value={form.payment_method}
                    onChange={handleChange} className="form-input form-select"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <CaretDown size={14} style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', color: '#5a6d99', pointerEvents: 'none',
                  }} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>
                <TextAlignLeft size={14} /> Deskripsi
              </label>
              <input
                type="text" name="description" value={form.description}
                onChange={handleChange} placeholder="Deskripsi transaksi"
                className="form-input"
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                color: '#f87171',
              }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                type="button" onClick={onClose}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  background: 'rgba(30,42,74,0.5)', border: '1px solid rgba(51,65,85,0.5)',
                  color: '#8b9cc4',
                }}
              >
                Batal
              </button>
              <button
                type="submit" disabled={saving}
                className="btn-primary"
                style={{
                  flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '12px', fontSize: '13px',
                }}
              >
                <FloppyDisk size={16} weight="bold" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
