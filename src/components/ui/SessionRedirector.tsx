"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SessionRedirector() {
  useEffect(() => {
    const checkRedirect = async (session: any) => {
      if (session?.user) {
        // Check sessionStorage first (robust fallback for existing users)
        const pendingPrice = sessionStorage.getItem('pending_price_id');
        const pendingOption = sessionStorage.getItem('pending_option');
        const pendingPlanId = sessionStorage.getItem('pending_plan_id');

        if (pendingPrice) {
          if (pendingOption === 'single') {
            window.location.href = '/auditoria-rma';
            return;
          } else if (pendingOption === 'project' && pendingPlanId) {
            window.location.href = `/rma/plan/${pendingPlanId}`;
            return;
          }
        }

        // Fallback to metadata
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
