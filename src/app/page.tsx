"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { 
  ShieldCheck, ArrowRight, ExternalLink, Globe, Search, PlayCircle, 
  ChevronDown, CheckCircle2, FileSignature, Scale, Eye, ShieldAlert,
  Server, Network, Database, Lock, ArrowUpRight
} from 'lucide-react';
import SUREChatWidget from '@/components/ui/SUREChatWidget';
import KaizenFeedback from '@/components/ui/KaizenFeedback';

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <main className="flex flex-col min-h-screen bg-[#0f172a] text-white selection:bg-emerald-500/30 font-open-sans overflow-x-hidden">
      
      {/* Navbar Institucional - Limpio y sin Billing Portal */}
      <nav className="w-full px-6 py-5 flex justify-between items-center fixed top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-sure.png" alt="SURE Logo" width={32} height={32} className="object-contain" priority />
            <span className="font-montserrat font-black text-xl tracking-widest uppercase">
              SURE<span className="text-emerald-500">.</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <LanguageSelector />
          {/* Billing Portal ha sido eliminado de la vista pública */}
        </div>
      </nav>

      {/* Hero Section - The New Lobby Gateway */}
      <section className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col items-center justify-center">
        {/* Background Network FX */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <Globe className="w-4 h-4" />
            {t('ui.global_platform')}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            {t('ui.hero_title_1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              {t('ui.hero_title_2')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl font-light leading-relaxed">
            {t('ui.hero_desc')}
          </p>
        </div>

        {/* The Two Main Paths (DNS vs RMA) */}
        <div className="z-10 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-8 px-4">
          
          {/* Path A: SURE DNS */}
          <div className="bg-[#1e293b]/50 backdrop-blur-xl p-10 rounded-3xl border border-white/5 hover:border-emerald-500/50 transition-all group flex flex-col h-full relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Network className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">SURE DNS</h2>
                <div className="text-emerald-400 font-bold text-sm tracking-widest uppercase">
                  {t('ui.dns_badge')}
                </div>
              </div>
            </div>

            <div className="space-y-6 flex-grow relative z-10">
              <div>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  {t('ui.pain_title')}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t('ui.dns_pain')}
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {t('ui.sol_title')}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t('ui.dns_sol')}
                </p>
              </div>
            </div>

            <Link href="/auditoria-dns" className="mt-10 relative z-10 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 w-full group-hover:scale-[1.02]">
              <Search className="w-5 h-5" />
              {t('ui.dns_cta')}
            </Link>
          </div>

          {/* Path B: SURE RMA */}
          <div className="bg-[#1e293b]/50 backdrop-blur-xl p-10 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-all group flex flex-col h-full relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">SURE RMA</h2>
                <div className="text-blue-400 font-bold text-sm tracking-widest uppercase">
                  {t('ui.rma_badge')}
                </div>
              </div>
            </div>

            <div className="space-y-6 flex-grow relative z-10">
              <div>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-red-400" />
                  {t('ui.pain_title')}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t('ui.rma_pain')}
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  {t('ui.sol_title')}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t('ui.rma_sol')}
                </p>
              </div>
            </div>

            <Link href="/rma" className="mt-10 relative z-10 px-8 py-4 bg-slate-800 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all border border-slate-700 hover:border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex items-center justify-center gap-3 w-full group-hover:scale-[1.02]">
              {t('ui.rma_cta')}
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-8 px-6 border-t border-white/5 bg-[#0f172a] text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span className="font-montserrat font-bold text-lg tracking-widest text-white">SURE<span className="text-emerald-500">.</span></span>
        </div>
        <div className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} SURE Infrastructure Intelligence. {t('ui.footer_rights')}
        </div>
      </footer>

      {/* Widget IA Flotante */}
      <SUREChatWidget />

    </main>
  );
}
