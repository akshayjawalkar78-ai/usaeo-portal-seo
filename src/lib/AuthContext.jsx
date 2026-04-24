import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [chapterAdminOf, setChapterAdminOf] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileAttempted, setProfileAttempted] = useState(false);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setProfileAttempted(true);
      return;
    }
    setIsProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('[auth] loadProfile error:', JSON.stringify(error));
        setProfile(null);
      } else {
        console.log('[auth] profile loaded:', data);
        setProfile(data);
        // Load chapter admin roles
        try {
          const email = data.email;
          if (email) {
            const { data: memberships } = await supabase
              .from('chapter_members')
              .select('chapter_id, role')
              .eq('user_email', email)
              .in('role', ['chapter_admin', 'founder'])
              .eq('status', 'active');
            setChapterAdminOf((memberships || []).map(m => m.chapter_id));
          }
        } catch (_) {}
      }
    } catch (e) {
      console.error('loadProfile threw:', e);
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
      setProfileAttempted(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Load profile before unblocking routing so role check has data
          await loadProfile(session.user.id);
        } else {
          setProfileAttempted(true);
        }
      } catch (e) {
        console.error('getSession error:', e);
        if (mounted) setProfileAttempted(true);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setProfileAttempted(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    try {
      // scope:'local' = clears localStorage only, no network call, never hangs
      await supabase.auth.signOut({ scope: 'local' });
    } catch (e) {
      console.error('signOut error:', e);
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setChapterAdminOf([]);
    setProfileAttempted(false);
  };

  const isAuthenticated = !!session?.user;
  const isAdmin = profile?.role === 'admin';
  const isChapterAdmin = chapterAdminOf.length > 0;

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      isAuthenticated,
      isAdmin,
      isChapterAdmin,
      chapterAdminOf,
      isLoading,
      isProfileLoading,
      profileAttempted,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
