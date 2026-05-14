import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import toast from 'react-hot-toast';

const CITIES=['Toshkent','Samarqand','Buxoro','Namangan','Andijon',"Farg'ona",'Qarshi'];
const SECTORS=['IT','Dizayn','Marketing','Moliya','Savdo','Tibbiyot',"Ta'lim",'Muhandislik','Boshqa'];

export default function PostJob() {
  const { lang, user, profile } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', company_name:'', city:'Toshkent', job_type:'', sector:'', salary_min:'', salary_max:'', description:'', requirements:'', contact:'', is_featured:false });
  const [loading, setLoading] = useState(false);

  if (!user || profile?.role === 'seeker') return <div style={S.denied}>🔒 Bu sahifa faqat ish beruvchilar uchun.</div>;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('jobs').insert({
      ...form,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      user_id: user.id,
      status: profile?.role === 'admin' ? 'approved' : 'pending',
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t(lang,'jobPosted'));
    navigate('/my-jobs');
  }

  const f = (k,v) => setForm({...form,[k]:v});

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>➕ {t(lang,'postJob')}</h1>
        <p style={S.sub}>Vakansiyangizni to'ldiring — ko'rib chiqilgach nashr etiladi</p>
      </div>
      <form onSubmit={handleSubmit} style={S.card}>
        <div style={S.section}>
          <div style={S.sectionTitle}>Asosiy ma'lumotlar</div>
          <div style={S.row}>
            <Field label={t(lang,'jobTitle')} required>
              <input className="input" required value={form.title} onChange={e => f('title',e.target.value)} placeholder="Masalan: Frontend Developer" />
            </Field>
            <Field label={t(lang,'company')}>
              <input className="input" value={form.company_name} onChange={e => f('company_name',e.target.value)} placeholder="Kompaniya nomi" />
            </Field>
          </div>
          <div style={S.row}>
            <Field label={t(lang,'city')}>
              <select className="select" value={form.city} onChange={e => f('city',e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label={t(lang,'jobType')}>
              <select className="select" value={form.job_type} onChange={e => f('job_type',e.target.value)}>
                <option value="">Tanlang</option>
                {['fullTime','partTime','remote','freelance'].map(k => <option key={k} value={t(lang,k)}>{t(lang,k)}</option>)}
              </select>
            </Field>
            <Field label={t(lang,'sector')}>
              <select className="select" value={form.sector} onChange={e => f('sector',e.target.value)}>
                <option value="">Tanlang</option>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div style={S.section}>
          <div style={S.sectionTitle}>Maosh</div>
          <div style={S.row}>
            <Field label={t(lang,'salaryMin') + ' (UZS)'}>
              <input className="input" type="number" value={form.salary_min} onChange={e => f('salary_min',e.target.value)} placeholder="5 000 000" />
            </Field>
            <Field label={t(lang,'salaryMax') + ' (UZS)'}>
              <input className="input" type="number" value={form.salary_max} onChange={e => f('salary_max',e.target.value)} placeholder="10 000 000" />
            </Field>
          </div>
        </div>

        <div style={S.section}>
          <div style={S.sectionTitle}>Batafsil</div>
          <Field label={t(lang,'description')}>
            <textarea className="input" style={{ height:100, resize:'vertical' }} value={form.description} onChange={e => f('description',e.target.value)} placeholder="Vazifalar va imtiyozlar..." />
          </Field>
          <Field label={t(lang,'requirements')}>
            <textarea className="input" style={{ height:100, resize:'vertical' }} value={form.requirements} onChange={e => f('requirements',e.target.value)} placeholder="Talablar va ko'nikmalar..." />
          </Field>
          <Field label={t(lang,'contact')}>
            <input className="input" value={form.contact} onChange={e => f('contact',e.target.value)} placeholder="hr@company.uz" />
          </Field>
        </div>

        <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'12px 0' }}>
          <input type="checkbox" checked={form.is_featured} onChange={e => f('is_featured',e.target.checked)} style={{ accentColor:'#0A0A0A', width:16, height:16 }} />
          <span style={{ fontSize:14, fontWeight:500 }}>⭐ {t(lang,'featured')} sifatida ko'rsatish</span>
        </label>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:14, fontSize:15 }}>
          {loading ? '...' : `🚀 ${t(lang,'postJob')}`}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div style={{ flex:1, minWidth:160, marginBottom:16 }}>
      <label className="label">{label}{required&&' *'}</label>
      {children}
    </div>
  );
}

const S = {
  page: { maxWidth:800, margin:'40px auto', padding:'0 24px' },
  header: { marginBottom:24 },
  title: { fontSize:26, fontWeight:700, color:'#0A0A0A', marginBottom:4 },
  sub: { fontSize:14, color:'#71717A' },
  card: { background:'#fff', border:'1px solid #E4E4E7', borderRadius:20, padding:32 },
  section: { marginBottom:24, paddingBottom:24, borderBottom:'1px solid #F4F4F5' },
  sectionTitle: { fontSize:13, fontWeight:700, color:'#A1A1AA', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:16 },
  row: { display:'flex', gap:16, flexWrap:'wrap' },
  denied: { textAlign:'center', padding:80, fontSize:18, color:'#71717A' },
};
