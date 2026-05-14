import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
const AppContext = createContext();
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'uz');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id); else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id); else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);
  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data); setLoading(false);
  }
  const changeLang = l => { setLang(l); localStorage.setItem('lang', l); };
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  async function signUp(email, password, name, role = 'seeker') {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    if (data.user) await supabase.from('profiles').insert({ id: data.user.id, name, email, role });
    return { data };
  }
  const signOut = () => supabase.auth.signOut();
  return (
    <AppContext.Provider value={{ user, profile, lang, loading, changeLang, signIn, signUp, signOut }}>
      {children}
    </AppContext.Provider>
  );
}
export const useApp = () => useContext(AppContext);
