import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

export default function Login() {
  const { lang, signIn } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t(lang,'welcomeBack'));
    navigate('/');
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ marginBottom:28, display:'flex', justifyContent:'center' }}><Logo size="lg" /></div>
        <h2 style={S.title}>{t(lang,'login')}</h2>
        <form onSubmit={handleSubmit}>
          <div style={S.field}>
            <label className="label">{t(lang,'email')}</label>
            <input className="input" type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="email@example.com" />
          </div>
          <div style={S.field}>
            <label className="label">{t(lang,'password')}</label>
            <input className="input" type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:13, marginTop:8 }}>
            {loading ? '...' : t(lang,'login')}
          </button>
        </form>
        <p style={S.switch}>{t(lang,'dontHave')} <Link to="/register" style={S.link}>{t(lang,'register')}</Link></p>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAFA', padding:16 },
  card: { background:'#fff', border:'1px solid #E4E4E7', borderRadius:20, padding:'40px 36px', width:'100%', maxWidth:420, boxShadow:'0 4px 24px rgba(0,0,0,0.06)' },
  title: { fontSize:22, fontWeight:600, color:'#0A0A0A', textAlign:'center', marginBottom:28 },
  field: { marginBottom:16 },
  switch: { textAlign:'center', marginTop:20, fontSize:14, color:'#71717A' },
  link: { color:'#1A56DB', fontWeight:600 },
};
