"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SessionRedirector() {
  useEffect(() => {
    const checkRedirect = async (session: any) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        if (meta?.pending_price_id) {
          if (meta.pending_option === 'single') {
            window.location.href = '/auditoria-rma';
          } else if (meta.pending_option === 'project' && meta.pending_plan_id) {
            window.location.href = `/rma/plan/${meta.pending_plan_id}`;
          }
        }
      }
    };

    // Check initial session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkRedirect(session);
    });

    // Listen to real-time auth events (e.g. Magic Link login callback processing)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      checkRedirect(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
