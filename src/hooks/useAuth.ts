/**
 * Auth Hook
 * Client-side authentication state and actions
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const router = useRouter();
  const { user, session, isLoading, setSession, logout: storeLogout } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setSession]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    storeLogout();
    router.push('/login');
    router.refresh();
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
