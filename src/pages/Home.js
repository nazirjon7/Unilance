import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';

const CITIES = ['Toshkent','Samarqand','Buxoro','Namangan','Andijon',"Farg'ona",'Qarshi'];
const SECTORS = ['IT','Dizayn','Marketing','Moliya','Savdo','Tibbiyot',"Ta'lim",'Muhandislik'];

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
    const { data } = await supabase.from('jobs').select('*').eq('status','approved')
      .order('is_featured', { ascending:false }).order('created_at', { ascending:false });
    setJobs(data || []);
    setLoading(false);
  }

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    return (!q || j.title?.toLowerCase().includes(q) || j.company_name?.toLowerCase().includes(q))
      && (!city || j.city === city)
      && (!jobType || j.job_type === jobType)
      && (!sector || j.sector === sector);
  }).sort((a,b) => {
    if (sort === 'salary_high') return (b.salary_max||0)-(a.salary_max||0);
    if (sort === 'salary_low') return (a.salary_min||0)-(b.salary_min||0);
    return new Date(b.created_at)-new Date(a.created_at);
  });

  const stats = [
    { num: '500+', label: t(lang,'stats_companies') },
    { num: '10K+', label: t(lang,'stats_jobs') },
    { num: '50K+', label: t(lang,'stats_hired') },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroBadge}>🇺🇿 O'zbekiston #1 freelance platformasi</div>
          <h1 style={S.heroTitle}>
            {t(lang,'hero_title').split('\n').map((line,i) => (
              <span key={i}>{i===1?<em style={{fontStyle:'italic',color:'#1A56DB'}}>{line}</em>:line}<br/></span>
            ))}
          </h1>
          <p style={S.heroSub}>{t(lang,'hero_sub')}</p>

          <div style={S.searchBox}>
            <input style={S.searchInput} value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t(lang,'searchPlaceholder')} />
            <select style={S.searchSelect} value={city} onChange={e => setCity(e.target.value)}>
              <option value="">{t(lang,'allCities')}</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="btn-primary" style={{ padding:'12px 28px', fontSize:15, borderRadius:12, whiteSpace:'nowrap' }}>
              🔍 {t(lang,'search')}
            </button>
          </div>

          <div style={S.statsRow}>
            {stats.map((s,i) => (
              <div key={i} style={S.statItem}>
                <span style={S.statNum}>{s.num}</span>
                <span style={S.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={S.container}>
        <div style={S.layout}>
          {/* Sidebar */}
          <aside style={S.sidebar}>
            <div style={S.filterBlock}>
              <div style={S.filterTitle}>{t(lang,'jobType')}</div>
              <label style={S.filterItem}>
                <input type="radio" name="type" value="" checked={!jobType} onChange={() => setJobType('')} style={S.radio} />
                <span>{t(lang,'allTypes')}</span>
              </label>
              {['fullTime','partTime','remote','freelance'].map(k => (
                <label key={k} style={S.filterItem}>
                  <input type="radio" name="type" value={t(lang,k)} checked={jobType===t(lang,k)} onChange={e => setJobType(e.target.value)} style={S.radio} />
                  <span>{t(lang,k)}</span>
                </label>
              ))}
            </div>
            <div style={S.filterBlock}>
              <div style={S.filterTitle}>{t(lang,'sector')}</div>
              {SECTORS.map(s => (
                <label key={s} style={S.filterItem}>
                  <input type="checkbox" checked={sector===s} onChange={() => setSector(sector===s?'':s)} style={S.radio} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Jobs */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={S.listHeader}>
              <span style={{ fontSize:14, color:'#71717A', fontWeight:500 }}>{filtered.length} {t(lang,'found')}</span>
              <select style={{ fontSize:13, padding:'7px 12px', border:'1.5px solid #E4E4E7', borderRadius:8, background:'#fff', cursor:'pointer' }}
                value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">{t(lang,'sortNewest')}</option>
                <option value="salary_high">{t(lang,'sortSalaryHigh')}</option>
                <option value="salary_low">{t(lang,'sortSalaryLow')}</option>
              </select>
            </div>

            {loading ? (
              <div style={S.empty}>
                <div style={S.spinner} />
                <p style={{ color:'#A1A1AA', marginTop:12 }}>{t(lang,'loading')}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                <p style={{ color:'#71717A', fontSize:16 }}>{t(lang,'noJobs')}</p>
              </div>
            ) : (
              filtered.map(job => <JobCard key={job.id} job={job} onApply={user ? setApplyJob : null} />)
            )}
          </div>
        </div>
      </div>

      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
}

const S = {
  hero: { background:'#fff', borderBottom:'1px solid #E4E4E7', padding:'72px 24px 56px' },
  heroInner: { maxWidth:780, margin:'0 auto', textAlign:'center' },
  heroBadge: { display:'inline-block', background:'#F4F4F5', color:'#71717A', fontSize:13, fontWeight:600, padding:'6px 16px', borderRadius:99, marginBottom:24, letterSpacing:'0.2px' },
  heroTitle: { fontFamily:"'DM Serif Display', serif", fontSize:52, fontWeight:400, lineHeight:1.1, color:'#0A0A0A', marginBottom:16, letterSpacing:'-1px' },
  heroSub: { fontSize:17, color:'#71717A', marginBottom:36, lineHeight:1.6 },
  searchBox: { display:'flex', gap:10, background:'#F4F4F5', padding:8, borderRadius:16, marginBottom:36, flexWrap:'wrap' },
  searchInput: { flex:2, minWidth:200, padding:'12px 16px', border:'none', borderRadius:10, fontSize:15, outline:'none', background:'#fff', fontFamily:"'DM Sans',sans-serif" },
  searchSelect: { flex:1, minWidth:140, padding:'12px 16px', border:'none', borderRadius:10, fontSize:14, background:'#fff', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" },
  statsRow: { display:'flex', gap:32, justifyContent:'center', flexWrap:'wrap' },
  statItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
  statNum: { fontSize:24, fontWeight:700, color:'#0A0A0A', letterSpacing:'-0.5px' },
  statLabel: { fontSize:13, color:'#71717A' },
  container: { maxWidth:1200, margin:'0 auto', padding:'36px 24px' },
  layout: { display:'flex', gap:28, alignItems:'flex-start' },
  sidebar: { width:220, flexShrink:0, background:'#fff', border:'1px solid #E4E4E7', borderRadius:16, padding:20 },
  filterBlock: { marginBottom:24 },
  filterTitle: { fontSize:11, fontWeight:700, color:'#A1A1AA', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:12 },
  filterItem: { display:'flex', alignItems:'center', gap:8, padding:'5px 0', fontSize:14, cursor:'pointer', color:'#374151' },
  radio: { accentColor:'#0A0A0A', cursor:'pointer' },
  listHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  empty: { textAlign:'center', padding:'64px 24px' },
  spinner: { width:32, height:32, border:'3px solid #E4E4E7', borderTop:'3px solid #0A0A0A', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' },
};
