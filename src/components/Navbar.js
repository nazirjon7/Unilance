import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

export default function Navbar() {
  const { user, profile, lang, changeLang, signOut } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  const langs = ['uz', 'ru', 'en'];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>💼</span>
          {t(lang, 'siteName')}
        </Link>

        <div style={styles.right}>
          <div style={styles.langSwitch}>
            {langs.map(l => (
              <button key={l} onClick={() => changeLang(l)}
                style={{ ...styles.langBtn, ...(lang === l ? styles.langActive : {}) }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {user ? (
            <div style={styles.userMenu}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={styles.avatarBtn}>
                <span style={styles.avatar}>{(profile?.name || user.email)?.[0]?.toUpperCase()}</span>
                <span style={styles.userName}>{profile?.name || user.email}</span>
                <span>▾</span>
              </button>
              {menuOpen && (
                <div style={styles.dropdown}>
                  {profile?.role === 'employer' && (
                    <Link to="/post-job" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                      ➕ {t(lang, 'postJob')}
                    </Link>
                  )}
                  {profile?.role === 'employer' && (
                    <Link to="/my-jobs" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                      📋 {t(lang, 'myJobs')}
                    </Link>
                  )}
                  {profile?.role === 'admin' && (
                    <Link to="/admin" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                      🛡️ {t(lang, 'adminPanel')}
                    </Link>
                  )}
                  <Link to="/profile" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                    👤 {t(lang, 'profile')}
                  </Link>
                  <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #eee' }} />
                  <button onClick={handleLogout} style={{ ...styles.dropItem, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                    🚪 {t(lang, 'logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" style={styles.loginBtn}>{t(lang, 'login')}</Link>
              <Link to="/register" style={styles.registerBtn}>{t(lang, 'register')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 20, color: '#1e40af', textDecoration: 'none' },
  logoIcon: { fontSize: 22 },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  langSwitch: { display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 2, gap: 2 },
  langBtn: { padding: '4px 10px', fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6, color: '#6b7280' },
  langActive: { background: '#fff', color: '#1e40af', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  userMenu: { position: 'relative' },
  avatarBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 14 },
  avatar: { width: 28, height: 28, borderRadius: '50%', background: '#1e40af', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 },
  userName: { fontSize: 14, fontWeight: 500 },
  dropdown: { position: 'absolute', right: 0, top: '100%', marginTop: 4, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 200, padding: 6, zIndex: 100 },
  dropItem: { display: 'block', padding: '8px 12px', fontSize: 14, color: '#374151', textDecoration: 'none', borderRadius: 6, cursor: 'pointer' },
  loginBtn: { padding: '8px 18px', border: '1px solid #1e40af', borderRadius: 8, color: '#1e40af', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  registerBtn: { padding: '8px 18px', background: '#1e40af', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
};
