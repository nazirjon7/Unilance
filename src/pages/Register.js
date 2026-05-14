import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

export default function Register() {
  const { lang, signUp } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'seeker' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.name, form.role);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t(lang,'createAccount') + ' ✓');
    navigate('/');
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ marginBottom:28, display:'flex', justifyContent:'center' }}><Logo size="lg" /></div>
        <h2 style={S.title}>{t(lang,'register')}</h2>
        <form onSubmit={handleSubmit}>
          <div style={S.field}>
            <label className="label">{t(lang,'name')}</label>
            <input className="input" required value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Ism Familiya" />
          </div>
          <div style={S.field}>
            <label className="label">{t(lang,'email')}</label>
            <input className="input" type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="email@example.com" />
          </div>
          <div style={S.field}>
            <label className="label">{t(lang,'password')}</label>
            <input className="input" type="password" required minLength={6} value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="Min 6 belgi" />
          </div>
          <div style={S.field}>
            <label className="label">{t(lang,'selectRole')}</label>
            <div style={{ display:'flex', gap:10 }}>
              {['seeker','employer'].map(r => (
                <label key={r} style={{ ...S.roleCard, ...(form.role===r ? S.roleActive : {}) }}>
                  <input type="radio" name="role" value={r} checked={form.role===r} onChange={e => setForm({...form,role:e.target.value})} style={{ display:'none' }} />
                  <span style={{ fontSize:24 }}>{r==='seeker'?'👤':'🏢'}</span>
                  <span style={{ fontSize:13, fontWeight:600, color: form.role===r ? '#0A0A0A' : '#71717A' }}>{t(lang,r)}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:13, marginTop:8 }}>
            {loading ? '...' : t(lang,'register')}
          </button>
        </form>
        <p style={S.switch}>{t(lang,'alreadyHave')} <Link to="/login" style={S.link}>{t(lang,'login')}</Link></p>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAFA', padding:16 },
  card: { background:'#fff', border:'1px solid #E4E4E7', borderRadius:20, padding:'40px 36px', width:'100%', maxWidth:440, boxShadow:'0 4px 24px rgba(0,0,0,0.06)' },
  title: { fontSize:22, fontWeight:600, color:'#0A0A0A', textAlign:'center', marginBottom:28 },
  field: { marginBottom:16 },
  roleCard: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:14, border:'1.5px solid #E4E4E7', borderRadius:12, cursor:'pointer', transition:'all 0.15s' },
  roleActive: { border:'1.5px solid #0A0A0A', background:'#FAFAFA' },
  switch: { textAlign:'center', marginTop:20, fontSize:14, color:'#71717A' },
  link: { color:'#1A56DB', fontWeight:600 },
};
