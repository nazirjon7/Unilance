import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import toast from 'react-hot-toast';

export default function Admin() {
  const { lang, profile } = useApp();
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [{ data:j },{ data:u }] = await Promise.all([
      supabase.from('jobs').select('*').order('created_at',{ascending:false}),
      supabase.from('profiles').select('*').order('created_at',{ascending:false})
    ]);
    setJobs(j||[]); setUsers(u||[]); setLoading(false);
  }

  if (profile?.role !== 'admin') return <div style={{ textAlign:'center', padding:80, fontSize:18, color:'#71717A' }}>🔒 Admin huquqi yo'q</div>;

  async function updateJobStatus(id, status) {
    await supabase.from('jobs').update({ status }).eq('id',id);
    setJobs(jobs.map(j => j.id===id ? {...j,status} : j));
    toast.success(status==='approved' ? '✅ Tasdiqlandi' : '❌ Rad etildi');
  }

  async function updateUserRole(id, role) {
    await supabase.from('profiles').update({ role }).eq('id',id);
    setUsers(users.map(u => u.id===id ? {...u,role} : u));
    toast.success(t(lang,'roleSaved'));
  }

  const stats = [
    { icon:'💼', num: jobs.length, label: t(lang,'totalJobs'), bg:'#EBF5FF', color:'#1A56DB' },
    { icon:'⏳', num: jobs.filter(j=>j.status==='pending').length, label: t(lang,'pendingJobs'), bg:'#FFFBEB', color:'#D97706' },
    { icon:'✅', num: jobs.filter(j=>j.status==='approved').length, label: t(lang,'approved'), bg:'#F0FDF4', color:'#16A34A' },
    { icon:'👥', num: users.length, label: t(lang,'totalUsers'), bg:'#F4F4F5', color:'#0A0A0A' },
  ];

  return (
    <div style={S.page}>
      <h1 style={S.title}>🛡️ {t(lang,'adminPanel')}</h1>

      <div style={S.statsGrid}>
        {stats.map((s,i) => (
          <div key={i} style={{ ...S.statCard, background:s.bg }}>
            <span style={{ fontSize:28 }}>{s.icon}</span>
            <span style={{ fontSize:32, fontWeight:800, color:s.color }}>{s.num}</span>
            <span style={{ fontSize:13, color:'#71717A' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={S.tabs}>
        {['jobs','users'].map(tb => (
          <button key={tb} onClick={() => setTab(tb)}
            style={{ ...S.tab, ...(tab===tb ? S.tabActive : {}) }}>
            {tb==='jobs' ? `💼 ${t(lang,'allJobs')}` : `👥 ${t(lang,'users')}`}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color:'#A1A1AA' }}>{t(lang,'loading')}</p> : (
        <div style={S.tableWrap}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#FAFAFA' }}>
                {(tab==='jobs'
                  ? [t(lang,'jobTitle'), t(lang,'company'), t(lang,'city'), 'Status', t(lang,'approve')]
                  : [t(lang,'name'), t(lang,'email'), 'Rol', 'O\'zgartirish']
                ).map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {tab==='jobs' ? jobs.map(job => (
                <tr key={job.id} style={{ borderBottom:'1px solid #F4F4F5' }}>
                  <td style={S.td}><span style={{ fontWeight:500 }}>{job.title}</span></td>
                  <td style={S.td}>{job.company_name}</td>
                  <td style={S.td}>{job.city}</td>
                  <td style={S.td}><span className={`badge-status-${job.status||'pending'}`}>{t(lang,job.status||'pending')}</span></td>
                  <td style={S.td}>
                    <div style={{ display:'flex', gap:6 }}>
                      {job.status!=='approved' && <button onClick={() => updateJobStatus(job.id,'approved')} style={S.approveBtn}>✅</button>}
                      {job.status!=='rejected' && <button onClick={() => updateJobStatus(job.id,'rejected')} style={S.rejectBtn}>❌</button>}
                    </div>
                  </td>
                </tr>
              )) : users.map(u => (
                <tr key={u.id} style={{ borderBottom:'1px solid #F4F4F5' }}>
                  <td style={S.td}><span style={{ fontWeight:500 }}>{u.name}</span></td>
                  <td style={S.td}>{u.email}</td>
                  <td style={S.td}><span style={{ fontSize:12, padding:'3px 10px', borderRadius:99, background:'#EBF5FF', color:'#1A56DB', fontWeight:600 }}>{t(lang,u.role)}</span></td>
                  <td style={S.td}>
                    <select value={u.role} onChange={e => updateUserRole(u.id,e.target.value)} style={{ padding:'5px 10px', border:'1.5px solid #E4E4E7', borderRadius:8, fontSize:13 }}>
                      {['seeker','employer','admin'].map(r => <option key={r} value={r}>{t(lang,r)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { maxWidth:1100, margin:'40px auto', padding:'0 24px' },
  title: { fontSize:26, fontWeight:700, color:'#0A0A0A', marginBottom:28 },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:32 },
  statCard: { borderRadius:16, padding:'20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:6 },
  tabs: { display:'flex', gap:8, marginBottom:20 },
  tab: { padding:'9px 20px', border:'1.5px solid #E4E4E7', borderRadius:10, background:'#fff', cursor:'pointer', fontSize:14, fontWeight:500, transition:'all 0.15s' },
  tabActive: { background:'#0A0A0A', color:'#fff', border:'1.5px solid #0A0A0A' },
  tableWrap: { background:'#fff', border:'1px solid #E4E4E7', borderRadius:16, overflow:'hidden' },
  th: { padding:'12px 16px', fontSize:11, fontWeight:700, color:'#A1A1AA', textAlign:'left', textTransform:'uppercase', letterSpacing:'0.8px' },
  td: { padding:'13px 16px', fontSize:14, color:'#374151' },
  approveBtn: { padding:'5px 12px', background:'#F0FDF4', border:'1px solid #86EFAC', borderRadius:8, cursor:'pointer', fontSize:13 },
  rejectBtn: { padding:'5px 12px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, cursor:'pointer', fontSize:13 },
};
