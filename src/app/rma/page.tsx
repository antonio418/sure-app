"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { 
  ShieldCheck, Network, Cpu, FileSignature, Target, ArrowRight, ShieldAlert, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function RMAPage() {
  const { t, language } = useLanguage();

  const modules = [
    {
      id: "dns",
      title: "SURE DNS",
      subtitle: language === 'es' ? "Seguridad Perimetral" : "Perimeter Security",
      desc: language === 'es' 
        ? "Validación en 30 segundos de registros SPF, DKIM y DMARC para prevenir spoofing de correos corporativos."
        : "30-second validation of SPF, DKIM, and DMARC records to prevent corporate email spoofing.",
      color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.03] hover:border-emerald-500/50 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)]",
      iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      btnBg: "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      href: "/auditoria-dns",
      icon: <Network className="w-8 h-8" />
    },
    {
      id: "rma",
      title: "SURE RMA",
      subtitle: language === 'es' ? "Auditoría Forense de Documentos" : "Document Forensic Audit",
      desc: language === 'es'
        ? "Análisis automatizado de transacciones, SCOs y pliegos de commodities mediante enjambre inteligente de agentes."
        : "Automated analysis of transactions, SCOs, and commodity documents via intelligent agent swarms.",
      color: "text-blue-400 border-blue-500/25 bg-blue-500/[0.03] hover:border-blue-500/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]",
      iconBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      btnBg: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]",
      href: "/auditoria-rma",
      icon: <Cpu className="w-8 h-8" />
    },
    {
      id: "pdc",
      title: "SURE PDC",
      subtitle: language === 'es' ? "Plan de Contingencia" : "Contingency Plan",
      desc: language === 'es'
        ? "Formulación y redacción interactiva multilingüe de planes de respuesta perimetrales y comunitarios con IA."
        : "Interactive multilingual formulation and drafting of perimeter and community response plans with AI.",
      color: "text-purple-400 border-purple-500/25 bg-purple-500/[0.03] hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]",
      iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      btnBg: "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      href: "/rma/contingencia",
      icon: <FileSignature className="w-8 h-8" />
    },
    {
      id: "alfredo",
      title: "SURE ALFREDO",
      subtitle: language === 'es' ? "Prospección de Leads B2B" : "B2B Lead Generation",
      desc: language === 'es'
        ? "Campañas automatizadas de prospección e identificación autónoma de C-Levels en el mercado internacional."
        : "Automated prospecting campaigns and autonomous C-Level identification in international markets.",
      color: "text-amber-400 border-amber-500/25 bg-amber-500/[0.03] hover:border-amber-500/50 hover:shadow-[0_0_50px_rgba(245,158,11,0.15)]",
      iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      btnBg: "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]",
      href: "/admin/alfredo",
      icon: <Target className="w-8 h-8" />
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-[#050a14] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-full max-w-4xl h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar Institucional */}
      <nav className="w-full px-6 py-5 flex justify-between items-center fixed top-0 z-50 bg-[#050a14]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-sure.png" alt="SURE Logo" width={32} height={32} className="object-contain" priority />
            <span className="font-montserrat font-bold text-xl tracking-widest uppercase">
              SURE<span className="text-emerald-500">.</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <LanguageSelector />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-16 px-6 flex flex-col items-center justify-center text-center z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-pulse">
            <ShieldCheck className="w-4 h-4" />
            {language === 'es' ? "Ecosistema de Inteligencia SURE" : "SURE Intelligence Ecosystem"}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight font-montserrat uppercase">
            {language === 'es' ? "Centro de Comando" : "Command Center"}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              SURE Platform
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl font-light leading-relaxed mb-8">
            {language === 'es'
              ? "Accede a nuestros módulos autónomos perimetrales y forenses diseñados para auditar, mitigar riesgos y prospectar oportunidades B2B."
              : "Access our autonomous perimeter and forensic modules designed to audit, mitigate risks, and prospect B2B opportunities."}
          </p>
        </div>
      </section>

      {/* Grid de los 4 Módulos */}
      <section className="px-6 pb-24 z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((m) => (
            <div 
              key={m.id} 
              className={`group border rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden ${m.color}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
              
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${m.iconBg}`}>
                    {m.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white font-montserrat tracking-wide">{m.title}</h2>
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{m.subtitle}</div>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-8 font-light">
                  {m.desc}
                </p>
              </div>

              <Link 
                href={m.href} 
                className={`w-full py-4 text-center font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 ${m.btnBg}`}
              >
                <span>{language === 'es' ? "Ingresar al Módulo" : "Enter Module"}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#03060c] text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
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
