import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES, PAYMENT_METHODS } from '../data/dummyData';
import Card from '../components/Card';
import {
  CurrencyDollar,
  Tag,
  CalendarBlank,
  CreditCard,
  TextAlignLeft,
  Check,
  ArrowLeft,
  Sparkle,
  CaretDown,
} from '@phosphor-icons/react';

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction, predictCategory } = useFinance();

  const [form, setForm] = useState({
    nominal: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'ewallet',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  useEffect(() => {
    if (form.description.length >= 3) {
      const predicted = predictCategory(form.description);
      if (predicted && predicted !== form.category) {
        setAiSuggestion(predicted);
      } else {
        setAiSuggestion(null);
      }
    } else {
      setAiSuggestion(null);
    }
  }, [form.description, predictCategory, form.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const acceptAiSuggestion = () => {
    setForm((prev) => ({ ...prev, category: aiSuggestion }));
    setAiSuggestion(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nominal || Number(form.nominal) <= 0) newErrors.nominal = 'Nominal harus lebih dari 0';
    if (!form.category) newErrors.category = 'Pilih kategori';
    if (!form.date) newErrors.date = 'Pilih tanggal';
    if (!form.payment_method) newErrors.payment_method = 'Pilih metode pembayaran';
    if (!form.description || form.description.trim().length < 3) newErrors.description = 'Deskripsi minimal 3 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      addTransaction({ ...form, nominal: Number(form.nominal) });
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => navigate('/transactions'), 1500);
    }, 600);
  };

  if (showSuccess) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="glow-accent" style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Check size={36} color="#34d399" weight="bold" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Transaksi Ditambahkan!</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Mengalihkan ke halaman transaksi...</p>
        </div>
      </div>
    );
  }

  const labelStyle = {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '8px',
  };

  const errorStyle = { fontSize: '12px', color: '#f87171', marginTop: '6px' };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '10px', borderRadius: '12px',
            background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(51, 65, 85, 0.5)',
            color: '#94a3b8', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>Tambah Transaksi</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Catat pengeluaran barumu</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Nominal */}
          <div>
            <label style={labelStyle}>
              <CurrencyDollar size={16} color="#818cf8" />
              Nominal (Rp)
            </label>
            <input
              type="number"
              name="nominal"
              value={form.nominal}
              onChange={handleChange}
              placeholder="Contoh: 50000"
              className="form-input"
              style={{ fontSize: '18px', fontWeight: 600, ...(errors.nominal && { borderColor: 'rgba(248, 113, 113, 0.5)' }) }}
            />
            {errors.nominal && <p style={errorStyle}>{errors.nominal}</p>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>
              <TextAlignLeft size={16} color="#818cf8" />
              Deskripsi
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Contoh: Makan siang di warteg"
              className="form-input"
              style={errors.description ? { borderColor: 'rgba(248, 113, 113, 0.5)' } : {}}
            />
            {errors.description && <p style={errorStyle}>{errors.description}</p>}

            {/* AI suggestion */}
            {aiSuggestion && (
              <button
                type="button"
                onClick={acceptAiSuggestion}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginTop: '10px', padding: '8px 14px', borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Sparkle size={14} weight="fill" className="animate-pulse-soft" />
                AI menyarankan kategori: <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{aiSuggestion}</span>
                <span style={{ color: '#6366f1' }}>— Klik untuk pakai</span>
              </button>
            )}
          </div>

          {/* Row: Category + Payment */}
          <div className="form-row-2col">
            {/* Category */}
            <div>
              <label style={labelStyle}>
                <Tag size={16} color="#818cf8" />
                Kategori
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="form-input form-select"
                  style={errors.category ? { borderColor: 'rgba(248, 113, 113, 0.5)' } : {}}
                >
                  <option value="">Pilih kategori</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <CaretDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
              </div>
              {errors.category && <p style={errorStyle}>{errors.category}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label style={labelStyle}>
                <CreditCard size={16} color="#818cf8" />
                Metode Pembayaran
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <CaretDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>
              <CalendarBlank size={16} color="#818cf8" />
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="form-input"
              style={{ colorScheme: 'dark', ...(errors.date && { borderColor: 'rgba(248, 113, 113, 0.5)' }) }}
            />
            {errors.date && <p style={errorStyle}>{errors.date}</p>}
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px', fontSize: '14px',
                ...(isSubmitting && { background: '#1e293b', color: '#64748b', cursor: 'not-allowed', boxShadow: 'none', transform: 'none' }),
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #64748b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check size={18} weight="bold" />
                  Simpan Transaksi
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
                background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(51, 65, 85, 0.5)',
                color: '#94a3b8', cursor: 'pointer',
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </Card>

      {/* AI Info */}
      <div
        className="glass-card animate-fade-in-up"
        style={{
          padding: '20px', marginTop: '24px',
          borderLeft: '4px solid #6366f1',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Sparkle size={20} color="#818cf8" weight="fill" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'white', marginBottom: '4px' }}>Auto-Kategori AI</p>
            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
              Ketik deskripsi transaksi dan AI akan otomatis menyarankan kategori yang tepat berdasarkan kata kunci. Contoh: "makan" → Makanan, "gojek" → Transport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
