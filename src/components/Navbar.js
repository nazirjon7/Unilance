import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import Logo from './Logo';

export default function Navbar() {
  const { user, profile, lang, changeLang, signOut } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() { await signOut(); navigate('/'); setMenuOpen(false); }

  const isActive = path => location.pathname === path;

  return (
    <nav style={S.nav}>
      <div style={S.inner}>
        <Link to="/"><Logo /></Link>

        <div style={S.center}>
          <Link to="/" style={{ ...S.navLink, ...(isActive('/') ? S.navActive : {}) }}>
            {t(lang,'allJobs')}
          </Link>
          {(profile?.role === 'employer' || profile?.role === 'admin') && (
            <Link to="/post-job" style={{ ...S.navLink, ...(isActive('/post-job') ? S.navActive : {}) }}>
              {t(lang,'postJob')}
            </Link>
          )}
          {profile?.role === 'admin' && (
            <Link to="/admin" style={{ ...S.navLink, ...(isActive('/admin') ? S.navActive : {}) }}>
              {t(lang,'adminPanel')}
            </Link>
          )}
        </div>

        <div style={S.right}>
          <div style={S.langSwitch}>
            {['uz','ru','en'].map(l => (
              <button key={l} onClick={() => changeLang(l)}
                style={{ ...S.langBtn, ...(lang === l ? S.langActive : {}) }}>{l.toUpperCase()}</button>
            ))}
          </div>

          {user ? (
            <div style={{ position:'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={S.avatarBtn}>
                <div style={S.avatar}>{(profile?.name || user.email)?.[0]?.toUpperCase()}</div>
                <span style={{ fontSize:14, fontWeight:500 }}>{profile?.name?.split(' ')[0] || 'Profil'}</span>
                <span style={{ fontSize:12, color:'#71717A' }}>▾</span>
              </button>
              {menuOpen && (
                <div style={S.dropdown}>
                  {profile?.role === 'employer' && (
                    <Link to="/my-jobs" style={S.dropItem} onClick={() => setMenuOpen(false)}>
                      📋 {t(lang,'myJobs')}
                    </Link>
                  )}
                  <Link to="/profile" style={S.dropItem} onClick={() => setMenuOpen(false)}>
                    👤 {t(lang,'profile')}
                  </Link>
                  <div style={{ margin:'4px 8px', borderTop:'1px solid #F4F4F5' }} />
                  <button onClick={handleLogout} style={{ ...S.dropItem, color:'#DC2626', background:'none', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
                    🚪 {t(lang,'logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <Link to="/login" style={S.loginBtn}>{t(lang,'login')}</Link>
              <Link to="/register" style={S.registerBtn}>{t(lang,'register')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const S = {
  nav: { background:'#fff', borderBottom:'1px solid #E4E4E7', position:'sticky', top:0, zIndex:50 },
  inner: { maxWidth:1200, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', gap:24 },
  center: { display:'flex', gap:4, flex:1, justifyContent:'center' },
  navLink: { padding:'6px 14px', borderRadius:8, fontSize:14, fontWeight:500, color:'#71717A', transition:'all 0.15s' },
  navActive: { background:'#F4F4F5', color:'#0A0A0A' },
  right: { display:'flex', alignItems:'center', gap:12 },
  langSwitch: { display:'flex', background:'#F4F4F5', borderRadius:8, padding:2, gap:2 },
  langBtn: { padding:'4px 10px', fontSize:11, fontWeight:700, border:'none', background:'none', cursor:'pointer', borderRadius:6, color:'#71717A', letterSpacing:'0.3px' },
  langActive: { background:'#fff', color:'#0A0A0A', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' },
  avatarBtn: { display:'flex', alignItems:'center', gap:8, background:'none', border:'1px solid #E4E4E7', borderRadius:10, padding:'6px 12px', cursor:'pointer', transition:'all 0.15s' },
  avatar: { width:28, height:28, borderRadius:'50%', background:'#1A56DB', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 },
  dropdown: { position:'absolute', right:0, top:'calc(100% + 6px)', background:'#fff', border:'1px solid #E4E4E7', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', minWidth:200, padding:6, zIndex:100 },
  dropItem: { display:'block', padding:'8px 12px', fontSize:14, color:'#374151', textDecoration:'none', borderRadius:8 },
  loginBtn: { padding:'8px 18px', border:'1.5px solid #E4E4E7', borderRadius:10, color:'#0A0A0A', fontSize:14, fontWeight:500 },
  registerBtn: { padding:'8px 18px', background:'#1A56DB', borderRadius:10, color:'#fff', fontSize:14, fontWeight:500 },
};
