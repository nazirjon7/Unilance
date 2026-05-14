import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

const COLORS = ['#EBF5FF','#F0FDF4','#FFF7ED','#FDF4FF','#FEF2F2','#FFFBEB'];
const TEXT_COLORS = ['#1A56DB','#16A34A','#EA580C','#9333EA','#DC2626','#D97706'];

export default function JobCard({ job, onApply, showStatus }) {
  const { lang } = useApp();
  const idx = job.company_name ? job.company_name.charCodeAt(0) % COLORS.length : 0;

  function formatSalary(min, max) {
    if (!min && !max) return null;
    const fmt = n => n >= 1000000 ? (n/1000000).toFixed(0)+'M' : (n/1000).toFixed(0)+'K';
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `до ${fmt(max)}`;
  }

  const salary = formatSalary(job.salary_min, job.salary_max);
  const isRemote = job.job_type?.toLowerCase().includes('masof') || job.job_type?.toLowerCase().includes('remote');

  return (
    <div style={S.card} onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'} onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
      {job.is_featured && <div style={S.featuredBar} />}
      <div style={S.top}>
        <div style={{ ...S.logo, background: COLORS[idx], color: TEXT_COLORS[idx] }}>
          {(job.company_name || 'C')[0].toUpperCase()}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={S.title}>{job.title}</div>
          <div style={S.meta}>
            <span>{job.company_name}</span>
            <span style={S.dot}>·</span>
            <span>📍 {job.city}</span>
          </div>
          <div style={S.tags}>
            {job.sector && <span style={S.tagGray}>{job.sector}</span>}
            {job.job_type && <span style={S.tagGray}>{job.job_type}</span>}
            {isRemote && <span style={S.tagGreen}>🌐 {t(lang,'remote')}</span>}
            {job.is_featured && <span style={S.tagBlue}>⭐ {t(lang,'featured')}</span>}
            {showStatus && job.status && (
              <span className={`badge-status-${job.status}`}>{t(lang, job.status)}</span>
            )}
          </div>
        </div>
      </div>
      <div style={S.bottom}>
        {salary ? <span style={S.salary}>💰 {salary} UZS</span> : <span />}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={S.date}>{job.created_at ? new Date(job.created_at).toLocaleDateString('uz-UZ') : ''}</span>
          {onApply && (
            <button onClick={() => onApply(job)} style={S.applyBtn}>
              {t(lang,'applyNow')} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  card: { position:'relative', background:'#fff', border:'1px solid #E4E4E7', borderRadius:16, padding:'20px 24px', marginBottom:10, transition:'all 0.2s', overflow:'hidden' },
  featuredBar: { position:'absolute', left:0, top:0, bottom:0, width:3, background:'#1A56DB', borderRadius:'3px 0 0 3px' },
  top: { display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 },
  logo: { width:46, height:46, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, flexShrink:0 },
  title: { fontSize:15, fontWeight:600, color:'#0A0A0A', marginBottom:4, lineHeight:1.3 },
  meta: { fontSize:13, color:'#71717A', marginBottom:10, display:'flex', alignItems:'center', gap:6 },
  dot: { color:'#D4D4D8' },
  tags: { display:'flex', flexWrap:'wrap', gap:6 },
  tagGray: { fontSize:12, padding:'3px 10px', borderRadius:99, background:'#F4F4F5', color:'#71717A', fontWeight:500 },
  tagGreen: { fontSize:12, padding:'3px 10px', borderRadius:99, background:'#F0FDF4', color:'#16A34A', fontWeight:500 },
  tagBlue: { fontSize:12, padding:'3px 10px', borderRadius:99, background:'#EBF5FF', color:'#1A56DB', fontWeight:500 },
  bottom: { display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid #F4F4F5' },
  salary: { fontSize:14, fontWeight:600, color:'#0A0A0A' },
  date: { fontSize:12, color:'#A1A1AA' },
  applyBtn: { fontSize:13, padding:'7px 18px', borderRadius:8, border:'1.5px solid #0A0A0A', background:'transparent', color:'#0A0A0A', cursor:'pointer', fontWeight:500, transition:'all 0.15s' },
};
