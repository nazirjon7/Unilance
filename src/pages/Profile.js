import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

export default function Profile() {
  const { user, profile, lang } = useApp();
  if (!user) return <div style={{ textAlign:'center', padding:80 }}>🔒 Kiring</div>;
  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.avatar}>{(profile?.name||user.email)?.[0]?.toUpperCase()}</div>
        <h1 style={S.name}>{profile?.name}</h1>
        <p style={S.email}>{user.email}</p>
        <span style={{ fontSize:13, padding:'5px 14px', borderRadius:99, background:'#EBF5FF', color:'#1A56DB', fontWeight:600 }}>{t(lang, profile?.role)}</span>
      </div>
    </div>
  );
}

const S = {
  page: { maxWidth:500, margin:'60px auto', padding:'0 24px' },
  card: { background:'#fff', border:'1px solid #E4E4E7', borderRadius:20, padding:40, textAlign:'center' },
  avatar: { width:72, height:72, borderRadius:'50%', background:'#1A56DB', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:700, margin:'0 auto 16px' },
  name: { fontSize:22, fontWeight:700, color:'#0A0A0A', marginBottom:4 },
  email: { fontSize:14, color:'#71717A', marginBottom:16 },
};
