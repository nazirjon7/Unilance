import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';

const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Farg\'ona'];
const SECTORS = ['IT', 'Dizayn', 'Marketing', 'Moliya', 'Savdo', 'Tibbiyot', 'Ta\'lim'];

export default function Home() {
  const { lang, user } = useApp();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [jobType, setJobType] = useState('');
  const [sector, setSector] = useState('');
  const [sort, setSort] = useState('newest');
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    setLoading(true);
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchQ = !q || j.title?.toLowerCase().includes(q) || j.company_name?.toLowerCase().includes(q);
    const matchCity = !city || j.city === city;
    const matchType = !jobType || j.job_type === jobType;
    const matchSector = !sector || j.sector === sector;
    return matchQ && matchCity && matchType && matchSector;
  }).sort((a, b) => {
    if (sort === 'salary_high') return (b.salary_max || 0) - (a.salary_max || 0);
    if (sort === 'salary_low') return (a.salary_min || 0) - (b.salary_min || 0);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>{t(lang, 'hero_title')}</h1>
        <p style={styles.heroSub}>{t(lang, 'hero_sub')}</p>
        <div style={styles.searchBox}>
          <input style={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t(lang, 'searchPlaceholder')} />
          <select style={styles.select} value={city} onChange={e => setCity(e.target.value)}>
            <option value="">{t(lang, 'allCities')}</option>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button style={styles.searchBtn} onClick={() => {}}>🔍 {t(lang, 'search')}</button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.container}>
        <div style={styles.layout}>
          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div style={styles.filterSection}>
              <div style={styles.filterTitle}>{t(lang, 'jobType')}</div>
              {['fullTime','partTime','remote','freelance'].map(k => (
                <label key={k} style={styles.filterItem}>
                  <input type="radio" name="type" value={t(lang,k)} checked={jobType === t(lang,k)}
                    onChange={e => setJobType(e.target.value)} style={{ accentColor: '#1e40af' }} />
                  {t(lang, k)}
                </label>
              ))}
              <label style={styles.filterItem}>
                <input type="radio" name="type" value="" checked={!jobType} onChange={() => setJobType('')} style={{ accentColor: '#1e40af' }} />
                {t(lang, 'allTypes')}
              </label>
            </div>
            <div style={styles.filterSection}>
              <div style={styles.filterTitle}>{t(lang, 'sector')}</div>
              {SECTORS.map(s => (
                <label key={s} style={styles.filterItem}>
                  <input type="checkbox" checked={sector === s}
                    onChange={() => setSector(sector === s ? '' : s)} style={{ accentColor: '#1e40af' }} />
                  {s}
                </label>
              ))}
            </div>
          </aside>

          {/* Jobs list */}
          <div style={{ flex: 1 }}>
            <div style={styles.listHeader}>
              <span style={styles.count}>{filtered.length} {t(lang, 'found')}</span>
              <select style={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">{t(lang, 'sortNewest')}</option>
                <option value="salary_high">{t(lang, 'sortSalaryHigh')}</option>
                <option value="salary_low">{t(lang, 'sortSalaryLow')}</option>
              </select>
            </div>
            {loading ? (
              <div style={styles.empty}>⏳ {t(lang, 'loading')}</div>
            ) : filtered.length === 0 ? (
              <div style={styles.empty}>🔍 {t(lang, 'noJobs')}</div>
            ) : (
              filtered.map(job => (
                <JobCard key={job.id} job={job} onApply={user ? setApplyJob : null} />
              ))
            )}
          </div>
        </div>
      </div>

      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)', color: '#fff', padding: '64px 24px', textAlign: 'center' },
  heroTitle: { fontSize: 40, fontWeight: 800, marginBottom: 12, letterSpacing: -0.5 },
  heroSub: { fontSize: 18, opacity: 0.9, marginBottom: 32 },
  searchBox: { display: 'flex', gap: 8, maxWidth: 700, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' },
  searchInput: { flex: 2, minWidth: 220, padding: '12px 16px', border: 'none', borderRadius: 10, fontSize: 15, outline: 'none' },
  select: { flex: 1, minWidth: 140, padding: '12px 16px', border: 'none', borderRadius: 10, fontSize: 14, background: 'rgba(255,255,255,0.95)', outline: 'none' },
  searchBtn: { padding: '12px 24px', background: '#f59e0b', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, color: '#78350f', cursor: 'pointer', whiteSpace: 'nowrap' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  layout: { display: 'flex', gap: 24, alignItems: 'flex-start' },
  sidebar: { width: 220, flexShrink: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px' },
  filterSection: { marginBottom: 20 },
  filterTitle: { fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  filterItem: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 14, cursor: 'pointer' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  count: { fontSize: 14, color: '#6b7280' },
  sortSelect: { fontSize: 13, padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' },
  empty: { textAlign: 'center', padding: '48px', color: '#9ca3af', fontSize: 16 },
};
