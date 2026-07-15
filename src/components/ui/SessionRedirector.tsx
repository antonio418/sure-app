"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SessionRedirector() {
  useEffect(() => {
    const checkRedirect = async (session: any) => {
      if (session?.user) {
        // Check sessionStorage first (robust fallback for existing users)
        const pendingPrice = localStorage.getItem('pending_price_id');
        const pendingOption = localStorage.getItem('pending_option');
        const pendingPlanId = localStorage.getItem('pending_plan_id');

        if (pendingPrice) {
          if (pendingOption === 'single') {
            if (window.location.pathname !== '/auditoria-rma') {
              window.location.href = '/auditoria-rma';
            }
            return;
          } else if (pendingOption === 'project' && pendingPlanId) {
            // Clear keys for project redirect since destination page (/rma/plan/[id]) does not consume them
            localStorage.removeItem('pending_price_id');
            localStorage.removeItem('pending_option');
            localStorage.removeItem('pending_plan_id');
            
            if (window.location.pathname !== `/rma/plan/${pendingPlanId}`) {
              window.location.href = `/rma/plan/${pendingPlanId}`;
            }
            return;
          }
        }

        // Fallback to metadata (safe redirect without premature clearing)
        const meta = session.user.user_metadata;
        if (meta?.pending_price_id) {
          if (meta.pending_option === 'single') {
            if (window.location.pathname !== '/auditoria-rma') {
              window.location.href = '/auditoria-rma';
            }
          } else if (meta.pending_option === 'project' && meta.pending_plan_id) {
            if (window.location.pathname !== `/rma/plan/${meta.pending_plan_id}`) {
              window.location.href = `/rma/plan/${meta.pending_plan_id}`;
            }
          }
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkRedirect(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      checkRedirect(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
