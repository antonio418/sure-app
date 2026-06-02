"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Target, ShieldAlert, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import LanguageSelector from '@/components/ui/LanguageSelector';

export default function AdminHubPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Si la URL contiene un access_token (Magic Link), esperamos a que Supabase lo procese
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        return;
      }

      // Redirección inmediata a carga de documentos (RMA) tras pago exitoso
      // Se evalúa ANTES de la sesión para evitar bloqueos en modo Incógnito
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'true') {
          router.replace('/admin/rma');
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#050a14] flex items-center justify-center text-[var(--color-sure-accent)] font-mono">LOADING SECURE HUB...</div>;

  return (
    <div className="min-h-screen bg-[#050a14] text-white font-sans flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgba(0,229,255,0.02)] to-transparent pointer-events-none" />
      
      {/* Language Selector */}
      <div className="absolute top-8 right-8 z-50">
        <LanguageSelector />
      </div>
      
      <div className="z-10 text-center mb-16">
        <div className="flex justify-center mb-6">
          <Image src="/logo-sure.png" alt="SURE Logo" width={80} height={80} className="object-contain" priority />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white font-montserrat uppercase tracking-widest mb-4">Master Hub</h1>
        <p className="text-slate-400 font-mono text-sm max-w-xl mx-auto">SURE Ecosystem Secure Access Portal. Selecciona el módulo al que deseas acceder. Cada entorno opera de manera independiente para garantizar la confidencialidad.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full z-10">
        
        {/* Alfredo Module */}
        <Link href="/admin/alfredo" className="group relative glass p-6 rounded-3xl border border-white/10 hover:border-[var(--color-sure-accent)]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)] hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-sure-accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--color-sure-accent)]/20 transition-colors"></div>
           <div className="w-16 h-16 rounded-2xl bg-black/40 border border-[var(--color-sure-accent)]/30 flex items-center justify-center mb-6 text-[var(--color-sure-accent)] group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
           </div>
           <h2 className="text-xl font-bold text-white mb-2 font-montserrat tracking-wide">Agente Alfredo</h2>
           <p className="text-xs text-slate-400 mb-6 flex-1">Módulo de prospección B2B, búsqueda de C-Levels, originación de leads y Drip Campaigns.</p>
           <div className="mt-auto px-6 py-2 bg-[var(--color-sure-accent)]/10 text-[var(--color-sure-accent)] font-bold text-xs uppercase tracking-widest rounded-full border border-[var(--color-sure-accent)]/20 w-full">Acceder</div>
        </Link>

        {/* DNS Module */}
        <Link href="/admin/dns" className="group relative glass p-6 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
           <div className="w-16 h-16 rounded-2xl bg-black/40 border border-blue-500/30 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-8 h-8" />
           </div>
           <h2 className="text-xl font-bold text-white mb-2 font-montserrat tracking-wide">Auditoría DNS</h2>
           <p className="text-xs text-slate-400 mb-6 flex-1">Módulo de validación técnica de dominios, detección de fraudes de correo y seguridad perimetral.</p>
           <div className="mt-auto px-6 py-2 bg-blue-500/10 text-blue-400 font-bold text-xs uppercase tracking-widest rounded-full border border-blue-500/20 w-full">Acceder</div>
        </Link>

        {/* RMA Module */}
        <Link href="/admin/rma" className="group relative glass p-6 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors"></div>
           <div className="w-16 h-16 rounded-2xl bg-black/40 border border-purple-500/30 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-8 h-8" />
           </div>
           <h2 className="text-xl font-bold text-white mb-2 font-montserrat tracking-wide">Reportes RMA</h2>
           <p className="text-xs text-slate-400 mb-6 flex-1">Módulo de Reportes de Mitigación de Riesgos (RMA). Consolidación y firma electrónica.</p>
           <div className="mt-auto px-6 py-2 bg-purple-500/10 text-purple-400 font-bold text-xs uppercase tracking-widest rounded-full border border-purple-500/20 w-full">Acceder</div>
        </Link>

        {/* VIP Token Hub */}
        <Link href="/admin/vip" className="group relative glass p-6 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors"></div>
           <div className="w-16 h-16 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
           </div>
           <h2 className="text-xl font-bold text-white mb-2 font-montserrat tracking-wide">VIP Hub</h2>
           <p className="text-xs text-slate-400 mb-6 flex-1">Generación y control centralizado de cupones de acceso exclusivo (Free Trials).</p>
           <div className="mt-auto px-6 py-2 bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase tracking-widest rounded-full border border-emerald-500/20 w-full">Acceder</div>
        </Link>

      </div>
    </div>
  );
}
