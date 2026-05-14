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
    const [{ data: j }, { data: u }] = await Promise.all([
      supabase.from('jobs').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false })
    ]);
    setJobs(j || []);
    setUsers(u || []);
    setLoading(false);
  }

  if (profile?.role !== 'admin') {
    return <div style={{ textAlign: 'center', padding: 80, fontSize: 18, color: '#6b7280' }}>🔒 Admin huquqi yo'q</div>;
  }

  async function updateJobStatus(id, status) {
    await supabase.from('jobs').update({ status }).eq('id', id);
    setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
    toast.success(status === 'approved' ? t(lang,'approved') : t(lang,'rejected'));
  }

  async function updateUserRole(id, role) {
    await supabase.from('profiles').update({ role }).eq('id', id);
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    toast.success('Rol yangilandi');
  }

  const statusColor = { approved: '#ecfdf5', pending: '#fefce8', rejected: '#fef2f2' };
  const statusText = { approved: '#065f46', pending: '#854d0e', rejected: '#991b1b' };

  const stats = [
    { label: t(lang,'totalJobs'), value: jobs.length, icon: '💼' },
    { label: t(lang,'pendingJobs'), value: jobs.filter(j => j.status === 'pending').length, icon: '⏳' },
    { label: t(lang,'totalUsers'), value: users.length, icon: '👥' },
    { label: 'Ish beruvchilar', value: users.filter(u => u.role === 'employer').length, icon: '🏢' },
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛡️ {t(lang,'adminPanel')}</h1>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {stats.map((s,i) => (
          <div key={i} style={styles.statCard}>
            <span style={styles.statIcon}>{s.icon}</span>
            <span style={styles.statValue}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['jobs','users'].map(tab2 => (
          <button key={tab2} onClick={() => setTab(tab2)}
            style={{ ...styles.tab, ...(tab === tab2 ? styles.tabActive : {}) }}>
            {tab2 === 'jobs' ? `💼 ${t(lang,'allJobs')}` : `👥 ${t(lang,'users')}`}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: '#9ca3af' }}>{t(lang,'loading')}</p> : (
        tab === 'jobs' ? (
          <div style={styles.table}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {[t(lang,'jobTitle'), t(lang,'company'), t(lang,'city'), t(lang,'status'), t(lang,'actions')].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={styles.td}>{job.title}</td>
                    <td style={styles.td}>{job.company_name}</td>
                    <td style={styles.td}>{job.city}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: statusColor[job.status] || '#f3f4f6', color: statusText[job.status] || '#6b7280' }}>
                        {t(lang, job.status || 'pending')}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {job.status !== 'approved' && (
                          <button onClick={() => updateJobStatus(job.id, 'approved')} style={styles.approveBtn}>✅</button>
                        )}
                        {job.status !== 'rejected' && (
                          <button onClick={() => updateJobStatus(job.id, 'rejected')} style={styles.rejectBtn}>❌</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.table}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {[t(lang,'name'), t(lang,'email'), t(lang,'selectRole'), t(lang,'actions')].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: '#eff6ff', color: '#1e40af' }}>{t(lang, u.role)}</span>
                    </td>
                    <td style={styles.td}>
                      <select value={u.role} onChange={e => updateUserRole(u.id, e.target.value)} style={styles.roleSelect}>
                        {['seeker','employer','admin'].map(r => <option key={r} value={r}>{t(lang,r)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 1100, margin: '32px auto', padding: '0 24px' },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#111827' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 28 },
  statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  statIcon: { fontSize: 28 },
  statValue: { fontSize: 32, fontWeight: 800, color: '#1e40af' },
  statLabel: { fontSize: 13, color: '#6b7280', textAlign: 'center' },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: { padding: '8px 20px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14 },
  tabActive: { background: '#1e40af', color: '#fff', border: '1px solid #1e40af' },
  table: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' },
  th: { padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 },
  td: { padding: '12px 16px', fontSize: 14, color: '#374151' },
  badge: { padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 },
  approveBtn: { padding: '4px 10px', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  rejectBtn: { padding: '4px 10px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  roleSelect: { padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 },
};
