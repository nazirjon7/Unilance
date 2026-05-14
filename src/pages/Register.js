import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import toast from 'react-hot-toast';

export default function Register() {
  const { lang, signUp } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.name, form.role);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t(lang,'createAccount') + '!');
    navigate('/');
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>💼 {t(lang,'siteName')}</h1>
        <h2 style={styles.sub}>{t(lang,'register')}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>{t(lang,'name')}</label>
            <input style={styles.input} required value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} placeholder="Ism Familiya" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t(lang,'email')}</label>
            <input style={styles.input} type="email" required value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t(lang,'password')}</label>
            <input style={styles.input} type="password" required value={form.password} minLength={6}
              onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 ta belgi" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t(lang,'selectRole')}</label>
            <div style={styles.roleGroup}>
              {['seeker','employer'].map(r => (
                <label key={r} style={{ ...styles.roleCard, ...(form.role === r ? styles.roleActive : {}) }}>
                  <input type="radio" name="role" value={r} checked={form.role === r}
                    onChange={e => setForm({...form, role: e.target.value})} style={{ display:'none' }} />
                  <span style={{ fontSize: 20 }}>{r === 'seeker' ? '👤' : '🏢'}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t(lang, r)}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? '...' : t(lang,'register')}
          </button>
        </form>
        <p style={styles.switch}>{t(lang,'alreadyHave')} <Link to="/login" style={styles.link}>{t(lang,'login')}</Link></p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 16 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 440, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  title: { fontSize: 24, fontWeight: 800, color: '#1e40af', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 20, fontWeight: 600, color: '#111827', textAlign: 'center', marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  roleGroup: { display: 'flex', gap: 10 },
  roleCard: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px', border: '2px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', textAlign: 'center' },
  roleActive: { border: '2px solid #1e40af', background: '#eff6ff' },
  btn: { width: '100%', padding: '12px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  switch: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' },
  link: { color: '#1e40af', fontWeight: 600 },
};
