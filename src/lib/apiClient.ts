import { supabase } from '@/lib/supabaseClient';

/**
 * fetch() con autenticación automática.
 *
 * Adjunta el token de sesión del usuario (Supabase) en la cabecera Authorization,
 * para que los endpoints protegidos del backend puedan verificar quién llama.
 * Úsalo en el panel de administración en lugar de fetch() para las acciones sensibles.
 */
export async function authedFetch(input: string, init: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = new Headers(init.headers || {});

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  return fetch(input, { ...init, headers });
}
