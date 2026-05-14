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
    const { data } = await supabase.from('jobs').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
    setJobs(data||[]); setLoading(false);
  }

  async function deleteJob(id) {
    if (!window.confirm(t(lang,'deleteConfirm'))) return;
    await supabase.from('jobs').delete().eq('id',id);
    toast.success(t(lang,'deleted'));
    setJobs(jobs.filter(j=>j.id!==id));
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📋 {t(lang,'myJobs')}</h1>
          <p style={{ fontSize:14, color:'#71717A' }}>{jobs.length} ta vakansiya</p>
        </div>
        <Link to="/post-job" className="btn-primary">➕ {t(lang,'postJob')}</Link>
      </div>

      {loading ? <p style={{ color:'#A1A1AA' }}>{t(lang,'loading')}</p>
      : jobs.length===0 ? (
        <div style={S.empty}>
          <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
          <p style={{ color:'#71717A', marginBottom:20 }}>Hali vakansiya joylashtirilmagan</p>
          <Link to="/post-job" className="btn-primary">➕ {t(lang,'postJob')}</Link>
        </div>
      ) : jobs.map(job => (
        <div key={job.id} style={{ position:'relative' }}>
          <JobCard job={job} showStatus />
          <button onClick={() => deleteJob(job.id)} style={S.delBtn}>🗑️</button>
        </div>
      ))}
    </div>
  );
}

const S = {
  page: { maxWidth:900, margin:'40px auto', padding:'0 24px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 },
  title: { fontSize:26, fontWeight:700, color:'#0A0A0A', marginBottom:2 },
  empty: { textAlign:'center', padding:64 },
  delBtn: { position:'absolute', top:12, right:12, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'5px 10px', cursor:'pointer', fontSize:14 },
};
