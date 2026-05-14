import React from 'react';

export default function Logo({ size = 'md' }) {
  const heights = { sm: 28, md: 36, lg: 48 };
  const textSizes = { sm: 15, md: 19, lg: 26 };
  const h = heights[size];
  const ts = textSizes[size];

  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <svg width={h} height={h} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
        <rect width="120" height="120" rx="22" fill="#1A56DB"/>
        <circle cx="60" cy="22" r="10" fill="white"/>
        <path d="M22 42 C22 42 22 78 22 82 C22 100 38 112 60 112 C82 112 98 100 98 82 C98 78 98 42 98 42 L80 42 C80 42 80 78 80 82 C80 90 71 96 60 96 C49 96 40 90 40 82 C40 78 40 42 40 42 Z" fill="white"/>
      </svg>
      <span style={{ fontSize:ts, fontWeight:700, color:'#0A0A0A', letterSpacing:'-0.5px', lineHeight:1 }}>
        Uni<span style={{ color:'#1A56DB' }}>lance</span>
      </span>
    </div>
  );
}
