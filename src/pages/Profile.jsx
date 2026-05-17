import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Card from '../components/Card';
import { CATEGORIES } from '../data/dummyData';
import {
  User,
  Envelope,
  CurrencyDollar,
  Briefcase,
  Target,
  ShieldCheck,
  FloppyDisk,
} from '@phosphor-icons/react';

export default function Profile() {
  const { profile, budgets } = useFinance();
  const { user } = useAuth();
  const userId = user?.id;

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    monthly_income: '',
    occupation: 'karyawan',
    financial_goal: 'dana_darurat',
    risk_profile: 'konservatif',
  });

  const [budgetForms, setBudgetForms] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        email: profile.email || '',
        monthly_income: profile.monthly_income || '',
        occupation: profile.occupation || 'karyawan',
        financial_goal: profile.financial_goal || 'dana_darurat',
        risk_profile: profile.risk_profile || 'konservatif',
      });
    }

    if (budgets) {
      const budgetMap = {};
      budgets.forEach((b) => {
        budgetMap[b.category] = b.limit_amount;
      });
      setBudgetForms(budgetMap);
    }
  }, [profile, budgets]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (category, value) => {
    setBudgetForms((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    try {
      await userAPI.updateProfile(userId, {
        ...profileForm,
        monthly_income: Number(profileForm.monthly_income),
      });
      setMessage({ text: 'Profil berhasil diperbarui!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Gagal memperbarui profil', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBudget = async (category) => {
    setMessage({ text: '', type: '' });
    try {
      const amount = budgetForms[category] || 0;
      await userAPI.upsertBudget(userId, {
        category,
        limit_amount: Number(amount),
        month: new Date().toISOString().slice(0, 7),
      });
      setMessage({ text: `Budget ${category} berhasil diperbarui!`, type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Gagal memperbarui budget', type: 'error' });
    }
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#cbd5e1',
    marginBottom: '8px',
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <p className="page-breadcrumb">User / Profile</p>
        <h1 className="page-title">Pengaturan Profil & Budget</h1>
      </div>

      {message.text && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(248, 113, 113, 0.1)',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`,
            color: message.type === 'success' ? '#34d399' : '#f87171',
            fontSize: '14px',
          }}
        >
          {message.text}
        </div>
      )}

      <div className="dash-grid-2-1" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Left Column: Profile Form */}
        <Card title="Profil Finansial" subtitle="Sesuaikan data diri untuk kalibrasi AI">
          <form onSubmit={handleSubmitProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>
                <User size={16} color="#818cf8" />
                Nama
              </label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="form-input"
                placeholder="Nama Anda"
              />
            </div>

            <div>
              <label style={labelStyle}>
                <Envelope size={16} color="#818cf8" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="form-input"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label style={labelStyle}>
                <CurrencyDollar size={16} color="#818cf8" />
                Pemasukan Bulanan (Rp)
              </label>
              <input
                type="number"
                name="monthly_income"
                value={profileForm.monthly_income}
                onChange={handleProfileChange}
                className="form-input"
                placeholder="Contoh: 5000000"
                style={{ fontSize: '16px', fontWeight: 600 }}
              />
            </div>

            <div className="form-row-2col">
              <div>
                <label style={labelStyle}>
                  <Briefcase size={16} color="#818cf8" />
                  Pekerjaan
                </label>
                <select
                  name="occupation"
                  value={profileForm.occupation}
                  onChange={handleProfileChange}
                  className="form-input form-select"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="karyawan">Karyawan</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="wirausaha">Wirausaha</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  <Target size={16} color="#818cf8" />
                  Tujuan Finansial
                </label>
                <select
                  name="financial_goal"
                  value={profileForm.financial_goal}
                  onChange={handleProfileChange}
                  className="form-input form-select"
                >
                  <option value="hemat">Hemat</option>
                  <option value="investasi">Investasi</option>
                  <option value="bebas_utang">Bebas Utang</option>
                  <option value="dana_darurat">Dana Darurat</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                <ShieldCheck size={16} color="#818cf8" />
                Profil Risiko
              </label>
              <select
                name="risk_profile"
                value={profileForm.risk_profile}
                onChange={handleProfileChange}
                className="form-input form-select"
              >
                <option value="konservatif">Konservatif</option>
                <option value="moderat">Moderat</option>
                <option value="agresif">Agresif</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                marginTop: '10px',
              }}
            >
              <FloppyDisk size={18} weight="bold" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        </Card>

        {/* Right Column: Budget Form */}
        <Card title="Atur Budget Bulanan" subtitle="Limit pengeluaran per kategori">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CATEGORIES.map((cat) => (
              <div key={cat.value} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', textTransform: 'capitalize' }}>
                  {cat.label}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    value={budgetForms[cat.value] || ''}
                    onChange={(e) => handleBudgetChange(cat.value, e.target.value)}
                    className="form-input"
                    placeholder="Limit Rp"
                    style={{ flex: 1, fontSize: '14px' }}
                  />
                  <button
                    onClick={() => handleSubmitBudget(cat.value)}
                    style={{
                      padding: '0 12px',
                      borderRadius: '10px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      color: '#a5b4fc',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
