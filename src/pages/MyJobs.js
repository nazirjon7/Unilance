import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

export default function MyJobs() {
  const { lang, user } = useApp();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchMyJobs(); }, [user]);

  async function fetchMyJobs() {
    const { data } = await supabase.from('jobs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }

  async function deleteJob(id) {
    if (!window.confirm('Vakansiyani o\'chirmoqchimisiz?')) return;
    await supabase.from('jobs').delete().eq('id', id);
    toast.success('O\'chirildi');
    setJobs(jobs.filter(j => j.id !== id));
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 {t(lang,'myJobs')}</h1>
        <Link to="/post-job" style={styles.addBtn}>➕ {t(lang,'postJob')}</Link>
      </div>
      {loading ? (
        <p style={{ color: '#9ca3af' }}>{t(lang,'loading')}</p>
      ) : jobs.length === 0 ? (
        <div style={styles.empty}>
          <p>Hali vakansiya joylashtirilmagan</p>
          <Link to="/post-job" style={styles.addBtn}>➕ {t(lang,'postJob')}</Link>
        </div>
      ) : (
        jobs.map(job => (
          <div key={job.id} style={{ position: 'relative' }}>
            <JobCard job={job} />
            <button onClick={() => deleteJob(job.id)} style={styles.delBtn}>🗑️</button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 900, margin: '32px auto', padding: '0 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827' },
  addBtn: { padding: '10px 20px', background: '#1e40af', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 },
  empty: { textAlign: 'center', padding: '48px', color: '#9ca3af' },
  delBtn: { position: 'absolute', top: 12, right: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 14 },
};
