import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import Card from '../components/Card';
import {
  User, EnvelopeSimple, CurrencyDollar, GraduationCap,
  Target, ShieldCheck, CalendarBlank, PencilSimple, Check, X,
} from '@phosphor-icons/react';

const OCCUPATIONS = [
  { value: 'mahasiswa', label: 'Mahasiswa' },
  { value: 'karyawan', label: 'Karyawan' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'wirausaha', label: 'Wirausaha' },
];

const FINANCIAL_GOALS = [
  { value: 'hemat', label: 'Hemat & Menabung' },
  { value: 'investasi', label: 'Mulai Investasi' },
  { value: 'bebas_utang', label: 'Bebas Utang' },
  { value: 'dana_darurat', label: 'Dana Darurat' },
];

const RISK_PROFILES = [
  { value: 'konservatif', label: '🛡️ Konservatif', desc: 'Prioritas keamanan modal' },
  { value: 'moderat', label: '⚖️ Moderat', desc: 'Seimbang risiko & return' },
  { value: 'agresif', label: '🚀 Agresif', desc: 'Fokus pertumbuhan tinggi' },
];

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    monthly_income: user?.monthly_income || '',
    age: user?.age || '',
    occupation: user?.occupation || 'mahasiswa',
    financial_goal: user?.financial_goal || 'hemat',
    risk_profile: user?.risk_profile || 'moderat',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile({
        name: form.name,
        monthly_income: Number(form.monthly_income) || 0,
        age: Number(form.age) || null,
        occupation: form.occupation,
        financial_goal: form.financial_goal,
        risk_profile: form.risk_profile,
      });
      setEditing(false);
      setSuccess('Profil berhasil diupdate!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal mengupdate profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      monthly_income: user?.monthly_income || '',
      age: user?.age || '',
      occupation: user?.occupation || 'mahasiswa',
      financial_goal: user?.financial_goal || 'hemat',
      risk_profile: user?.risk_profile || 'moderat',
    });
    setEditing(false);
    setError('');
  };

  const labelStyle = {
    fontSize: '12px', fontWeight: 600, color: '#5a6d99',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
    display: 'flex', alignItems: 'center', gap: '6px',
  };

  const infoRow = (icon, label, value) => (
    <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(21,29,53,0.5)' }}>
      <p style={labelStyle}>{icon} {label}</p>
      <p style={{ fontSize: '15px', fontWeight: 500, color: 'white' }}>{value || '—'}</p>
    </div>
  );

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p className="page-breadcrumb">Dashboard / Profil</p>
        <h1 className="page-title">Profil Saya</h1>
      </div>

      {/* Success / Error messages */}
      {success && (
        <div className="animate-fade-in" style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', fontSize: '13px',
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399',
        }}>
          ✅ {success}
        </div>
      )}
      {error && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', fontSize: '13px',
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171',
        }}>
          {error}
        </div>
      )}

      {/* Profile Card */}
      <Card>
        {/* Avatar section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(21,29,53,0.5)' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '20px', fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>{user?.name}</h2>
            <p style={{ fontSize: '13px', color: '#5a6d99' }}>{user?.email}</p>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
              borderRadius: '10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399',
            }}>
              <PencilSimple size={14} /> Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handleSave} disabled={loading} style={{
                display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px',
                borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white',
              }}>
                <Check size={14} /> {loading ? '...' : 'Simpan'}
              </button>
              <button onClick={handleCancel} style={{
                display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px',
                borderRadius: '10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                background: 'rgba(15,22,41,0.6)', border: '1px solid rgba(30,42,74,0.7)', color: '#8b9cc4',
              }}>
                <X size={14} /> Batal
              </button>
            </div>
          )}
        </div>

        {/* Profile Fields */}
        {!editing ? (
          <div>
            {infoRow(<User size={12} />, 'Nama', user?.name)}
            {infoRow(<EnvelopeSimple size={12} />, 'Email', user?.email)}
            {infoRow(<CurrencyDollar size={12} />, 'Pemasukan Bulanan', user?.monthly_income ? formatCurrency(user.monthly_income) : '—')}
            {infoRow(<CalendarBlank size={12} />, 'Usia', user?.age ? `${user.age} tahun` : '—')}
            {infoRow(<GraduationCap size={12} />, 'Pekerjaan', user?.occupation ? user.occupation.charAt(0).toUpperCase() + user.occupation.slice(1) : '—')}
            {infoRow(<Target size={12} />, 'Tujuan Keuangan', FINANCIAL_GOALS.find(g => g.value === user?.financial_goal)?.label || '—')}
            {infoRow(<ShieldCheck size={12} />, 'Profil Risiko', RISK_PROFILES.find(r => r.value === user?.risk_profile)?.label || '—')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}><User size={12} /> Nama</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-row-2col">
              <div>
                <label style={labelStyle}><CurrencyDollar size={12} /> Pemasukan/bulan</label>
                <input type="number" name="monthly_income" value={form.monthly_income} onChange={handleChange} className="form-input" placeholder="2500000" />
              </div>
              <div>
                <label style={labelStyle}><CalendarBlank size={12} /> Usia</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} className="form-input" placeholder="21" min="1" max="150" />
              </div>
            </div>
            <div className="form-row-2col">
              <div>
                <label style={labelStyle}><GraduationCap size={12} /> Pekerjaan</label>
                <select name="occupation" value={form.occupation} onChange={handleChange} className="form-input form-select">
                  {OCCUPATIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}><Target size={12} /> Tujuan Keuangan</label>
                <select name="financial_goal" value={form.financial_goal} onChange={handleChange} className="form-input form-select">
                  {FINANCIAL_GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}><ShieldCheck size={12} /> Profil Risiko</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {RISK_PROFILES.map(r => (
                  <button key={r.value} type="button" onClick={() => setForm(prev => ({ ...prev, risk_profile: r.value }))}
                    style={{
                      padding: '12px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: form.risk_profile === r.value ? 'rgba(16,185,129,0.12)' : 'rgba(15,22,41,0.6)',
                      border: form.risk_profile === r.value ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(30,42,74,0.7)',
                      color: form.risk_profile === r.value ? '#34d399' : '#8b9cc4',
                    }}>
                    <p style={{ fontSize: '13px', fontWeight: 600 }}>{r.label}</p>
                    <p style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Logout */}
      <button onClick={logout} style={{
        width: '100%', marginTop: '20px', padding: '14px', borderRadius: '14px',
        fontSize: '14px', fontWeight: 500, cursor: 'pointer',
        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
        color: '#f87171', transition: 'all 0.2s',
      }}>
        Keluar dari Akun
      </button>
    </div>
  );
}
