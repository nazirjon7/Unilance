import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import toast from 'react-hot-toast';

export default function ApplyModal({ job, onClose }) {
  const { lang, user } = useApp();
  const [form, setForm] = useState({ cover_letter:'', phone:'' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const { error } = await supabase.from('applications').insert({
      job_id: job.id, user_id: user.id,
      cover_letter: form.cover_letter, phone: form.phone, status: 'pending'
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t(lang,'applySent'));
    onClose();
  }

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.header}>
          <div>
            <h2 style={S.title}>{job.title}</h2>
            <p style={S.sub}>{job.company_name} · {job.city}</p>
          </div>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>
        <div style={S.field}>
          <label style={S.label}>📞 {t(lang,'phone')}</label>
          <input className="input" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder={t(lang,'phoneHolder')} />
        </div>
        <div style={S.field}>
          <label style={S.label}>✍️ {t(lang,'coverLetter')} (ixtiyoriy)</label>
          <textarea className="input" style={{ height:100, resize:'vertical' }} value={form.cover_letter} onChange={e => setForm({...form, cover_letter:e.target.value})} placeholder={t(lang,'coverHolder')} />
        </div>
        <div style={S.btns}>
          <button onClick={onClose} className="btn-outline">{t(lang,'cancel')}</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? '...' : `🚀 ${t(lang,'applyNow')}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const S = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:16, backdropFilter:'blur(4px)' },
  modal: { background:'#fff', borderRadius:20, padding:28, width:'100%', maxWidth:500, boxShadow:'0 24px 80px rgba(0,0,0,0.2)' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 },
  title: { fontSize:20, fontWeight:700, color:'#0A0A0A', marginBottom:4 },
  sub: { fontSize:14, color:'#71717A' },
  closeBtn: { background:'#F4F4F5', border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  field: { marginBottom:16 },
  label: { display:'block', fontSize:13, fontWeight:500, color:'#71717A', marginBottom:6 },
  btns: { display:'flex', gap:10, justifyContent:'flex-end', marginTop:24 },
};
