import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

export default function JobCard({ job, onApply }) {
  const { lang } = useApp();

  const typeColors = {
    remote: { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7' },
    masofaviy: { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7' },
    featured: { bg: '#eff6ff', color: '#1e40af', border: '#93c5fd' },
  };

  const statusColors = {
    approved: { bg: '#ecfdf5', color: '#065f46' },
    pending: { bg: '#fefce8', color: '#854d0e' },
    rejected: { bg: '#fef2f2', color: '#991b1b' },
  };

  const isRemote = job.job_type?.toLowerCase().includes('masof') || job.job_type?.toLowerCase().includes('remote');
  const sc = statusColors[job.status] || statusColors.approved;

  function formatSalary(min, max) {
    if (!min && !max) return null;
    const fmt = n => n ? (n / 1000000).toFixed(0) + 'M' : '';
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `${t(lang,'to')} ${fmt(max)}`;
  }

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <div style={{ ...styles.card, ...(job.is_featured ? styles.featured : {}) }}>
      <div style={styles.top}>
        <div style={{ ...styles.logo, background: job.logo_color || '#eff6ff', color: job.logo_text_color || '#1e40af' }}>
          {(job.company_name || 'C')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={styles.title}>{job.title}</div>
          <div style={styles.meta}>
            🏢 {job.company_name} &nbsp;·&nbsp; 📍 {job.city}
          </div>
          <div style={styles.tags}>
            {job.sector && <span style={styles.tag}>{job.sector}</span>}
            {job.job_type && <span style={styles.tag}>{job.job_type}</span>}
            {isRemote && <span style={{ ...styles.tag, background: typeColors.remote.bg, color: typeColors.remote.color, border: `1px solid ${typeColors.remote.border}` }}>🌐 {t(lang,'remote')}</span>}
            {job.is_featured && <span style={{ ...styles.tag, background: typeColors.featured.bg, color: typeColors.featured.color, border: `1px solid ${typeColors.featured.border}` }}>⭐ {t(lang,'featured')}</span>}
          </div>
        </div>
        {job.status && job.status !== 'approved' && (
          <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
            {t(lang, job.status)}
          </span>
        )}
      </div>
      <div style={styles.bottom}>
        {salary && <span style={styles.salary}>💰 {salary} UZS</span>}
        <span style={styles.date}>🕐 {job.created_at ? new Date(job.created_at).toLocaleDateString() : ''}</span>
        {onApply && (
          <button onClick={() => onApply(job)} style={styles.applyBtn}>
            {t(lang, 'applyNow')}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px', marginBottom: 10, cursor: 'pointer', transition: 'border-color 0.15s' },
  featured: { borderLeft: '3px solid #1e40af' },
  top: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  logo: { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 },
  title: { fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 3 },
  meta: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tag: { fontSize: 12, padding: '3px 10px', borderRadius: 99, background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' },
  statusBadge: { fontSize: 12, padding: '3px 10px', borderRadius: 99, fontWeight: 500, flexShrink: 0 },
  bottom: { marginTop: 12, paddingTop: 10, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  salary: { fontSize: 14, fontWeight: 600, color: '#1e40af' },
  date: { fontSize: 12, color: '#9ca3af', marginLeft: 'auto' },
  applyBtn: { fontSize: 13, padding: '6px 16px', borderRadius: 8, border: '1px solid #1e40af', background: 'transparent', color: '#1e40af', cursor: 'pointer', fontWeight: 500 },
};
