import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import toast from 'react-hot-toast';

export default function ApplyModal({ job, onClose }) {
  const { lang, user } = useApp();
  const [form, setForm] = useState({ cover_letter: '', phone: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const { error } = await supabase.from('applications').insert({
      job_id: job.id,
      user_id: user.id,
      cover_letter: form.cover_letter,
      phone: form.phone,
      status: 'pending'
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t(lang, 'applySent'));
    onClose();
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{job.title}</h2>
        <p style={styles.company}>🏢 {job.company_name} · 📍 {job.city}</p>
        <div style={styles.field}>
          <label style={styles.label}>📞 Telefon raqam</label>
          <input style={styles.input} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+998 90 123 45 67" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>✍️ Motivatsiya xati (ixtiyoriy)</label>
          <textarea style={styles.textarea} value={form.cover_letter} onChange={e => setForm({...form, cover_letter: e.target.value})}
            placeholder="Nima uchun ushbu lavozimga mos ekansiz?" />
        </div>
        <div style={styles.btns}>
          <button onClick={onClose} style={styles.cancelBtn}>{t(lang,'cancel')}</button>
          <button onClick={handleSubmit} disabled={loading} style={styles.submitBtn}>
            {loading ? '...' : `🚀 ${t(lang,'applyNow')}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 },
  modal: { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  title: { fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 },
  company: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, height: 100, resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  btns: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 },
  cancelBtn: { padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14 },
  submitBtn: { padding: '10px 24px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
};
