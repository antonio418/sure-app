import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno asertivamente. 
// NOTA: Nunca expongas supabaseAdmin en el cliente (navegador), siempre úsalo en el servidor (API o Server Actions).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ Faltan las llaves de Supabase Admin (URL o SERVICE_ROLE_KEY).');
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://dummy.supabase.co', 
  supabaseServiceRoleKey || 'dummy_key_for_build', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
