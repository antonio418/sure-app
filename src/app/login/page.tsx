"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

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
                  Contraseña (Opcional para Pruebas)
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
                  {loading ? 'Confirmando Identidad...' : password ? 'Entrar con Contraseña' : 'Continuar sin Contraseña'}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
                <p className="text-xs text-[var(--color-sure-subtext)] text-center mt-4">
                  <strong className="text-[var(--color-sure-accent)]">Nota importante:</strong> Si dejas la contraseña vacía, te enviaremos un "Enlace Mágico" a tu correo.
                </p>
            </form>
          )}
          
          <div className="mt-8 text-center border-t border-white/10 pt-6">
             <Link href="/" className="text-[var(--color-sure-subtext)] hover:text-white transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver a SURE Landing Page
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
