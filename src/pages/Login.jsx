import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lightning, EnvelopeSimple, Lock, Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react';
import logoFinz from '../assets/logoFinz.png';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #050810 0%, #0a0e1a 40%, #0f1629 100%)',
      padding: '20px',
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%', width: '600px', height: '600px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', left: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img src={logoFinz} alt="FinZ Logo" style={{ width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px', display: 'block', objectFit: 'contain' }} />
          <h1 className="gradient-text" style={{ fontSize: '28px', fontWeight: 800 }}>FinZ</h1>
          <p style={{ fontSize: '14px', color: '#5a6d99', marginTop: '8px' }}>Masuk ke akun keuanganmu</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#8b9cc4', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <EnvelopeSimple size={14} /> Email
              </label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="contoh@email.com" className="form-input" autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#8b9cc4', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Masukkan password"
                  className="form-input" style={{ paddingRight: '44px' }} autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#5a6d99', cursor: 'pointer', padding: '4px',
                }}>
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
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

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px', fontSize: '14px', width: '100%',
              ...(loading && { background: '#1e293b', color: '#64748b', cursor: 'not-allowed', boxShadow: 'none', transform: 'none' }),
            }}>
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #64748b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  Masuk...
                </>
              ) : (
                <>
                  Masuk <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{
            marginTop: '20px', padding: '12px', borderRadius: '10px',
            background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)',
          }}>
            <p style={{ fontSize: '11px', color: '#5a6d99', textAlign: 'center' }}>
              Demo: <span style={{ color: '#34d399', fontWeight: 600 }}>bayu@finz.id</span> / <span style={{ color: '#34d399', fontWeight: 600 }}>finz1234</span>
            </p>
          </div>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#5a6d99' }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color: '#34d399', fontWeight: 600, textDecoration: 'none' }}>
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
