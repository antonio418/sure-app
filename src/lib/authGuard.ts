import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Guardián de autenticación reutilizable para rutas de API.
 *
 * Dos formas de acceso válidas:
 *  1. El cron de Vercel: envía "Authorization: Bearer <CRON_SECRET>".
 *  2. Un usuario administrador con sesión: envía "Authorization: Bearer <access_token>"
 *     (el token de sesión de Supabase del navegador).
 *
 * IMPORTANTE: CRON_SECRET nunca debe salir al navegador. Solo se usa en Vercel.
 */

export function isCronRequest(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('authorization') || '';
  return auth === `Bearer ${secret}`;
}

/** Devuelve el usuario autenticado a partir del token de sesión, o null si no es válido. */
export async function getUserFromRequest(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Permite el paso si la petición viene del cron (con CRON_SECRET) o de un usuario con sesión.
 * Devuelve null si está autorizada, o una respuesta 401 si no lo está.
 */
export async function requireCronOrUser(req: Request): Promise<NextResponse | null> {
  if (isCronRequest(req)) return null;
  const user = await getUserFromRequest(req);
  if (user) return null;
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}

/**
 * Exige un usuario con sesión válida (sin acceso por cron).
 * Devuelve null si está autorizada, o una respuesta 401 si no lo está.
 */
export async function requireUser(req: Request): Promise<NextResponse | null> {
  const user = await getUserFromRequest(req);
  if (user) return null;
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}
