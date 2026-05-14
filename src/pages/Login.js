import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import toast from 'react-hot-toast';

export default function Login() {
  const { lang, signIn } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t(lang, 'welcomeBack'));
    navigate('/');
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>💼 {t(lang,'siteName')}</h1>
        <h2 style={styles.sub}>{t(lang,'login')}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>{t(lang,'email')}</label>
            <input style={styles.input} type="email" required value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{t(lang,'password')}</label>
            <input style={styles.input} type="password" required value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? '...' : t(lang,'login')}
          </button>
        </form>
        <p style={styles.switch}>{t(lang,'dontHave')} <Link to="/register" style={styles.link}>{t(lang,'register')}</Link></p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 16 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  title: { fontSize: 24, fontWeight: 800, color: '#1e40af', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 20, fontWeight: 600, color: '#111827', textAlign: 'center', marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  switch: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' },
  link: { color: '#1e40af', fontWeight: 600 },
};
