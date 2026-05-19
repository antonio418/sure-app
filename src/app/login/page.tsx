"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
         throw new Error('Supabase no está configurado. Faltan las llaves en .env.local');
      }

      let authError;
      if (password) {
         const { error } = await supabase.auth.signInWithPassword({ email, password });
         authError = error;
      } else {
         const { error } = await supabase.auth.signInWithOtp({
           email,
           options: { emailRedirectTo: `${window.location.origin}/admin` }
         });
         authError = error;
      }
      
      if (authError) throw authError;
      
      if (!password) {
         setSuccess(true);
      } else {
         window.location.href = '/admin';
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred during login verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al conectar con Google.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-sure-bg)] text-[var(--color-sure-text)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[rgba(0,229,255,0.05)] to-transparent pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[var(--color-sure-accent)]/20 flex flex-col items-center justify-center text-[var(--color-sure-accent)] border border-[var(--color-sure-accent)]/30 mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-center text-4xl font-extrabold text-white tracking-tight font-montserrat">
            Portal Secreto
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--color-sure-subtext)] uppercase tracking-widest font-bold">
            SURE Ecosystem
            </p>
        </div>

        <div className="glass py-10 px-6 sm:px-10 rounded-2xl shadow-2xl border-t-4 border-[var(--color-sure-accent)] relative">
          
          {success ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">¡Enlace Enviado!</h3>
              <p className="text-[var(--color-sure-subtext)] text-lg">
                Revisa la bandeja de entrada de <b>{email}</b>. Oprime el enlace mágico para acceder a tu plataforma segura de análisis de riesgos.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                  Correo Electrónico (Empresarial)
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-4 bg-black/40 border border-white/10 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-sure-accent)] focus:ring-1 focus:ring-[var(--color-sure-accent)] sm:text-lg text-white transition-colors"
                    placeholder="ejemplo@empresa.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
                  Contraseña (Opcional)
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-4 bg-black/40 border border-white/10 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-sure-accent)] focus:ring-1 focus:ring-[var(--color-sure-accent)] sm:text-lg text-white transition-colors"
                    placeholder="Dejar vacío para usar Enlace Mágico"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-[var(--color-sure-bg)] bg-[var(--color-sure-accent)] hover:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Confirmando Identidad...' : password ? 'Entrar con Contraseña' : 'Continuar sin Contraseña (Magic Link)'}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--color-sure-bg)] text-gray-400">O continuar con</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-white/20 rounded-xl shadow-sm text-lg font-bold text-white bg-white/5 hover:bg-white/10 focus:outline-none transition-all duration-300"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

            </form>
          )}
          
          <div className="mt-8 text-center border-t border-white/10 pt-6 space-y-4">
             <p className="text-[var(--color-sure-subtext)]">¿No tienes cuenta?</p>
             <Link href="/signup" className="text-white hover:text-[var(--color-sure-accent)] transition-colors flex items-center justify-center gap-2 font-bold mb-4">
                Crear una cuenta nueva <ArrowRight className="w-4 h-4" />
             </Link>
             
             <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm">
                <ArrowLeft className="w-4 h-4" /> Volver a Inicio
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
