"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { 
  ShieldCheck, ArrowRight, ExternalLink, Globe, PlayCircle, 
  ChevronDown, CheckCircle2, FileSignature, Scale, Eye, ShieldAlert,
  Server, Network, Database, Lock
} from 'lucide-react';
import KaizenFeedback from '@/components/ui/KaizenFeedback';

export default function RMAPage() {
  const { t, language } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState<string | null>(null);

  const handleBuy = async (priceId: string | null) => {
    try {
      setLoadingPrice(priceId || 'payg');
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to secure payment gateway.');
    } finally {
      setLoadingPrice(null);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const agents = [
    {
      name: "ROBERTO",
      role: t('ui.agent1_role'),
      desc: t('ui.agent1_desc'),
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/30",
      icon: <Database className="w-6 h-6" />
    },
    {
      name: "MOISÉS",
      role: t('ui.agent2_role'),
      desc: t('ui.agent2_desc'),
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/30",
      icon: <Scale className="w-6 h-6" />
    },
    {
      name: "ALCIDES",
      role: t('ui.agent3_role'),
      desc: t('ui.agent3_desc'),
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/30",
      icon: <Network className="w-6 h-6" />
    },
    {
      name: t('ui.agent4_name'),
      role: t('ui.agent4_role'),
      desc: t('ui.agent4_desc'),
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/30",
      icon: <FileSignature className="w-6 h-6" />
    }
  ];

  const faqs = [
    {
      q: t('ui.faq1_q'),
      a: t('ui.faq1_a')
    },
    {
      q: t('ui.faq2_q'),
      a: t('ui.faq2_a')
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-[#0f172a] text-white selection:bg-emerald-500/30 font-open-sans overflow-x-hidden">
      
      {/* Navbar Institucional */}
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
          {/* El botón de Billing Portal ha sido eliminado de la vista pública */}
        </div>
      </nav>

      {/* Hero Section para RMA */}
      <section className="relative pt-40 pb-20 px-6 bg-[#0f172a] flex items-center justify-center border-b border-white/5">
        <div className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-4 h-4" />
            {t('ui.hero_rma_badge')}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            SURE RMA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Risk Mitigation Architecture
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl font-light leading-relaxed">
            {t('ui.hero_rma_desc')}
          </p>
        </div>
      </section>

      {/* SURE RMA - Los 4 Agentes */}
      <section id="arquitectura" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {t('ui.engine_title')}
            </h2>
            
            <div className="text-lg md:text-xl font-semibold text-emerald-400 mb-8">
              {t('ui.engine_sub')}
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-10">
              <div className="flex items-center space-x-2 bg-[#1e293b] rounded-full px-5 py-2 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="text-xl">⚡</span>
                <span className="text-slate-200 font-medium text-sm">{t('ui.feat_10min')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#1e293b] rounded-full px-5 py-2 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <span className="text-xl">🎯</span>
                <span className="text-slate-200 font-medium text-sm">{t('ui.feat_acc')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#1e293b] rounded-full px-5 py-2 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <span className="text-xl">💰</span>
                <span className="text-slate-200 font-medium text-sm">{t('ui.feat_b2b')}</span>
              </div>
            </div>

            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              {t('ui.engine_desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, idx) => (
              <div key={idx} className="bg-[#1e293b]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-slate-600 transition-colors relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 ${agent.bg} rounded-bl-full pointer-events-none transition-transform group-hover:scale-110`} />
                <div className={`w-14 h-14 rounded-2xl ${agent.bg} ${agent.border} border flex items-center justify-center ${agent.color} mb-6 relative z-10`}>
                  {agent.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-2 relative z-10">{agent.name}</h3>
                <div className={`${agent.color} font-bold text-sm uppercase tracking-widest mb-4 relative z-10`}>{agent.role}</div>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  {agent.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Educativo Embebido */}
      <section className="py-24 bg-black/60 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-6">
            {t('ui.video_title')}
          </h2>

          <div className="flex flex-col items-center gap-3 mb-10">
            <a 
              href="/sample_report.pdf" 
              target="_blank" 
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black uppercase tracking-widest text-lg rounded-2xl transition-all hover:scale-105"
            >
              <div className="absolute -inset-1 bg-emerald-500 rounded-2xl blur-md opacity-40 group-hover:opacity-70 animate-pulse transition-opacity"></div>
              <FileSignature className="w-7 h-7 relative z-10" />
              <span className="relative z-10">{t('ui.video_cta')}</span>
            </a>
            <span className="text-sm text-slate-400 font-medium">
              {t('ui.video_note')}
            </span>
          </div>

          <div className="w-full aspect-video bg-[#0f172a] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden relative group">
            {(() => {
              const ccMap: Record<string, string> = { es: 'es-ES', de: 'de-DE', pt: 'pt-PT', zh: 'zh' };
              const hlMap: Record<string, string> = { zh: 'zh-CN', pt: 'pt-PT' };
              const ccLang = ccMap[language] || language;
              const hlLang = hlMap[language] || language;
              return (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/kJxcpJtCjdo?modestbranding=1&rel=0&end=390&cc_load_policy=1&cc_lang_pref=${ccLang}&hl=${hlLang}`} 
                  title="SURE Forensics Presentation" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              );
            })()}
            
            {/* Overlay para tapar la marca de agua de NotebookLM con la marca SURE */}
            <div className="absolute bottom-[4%] right-[2%] w-40 h-10 bg-white/95 backdrop-blur-md rounded-md pointer-events-none z-10 flex items-center justify-center shadow-lg border border-slate-200">
              <span className="text-xs text-slate-800 font-black tracking-widest uppercase">SURE FORENSIC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Casos de Uso Táctico */}
      <section className="py-20 border-b border-white/5 bg-[#0f172a] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
          <div className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-4">
            {t('ui.vault_badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            {t('ui.vault_title')}
          </h2>
        </div>

        {/* Gradientes laterales para difuminar los bordes */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#0f172a] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#0f172a] to-transparent z-20 pointer-events-none" />

        <div className="relative flex w-[200vw] sm:w-auto overflow-hidden group">
          {/* Track del marquee */}
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            
            {/* --- GRUPO 1 --- */}
            <div className="flex gap-6 px-3">
              <div className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors shadow-lg">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-xl font-black text-white mb-3">
                  {t('ui.card1_title')}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('ui.card1_desc')}
                </p>
              </div>

              <div className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors shadow-lg">
                <Scale className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-black text-white mb-3">
                  {t('ui.card2_title')}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('ui.card2_desc')}
                </p>
              </div>

              <div className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors shadow-lg">
                <FileSignature className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-black text-white mb-3">
                  {t('ui.card3_title')}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('ui.card3_desc')}
                </p>
              </div>

              <div className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors shadow-lg">
                <Network className="w-8 h-8 text-amber-400 mb-4" />
                <h3 className="text-xl font-black text-white mb-3">
                  {t('ui.card4_title')}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('ui.card4_desc')}
                </p>
              </div>
            </div>

            {/* --- GRUPO 2 (Duplicado) --- */}
            <div className="flex gap-6 px-3">
              <div className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors shadow-lg">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-xl font-black text-white mb-3">
                  {t('ui.card1_title')}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('ui.card1_desc')}
                </p>
              </div>

              <div className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors shadow-lg">
                <Scale className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-black text-white mb-3">
                  {t('ui.card2_title')}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('ui.card2_desc')}
                </p>
              </div>

              <div className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors shadow-lg">
                <FileSignature className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-black text-white mb-3">
                  {t('ui.card3_title')}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('ui.card3_desc')}
                </p>
              </div>

              <div className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors shadow-lg">
                <Network className="w-8 h-8 text-amber-400 mb-4" />
                <h3 className="text-xl font-black text-white mb-3">
                  {t('ui.card4_title')}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('ui.card4_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precios Institucionales */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{t('ui.pricing_title')}</h2>
            <p className="text-xl text-slate-400">
              {t('ui.pricing_sub')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-[#1e293b]/50 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10">
                    <th className="p-6 font-black text-white uppercase tracking-widest text-sm">{t('ui.th_plan')}</th>
                    <th className="p-6 font-black text-white uppercase tracking-widest text-sm">{t('ui.th_ops')}</th>
                    <th className="p-6 font-black text-white uppercase tracking-widest text-sm">{t('ui.th_fee')}</th>
                    <th className="p-6 font-black text-white uppercase tracking-widest text-sm">{t('ui.th_unit')}</th>
                    <th className="p-6 font-black text-white uppercase tracking-widest text-sm">{t('ui.th_add')}</th>
                    <th className="p-6 font-black text-white uppercase tracking-widest text-sm">{t('ui.th_action')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {/* Grupo 1: SURE Transactional */}
                  <tr className="bg-blue-500/10 border-b border-blue-500/20">
                    <td colSpan={6} className="p-4 font-black text-blue-400 uppercase tracking-widest text-xs">
                      {t('ui.pricing_group_transactional')}
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white">{t('ui.plan_basic')}</td>
                    <td className="p-6">{t('ui.plan_payg')}</td>
                    <td className="p-6 font-mono text-emerald-400 font-bold">$0</td>
                    <td className="p-6 font-mono">$50.00</td>
                    <td className="p-6 font-mono">$50.00</td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleBuy(null)} 
                        disabled={loadingPrice === 'payg'}
                        className="inline-block bg-slate-800 hover:bg-emerald-500 text-white hover:text-black border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {loadingPrice === 'payg' ? '...' : t('ui.btn_buy')}
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white">Tier 1x5</td>
                    <td className="p-6">Up to 5</td>
                    <td className="p-6 font-mono text-emerald-400 font-bold">$245.00</td>
                    <td className="p-6 font-mono">$49.00</td>
                    <td className="p-6 font-mono">$49.00</td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleBuy('price_1TZ8z28oubYEwHxx4DnD8gdk')} 
                        disabled={loadingPrice === 'price_1TZ8z28oubYEwHxx4DnD8gdk'}
                        className="inline-block bg-slate-800 hover:bg-emerald-500 text-white hover:text-black border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {loadingPrice === 'price_1TZ8z28oubYEwHxx4DnD8gdk' ? '...' : t('ui.btn_buy')}
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white">{t('ui.plan_tier1')}</td>
                    <td className="p-6">{t('ui.plan_up25')}</td>
                    <td className="p-6 font-mono text-emerald-400 font-bold">$1,210.00</td>
                    <td className="p-6 font-mono">$48.40</td>
                    <td className="p-6 font-mono">$48.40</td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleBuy('price_1TZ8Ms8oubYEwHxxrCK6grr2')} 
                        disabled={loadingPrice === 'price_1TZ8Ms8oubYEwHxxrCK6grr2'}
                        className="inline-block bg-slate-800 hover:bg-emerald-500 text-white hover:text-black border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {loadingPrice === 'price_1TZ8Ms8oubYEwHxxrCK6grr2' ? '...' : t('ui.btn_buy')}
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white">{t('ui.plan_tier2')}</td>
                    <td className="p-6">{t('ui.plan_up50')}</td>
                    <td className="p-6 font-mono text-emerald-400 font-bold">$2,375.00</td>
                    <td className="p-6 font-mono">$47.50</td>
                    <td className="p-6 font-mono">$47.50</td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleBuy('price_1TZ8ZO8oubYEwHxxo6I8cAc6')} 
                        disabled={loadingPrice === 'price_1TZ8ZO8oubYEwHxxo6I8cAc6'}
                        className="inline-block bg-slate-800 hover:bg-emerald-500 text-white hover:text-black border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {loadingPrice === 'price_1TZ8ZO8oubYEwHxxo6I8cAc6' ? '...' : t('ui.btn_buy')}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Grupo 2: SURE Project Workspace */}
                  <tr className="bg-emerald-500/10 border-b border-emerald-500/20">
                    <td colSpan={6} className="p-4 font-black text-emerald-400 uppercase tracking-widest text-xs">
                      {t('ui.pricing_group_workspace')}
                    </td>
                  </tr>
                  <tr className="border-b border-emerald-500/30 hover:bg-emerald-500/5 transition-colors bg-emerald-500/10">
                    <td className="p-6 font-bold text-white">
                      {t('ui.plan_tier3')}
                    </td>
                    <td className="p-6 text-white font-medium">{t('ui.plan_up75')}</td>
                    <td className="p-6 font-mono text-emerald-400 font-bold text-lg">$3,375.00</td>
                    <td className="p-6 font-mono text-white font-bold">$45.00</td>
                    <td className="p-6 font-mono text-white font-bold">$45.00</td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleBuy('price_1TZ8nD8oubYEwHxxGnaEY9Di')} 
                        disabled={loadingPrice === 'price_1TZ8nD8oubYEwHxxGnaEY9Di'}
                        className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50"
                      >
                        {loadingPrice === 'price_1TZ8nD8oubYEwHxxGnaEY9Di' ? '...' : t('ui.btn_buy')}
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white">{t('ui.plan_tier4')}</td>
                    <td className="p-6">{t('ui.plan_up100')}</td>
                    <td className="p-6 font-mono text-emerald-400 font-bold">$4,250.00</td>
                    <td className="p-6 font-mono">$42.50</td>
                    <td className="p-6 font-mono">$42.50</td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleBuy('price_1TZ8qO8oubYEwHxxuOcRIKNG')} 
                        disabled={loadingPrice === 'price_1TZ8qO8oubYEwHxxuOcRIKNG'}
                        className="inline-block bg-slate-800 hover:bg-emerald-500 text-white hover:text-black border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {loadingPrice === 'price_1TZ8qO8oubYEwHxxuOcRIKNG' ? '...' : t('ui.btn_buy')}
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white">{t('ui.plan_tier5')}</td>
                    <td className="p-6">{t('ui.plan_up150')}</td>
                    <td className="p-6 font-mono text-emerald-400 font-bold">$6,000.00</td>
                    <td className="p-6 font-mono">$40.00</td>
                    <td className="p-6 font-mono">$40.00</td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleBuy('price_1TZ8tM8oubYEwHxxQf5uCyk2')} 
                        disabled={loadingPrice === 'price_1TZ8tM8oubYEwHxxQf5uCyk2'}
                        className="inline-block bg-slate-800 hover:bg-emerald-500 text-white hover:text-black border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {loadingPrice === 'price_1TZ8tM8oubYEwHxxQf5uCyk2' ? '...' : t('ui.btn_buy')}
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white">{t('ui.plan_tier6')}</td>
                    <td className="p-6">{t('ui.plan_up200')}</td>
                    <td className="p-6 font-mono text-emerald-400 font-bold">$7,500.00</td>
                    <td className="p-6 font-mono">$37.50</td>
                    <td className="p-6 font-mono">$37.50</td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleBuy('price_1TZ8w98oubYEwHxxW9PxHhXW')} 
                        disabled={loadingPrice === 'price_1TZ8w98oubYEwHxxW9PxHhXW'}
                        className="inline-block bg-slate-800 hover:bg-emerald-500 text-white hover:text-black border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {loadingPrice === 'price_1TZ8w98oubYEwHxxW9PxHhXW' ? '...' : t('ui.btn_buy')}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature comparison matrix */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-3">
                {t('ui.matrix_title')}
              </h3>
              <p className="text-lg text-slate-400">
                {t('ui.matrix_subtitle')}
              </p>
            </div>

            <div className="max-w-5xl mx-auto bg-[#1e293b]/30 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-black/20 border-b border-white/10">
                      <th className="p-6 font-black text-white uppercase tracking-widest text-sm w-[40%]">
                        {t('ui.matrix_th_capability')}
                      </th>
                      <th className="p-6 font-black text-blue-400 uppercase tracking-widest text-sm text-center w-[30%]">
                        {t('ui.matrix_th_group1')}
                      </th>
                      <th className="p-6 font-black text-emerald-400 uppercase tracking-widest text-sm text-center w-[30%]">
                        {t('ui.matrix_th_group2')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-bold text-white">{t('ui.matrix_row1_cap')}</td>
                      <td className="p-6 text-center">{t('ui.matrix_row1_g1')}</td>
                      <td className="p-6 text-center text-white font-medium">{t('ui.matrix_row1_g2')}</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-bold text-white">{t('ui.matrix_row2_cap')}</td>
                      <td className="p-6 text-center text-red-400">{t('ui.matrix_row2_g1')}</td>
                      <td className="p-6 text-center text-emerald-400 font-bold">{t('ui.matrix_row2_g2')}</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-bold text-white">{t('ui.matrix_row3_cap')}</td>
                      <td className="p-6 text-center text-red-400">{t('ui.matrix_row3_g1')}</td>
                      <td className="p-6 text-center text-emerald-400 font-bold">{t('ui.matrix_row3_g2')}</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-bold text-white">{t('ui.matrix_row4_cap')}</td>
                      <td className="p-6 text-center text-red-400">{t('ui.matrix_row4_g1')}</td>
                      <td className="p-6 text-center text-emerald-400 font-bold">{t('ui.matrix_row4_g2')}</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-bold text-white">{t('ui.matrix_row5_cap')}</td>
                      <td className="p-6 text-center text-slate-300">{t('ui.matrix_row5_g1')}</td>
                      <td className="p-6 text-center text-white font-medium">{t('ui.matrix_row5_g2')}</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-bold text-white">{t('ui.matrix_row6_cap')}</td>
                      <td className="p-6 text-center">{t('ui.matrix_row6_g1')}</td>
                      <td className="p-6 text-center text-emerald-400 font-bold">{t('ui.matrix_row6_g2')}</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-bold text-white">{t('ui.matrix_row7_cap')}</td>
                      <td className="p-6 text-center">{t('ui.matrix_row7_g1')}</td>
                      <td className="p-6 text-center text-white font-bold">{t('ui.matrix_row7_g2')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#0f172a] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center text-white mb-12">
            {t('ui.faq_title')}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 font-bold text-lg text-white flex justify-between items-center"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#0a0f18] text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span className="font-montserrat font-bold text-lg tracking-widest text-white">SURE<span className="text-emerald-500">.</span></span>
        </div>
        <div className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} SURE Infrastructure Intelligence. {t('ui.footer_rights')}
        </div>
      </footer>
    </main>
  );
}
