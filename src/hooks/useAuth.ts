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
  const { user, isLoading, setUser, clearUser } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as any);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as any);
      } else {
        clearUser();
      }
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUser, clearUser]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    router.push('/login');
    router.refresh();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
