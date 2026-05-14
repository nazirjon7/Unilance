import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import toast from 'react-hot-toast';

const CITIES = ['Toshkent','Samarqand','Buxoro','Namangan','Andijon',"Farg'ona",'Qarshi','Urganch'];
const SECTORS = ['IT','Dizayn','Marketing','Moliya','Savdo','Tibbiyot',"Ta'lim",'Muhandislik','Boshqa'];

export default function PostJob() {
  const { lang, user, profile } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', company_name: profile?.name || '', city: 'Toshkent',
    job_type: '', sector: '', salary_min: '', salary_max: '',
    description: '', requirements: '', contact: '', is_featured: false
  });
  const [loading, setLoading] = useState(false);

  if (!user || profile?.role === 'seeker') {
    return <div style={styles.denied}>🔒 Bu sahifa faqat ish beruvchilar uchun.</div>;
  }

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
    toast.success(t(lang, 'jobPosted'));
    navigate('/my-jobs');
  }

  const f = (key, val) => setForm({ ...form, [key]: val });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>➕ {t(lang,'postJob')}</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <Field label={t(lang,'jobTitle')} required>
              <input style={styles.input} required value={form.title} onChange={e => f('title',e.target.value)} placeholder="Frontend Developer" />
            </Field>
            <Field label={t(lang,'company')}>
              <input style={styles.input} value={form.company_name} onChange={e => f('company_name',e.target.value)} placeholder="Kompaniya nomi" />
            </Field>
          </div>
          <div style={styles.row}>
            <Field label={t(lang,'cityLabel')}>
              <select style={styles.input} value={form.city} onChange={e => f('city',e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label={t(lang,'jobType')}>
              <select style={styles.input} value={form.job_type} onChange={e => f('job_type',e.target.value)}>
                <option value="">Tanlang</option>
                {['fullTime','partTime','remote','freelance'].map(k => (
                  <option key={k} value={t(lang,k)}>{t(lang,k)}</option>
                ))}
              </select>
            </Field>
            <Field label={t(lang,'sector')}>
              <select style={styles.input} value={form.sector} onChange={e => f('sector',e.target.value)}>
                <option value="">Tanlang</option>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div style={styles.row}>
            <Field label={t(lang,'salaryMin') + ' (UZS)'}>
              <input style={styles.input} type="number" value={form.salary_min} onChange={e => f('salary_min',e.target.value)} placeholder="5000000" />
            </Field>
            <Field label={t(lang,'salaryMax') + ' (UZS)'}>
              <input style={styles.input} type="number" value={form.salary_max} onChange={e => f('salary_max',e.target.value)} placeholder="10000000" />
            </Field>
          </div>
          <Field label={t(lang,'description')}>
            <textarea style={styles.textarea} value={form.description} onChange={e => f('description',e.target.value)}
              placeholder="Lavozim vazifalari va imtiyozlari..." />
          </Field>
          <Field label={t(lang,'requirements')}>
            <textarea style={styles.textarea} value={form.requirements} onChange={e => f('requirements',e.target.value)}
              placeholder="Talablar va ko'nikmalar..." />
          </Field>
          <Field label={t(lang,'contact')}>
            <input style={styles.input} value={form.contact} onChange={e => f('contact',e.target.value)} placeholder="hr@company.uz yoki +998901234567" />
          </Field>
          <label style={styles.checkLabel}>
            <input type="checkbox" checked={form.is_featured} onChange={e => f('is_featured',e.target.checked)} style={{ accentColor: '#1e40af' }} />
            ⭐ {t(lang,'featured')} sifatida ko'rsatish
          </label>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? '...' : `🚀 ${t(lang,'postJob')}`}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 16, flex: 1 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );
}

const styles = {
  page: { maxWidth: 800, margin: '40px auto', padding: '0 24px' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 32 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 24, color: '#111827' },
  row: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, height: 100, resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 20, cursor: 'pointer' },
  btn: { width: '100%', padding: '13px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  denied: { textAlign: 'center', padding: 60, fontSize: 18, color: '#6b7280' },
};
