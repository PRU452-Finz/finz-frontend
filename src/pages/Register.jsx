import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lightning, User, EnvelopeSimple, Lock, Eye, EyeSlash,
  CurrencyDollar, GraduationCap, Target, CaretDown, ArrowRight,
} from '@phosphor-icons/react';
import logoFinz from '../assets/logoFinz.png';

const OCCUPATIONS = [
  { value: 'mahasiswa', label: 'Mahasiswa' },
  { value: 'karyawan', label: 'Karyawan' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'wirausaha', label: 'Wirausaha' },
];

const FINANCIAL_GOALS = [
  { value: 'hemat', label: '💰 Hemat & Menabung' },
  { value: 'investasi', label: '📈 Mulai Investasi' },
  { value: 'bebas_utang', label: '🔓 Bebas Utang' },
  { value: 'dana_darurat', label: '🛡️ Dana Darurat' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    monthly_income: '', occupation: 'mahasiswa', financial_goal: 'hemat',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Nama, email, dan password wajib diisi.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        monthly_income: Number(form.monthly_income) || 0,
        occupation: form.occupation,
        financial_goal: form.financial_goal,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontSize: '13px', fontWeight: 500, color: '#8b9cc4',
    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #050810 0%, #0a0e1a 40%, #0f1629 100%)',
      padding: '20px',
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%', width: '600px', height: '600px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={logoFinz} alt="FinZ Logo" style={{ width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px', display: 'block', objectFit: 'contain' }} />
          <h1 className="gradient-text" style={{ fontSize: '28px', fontWeight: 800 }}>Buat Akun FinZ</h1>
          <p style={{ fontSize: '14px', color: '#5a6d99', marginTop: '8px' }}>Mulai kelola keuanganmu dengan cerdas</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Name */}
            <div>
              <label style={labelStyle}><User size={14} /> Nama Lengkap</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Nama lengkap" className="form-input" autoComplete="name" />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}><EnvelopeSimple size={14} /> Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="contoh@email.com" className="form-input" autoComplete="email" />
            </div>

            {/* Password Row */}
            <div className="form-row-2col">
              <div>
                <label style={labelStyle}><Lock size={14} /> Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                    onChange={handleChange} placeholder="Min. 6 karakter" className="form-input"
                    style={{ paddingRight: '44px' }} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#5a6d99', cursor: 'pointer', padding: '4px',
                  }}>
                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}><Lock size={14} /> Konfirmasi</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="Ulangi password" className="form-input" autoComplete="new-password" />
              </div>
            </div>

            {/* Income & Occupation Row */}
            <div className="form-row-2col">
              <div>
                <label style={labelStyle}><CurrencyDollar size={14} /> Pemasukan/bulan (Rp)</label>
                <input type="number" name="monthly_income" value={form.monthly_income}
                  onChange={handleChange} placeholder="Contoh: 2500000" className="form-input" />
              </div>
              <div>
                <label style={labelStyle}><GraduationCap size={14} /> Pekerjaan</label>
                <div style={{ position: 'relative' }}>
                  <select name="occupation" value={form.occupation} onChange={handleChange}
                    className="form-input form-select">
                    {OCCUPATIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <CaretDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6d99', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Financial Goal */}
            <div>
              <label style={labelStyle}><Target size={14} /> Tujuan Keuangan</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {FINANCIAL_GOALS.map((g) => (
                  <button key={g.value} type="button" onClick={() => setForm(prev => ({ ...prev, financial_goal: g.value }))}
                    style={{
                      padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                      background: form.financial_goal === g.value ? 'rgba(16,185,129,0.12)' : 'rgba(15,22,41,0.6)',
                      border: form.financial_goal === g.value ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(30,42,74,0.7)',
                      color: form.financial_goal === g.value ? '#34d399' : '#8b9cc4',
                    }}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px', fontSize: '14px', width: '100%',
              ...(loading && { background: '#1e293b', color: '#64748b', cursor: 'not-allowed', boxShadow: 'none', transform: 'none' }),
            }}>
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #64748b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  Mendaftar...
                </>
              ) : (
                <>Daftar Sekarang <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#5a6d99' }}>
          Sudah punya akun?{' '}
          <Link to="/login" style={{ color: '#34d399', fontWeight: 600, textDecoration: 'none' }}>
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
