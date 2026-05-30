"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, ExternalLink, Globe, Search, PlayCircle, 
  Activity, Check, Clock, Settings, Calendar, Music, ArrowUpRight, 
  Database, Network, ShieldAlert, Sparkles, Cpu, ChevronRight
} from 'lucide-react';

const LOCAL_TRANSLATIONS: Record<string, any> = {
  lt: {
    badge: "DIRBTINIO INTELEKTO SPRENDIMAI GYDYMO ĮSTAIGOMS",
    hero_title: "Medicinos procesų ateitis Lietuvoje",
    hero_desc: "MB PROCDI kuria ir diegia pritaikytus dirbtinio intelekto asistentus, kurie pilnai autonomiškai valdo administracinius srautus, pašalina prastovas ir optimizuoja klinikos pajamas.",
    flagship_title: "Mūsų Flagmanas Odontologijos Sektoriui",
    marija_title: "Marija DI: Odontologijos srautų valdymas",
    marija_desc: "Pilnai autonominė asistentė, pritaikyta specialiai odontologijos klinikoms. Ji sprendžia tuščių kėdžių problemą, valdo skubius pacientus 24/7 ir užtikrina klinikos teisinį bei finansinį saugumą.",
    marija_bullet1: "Always On: 24/7 automatinis pacientų užklausų priėmimas ir apdorojimas.",
    marija_bullet2: "MDR Compliant: 100% legalus administracinis įrankis pagal ES reglamentą 2017/745.",
    marija_bullet3: "Teisinis Skydas: Skaitmeninės prisijungimo sutartys neatvykimo nuostoliams taikyti.",
    marija_bullet4: "Nulinė Instaliacija: Integracija per 10 minučių įterpiant paprastą skripto kodą.",
    marija_cta: "ŽIŪRĖTI INTERAKTYVŲ PRISTATYMĄ",
    
    agency_title: "Mūsų AI Integracijos Platforma",
    agency_desc: "Kuriame vientisą klinikos ekosistemą, kurioje kiekvienas dirbtinio intelekto agentas sprendžia specifinius operacinius butelio kaklelius.",
    prod1_title: "Marija DI • Dental Flow",
    prod1_desc: "Autonominis registratūros ir kėdžių užimtumo valdymas odontologijoje.",
    prod2_title: "Rasa DI • Medical Transcribe",
    prod2_desc: "Automatinis medicininių įrašų transkribavimas ir pildymas realiuoju laiku (ruošiama).",
    prod3_title: "Jonas DI • Supply Chain",
    prod3_desc: "Išmanusis klinikos atsargų, kainoraščių ir tiekėjų kainų sinchronizavimas (ruošiama).",
    
    trust_title: "Kodėl MB PROCDI?",
    trust_card1_title: "Pritaikytas Klonas",
    trust_card1_desc: "Kiekvienas asistentas yra apmokomas naudoti jūsų klinikos kainoraščius, logotipą ir vidaus taisykles.",
    trust_card2_title: "Hibridinis Veikimas",
    trust_card2_desc: "AI filtruoja ir registruoja užklausas, o kritines bei skubias situacijas akimirksniu perduoda į jūsų el. paštą.",
    trust_card3_title: "Saugumas ir GDPR",
    trust_card3_desc: "Duomenų perdavimas vykdomas šifruotais kanalais, griežtai laikantis BDAR ir medicinos duomenų apsaugos reikalavimų.",
    
    contact_banner: "Pradėkite optimizuoti savo kliniką šiandien.",
    contact_details: "Susisiekite su mumis: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    footer_text: "MB PROCDI • Įmonės kodas: 307515454 • Partizanų g. 61-806, LT-49282, Kaunas, Lithuania",
    lang_selector: "Kalba"
  },
  es: {
    badge: "SOLUCIONES DE INTELIGENCIA ARTIFICIAL CLÍNICA",
    hero_title: "El futuro de los procesos médicos en Lituania",
    hero_desc: "MB PROCDI diseña e integra asistentes de inteligencia artificial personalizados que gestionan flujos administrativos de forma autónoma, eliminan el tiempo muerto y optimizan los ingresos de la clínica.",
    flagship_title: "Nuestro Flagship para el Sector Dental",
    marija_title: "Marija DI: Gestión inteligente de flujos dentales",
    marija_desc: "Asistente autónoma adaptada especialmente para clínicas dentales. Resuelve el problema del sillón vacío, gestiona pacientes urgentes 24/7 y garantiza la seguridad legal y financiera de la clínica.",
    marija_bullet1: "Always On: Recepción y procesamiento automático de consultas de pacientes 24/7.",
    marija_bullet2: "Conformidad MDR: Herramienta administrativa 100% legal según el Reglamento UE 2017/745.",
    marija_bullet3: "Escudo Legal: Contratos de adhesión digitalizados para aplicar penalizaciones por no-show.",
    marija_bullet4: "Instalación Cero: Integración en 10 minutos insertando un código de script simple.",
    marija_cta: "VER PRESENTACIÓN INTERACTIVA",
    
    agency_title: "Nuestra Plataforma de Integración de IA",
    agency_desc: "Creamos un ecosistema clínico integrado donde cada agente de IA resuelve cuellos de botella operativos específicos.",
    prod1_title: "Marija DI • Dental Flow",
    prod1_desc: "Gestión autónoma de recepción y ocupación de sillones en odontología.",
    prod2_title: "Rasa DI • Medical Transcribe",
    prod2_desc: "Transcripción y llenado automático de registros médicos en tiempo real (en desarrollo).",
    prod3_title: "Jonas DI • Supply Chain",
    prod3_desc: "Sincronización inteligente de inventarios clínicos y coordinación de proveedores (en desarrollo).",
    
    trust_title: "¿Por qué MB PROCDI?",
    trust_card1_title: "Clon Personalizado",
    trust_card1_desc: "Cada asistente es entrenado con los precios, logotipo y políticas internas de su clínica.",
    trust_card2_title: "Operación Híbrida",
    trust_card2_desc: "La IA filtra y pre-registra consultas, enviando las situaciones urgentes y críticas a su correo electrónico.",
    trust_card3_title: "Seguridad y GDPR",
    trust_card3_desc: "La transmisión de datos se realiza por canales encriptados, cumpliendo estrictamente con GDPR.",
    
    contact_banner: "Comience a optimizar su clínica hoy mismo.",
    contact_details: "Contacto: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    footer_text: "MB PROCDI • Código de empresa: 307515454 • Partizanų g. 61-806, LT-49282, Kaunas, Lituania",
    lang_selector: "Idioma"
  },
  en: {
    badge: "CLINICAL ARTIFICIAL INTELLIGENCE SOLUTIONS",
    hero_title: "The Future of Medical Processes in Lithuania",
    hero_desc: "MB PROCDI designs and integrates customized artificial intelligence assistants that autonomously manage administrative flows, eliminate downtime, and optimize clinic revenues.",
    flagship_title: "Our Flagship for the Dental Sector",
    marija_title: "Marija DI: Intelligent Dental Flow Management",
    marija_desc: "Fully autonomous assistant tailored specifically for dental clinics. It solves the empty chair problem, manages urgent patients 24/7, and guarantees the clinic's legal and financial security.",
    marija_bullet1: "Always On: 24/7 automatic reception and processing of patient inquiries.",
    marija_bullet2: "MDR Compliant: 100% legal administrative tool under EU Regulation 2017/745.",
    marija_bullet3: "Legal Shield: Digitalized B2B adhesion contracts to apply no-show fees.",
    marija_bullet4: "Zero Installation: Integration in 10 minutes by inserting a simple script code.",
    marija_cta: "VIEW INTERACTIVE PRESENTATION",
    
    agency_title: "Our AI Integration Platform",
    agency_desc: "We build a seamless clinical ecosystem where each AI agent solves specific operational bottlenecks.",
    prod1_title: "Marija DI • Dental Flow",
    prod1_desc: "Autonomous reception and chair occupancy management in dentistry.",
    prod2_title: "Rasa DI • Medical Transcribe",
    prod2_desc: "Automatic real-time medical transcription and record enrichment (upcoming).",
    prod3_title: "Jonas DI • Supply Chain",
    prod3_desc: "Smart clinical inventory synchronization and supplier coordination (upcoming).",
    
    trust_title: "Why MB PROCDI?",
    trust_card1_title: "Customized Clone",
    trust_card1_desc: "Each assistant is trained with your clinic's price lists, logo, and internal policies.",
    trust_card2_title: "Hybrid Operations",
    trust_card2_desc: "AI filters and pre-registers inquiries, routing urgent and critical situations to your inbox.",
    trust_card3_title: "Security & GDPR",
    trust_card3_desc: "Data transmission is conducted via encrypted channels, in strict compliance with GDPR.",
    
    contact_banner: "Start optimizing your clinic today.",
    contact_details: "Contact: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    footer_text: "MB PROCDI • Company code: 307515454 • Partizanų g. 61-806, LT-49282, Kaunas, Lithuania",
    lang_selector: "Language"
  }
};

const ProcdiLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="15,35 50,52 50,90 15,73" fill="#0B192C" stroke="#008DDA" strokeWidth="2.5" strokeLinejoin="round" />
    <polygon points="50,52 85,35 85,73 50,90" fill="#050D1A" stroke="#008DDA" strokeWidth="2.5" strokeLinejoin="round" />
    <polygon points="50,15 85,35 50,52 15,35" fill="#0E1E38" stroke="#008DDA" strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="50" y1="23" x2="68" y2="31" stroke="#008DDA" strokeWidth="1.5" strokeDasharray="3 1.5" />
    <line x1="50" y1="23" x2="32" y2="31" stroke="#008DDA" strokeWidth="1.5" strokeDasharray="3 1.5" />
    <line x1="50" y1="44" x2="50" y2="23" stroke="#008DDA" strokeWidth="1.5" />
    <circle cx="50" cy="15" r="4" fill="#008DDA" />
    <circle cx="85" cy="35" r="4" fill="#008DDA" />
    <circle cx="15" cy="35" r="4" fill="#008DDA" />
    <circle cx="50" cy="52" r="4" fill="#008DDA" />
    <circle cx="50" cy="90" r="4" fill="#008DDA" />
  </svg>
);

export default function ProcdiHome() {
  const [currentLang, setCurrentLang] = useState('lt');

  const t = (key: string) => {
    return LOCAL_TRANSLATIONS[currentLang]?.[key] || LOCAL_TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0B192C] font-montserrat selection:bg-[#008DDA]/10 overflow-x-hidden flex flex-col justify-between relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        .font-montserrat {
          font-family: 'Montserrat', sans-serif !important;
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#008DDA]/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#008DDA]/3 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation Bar */}
      <nav className="w-full px-6 md:px-12 py-5 flex justify-between items-center bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-3">
          <ProcdiLogo className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-[0.05em] text-[#0B192C] leading-none">PRÓCDI</span>
            <span className="text-[9px] text-[#008DDA] font-extrabold uppercase tracking-wider mt-1">MB PROCDI • Medical AI Systems</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* High contrast language buttons */}
          <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner">
            <button 
              onClick={() => setCurrentLang('lt')}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'lt' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
            >
              LT
            </button>
            <button 
              onClick={() => setCurrentLang('es')}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'es' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
            >
              ES
            </button>
            <button 
              onClick={() => setCurrentLang('en')}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'en' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
            >
              EN
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-16 px-6 md:px-12 z-10 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008DDA]/10 border border-[#008DDA]/30 text-[#008DDA] text-xs font-black tracking-widest uppercase mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          {t('badge')}
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0B192C] leading-[1.1] mb-6 tracking-tight max-w-5xl">
          {t('hero_title')}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl font-semibold leading-relaxed mb-8">
          {t('hero_desc')}
        </p>
      </header>

      {/* Flagship Product Showcase: Marija DI */}
      <section className="px-6 md:px-12 py-10 z-10 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-[2.5rem] border-2 border-[#0B192C] p-8 md:p-12 shadow-[0_20px_50px_rgba(11,25,44,0.05)] relative overflow-hidden flex flex-col lg:flex-row gap-10 items-center">
          
          {/* Cyber bracket notch indicators */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#008DDA] rounded-tl-lg pointer-events-none" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#008DDA] rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#008DDA] rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#008DDA] rounded-br-lg pointer-events-none" />

          {/* Left Details block */}
          <div className="flex-1">
            <span className="text-xs text-[#008DDA] font-black uppercase tracking-widest block mb-3">
              {t('flagship_title')}
            </span>
            <h2 className="text-3xl md:text-5.5xl font-black text-[#0B192C] leading-none mb-6">
              {t('marija_title')}
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-semibold leading-relaxed mb-8">
              {t('marija_desc')}
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3.5 text-xs md:text-sm text-slate-700 font-bold">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 stroke-[3]" />
                <span>{t('marija_bullet1')}</span>
              </li>
              <li className="flex items-start gap-3.5 text-xs md:text-sm text-slate-700 font-bold">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 stroke-[3]" />
                <span>{t('marija_bullet2')}</span>
              </li>
              <li className="flex items-start gap-3.5 text-xs md:text-sm text-slate-700 font-bold">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 stroke-[3]" />
                <span>{t('marija_bullet3')}</span>
              </li>
              <li className="flex items-start gap-3.5 text-xs md:text-sm text-slate-700 font-bold">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 stroke-[3]" />
                <span>{t('marija_bullet4')}</span>
              </li>
            </ul>

            <Link href="/presentation-marija" className="inline-flex items-center gap-3.5 px-8 py-4 bg-[#0B192C] hover:bg-[#008DDA] text-white font-black text-xs md:text-sm rounded-xl transition-all shadow-md tracking-widest uppercase hover:scale-[1.02]">
              {t('marija_cta')}
              <PlayCircle className="w-5 h-5 animate-pulse" />
            </Link>
          </div>

          {/* Right SVG visual block */}
          <div className="w-full lg:w-96 h-80 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner flex items-center justify-center p-6 shrink-0 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-100 border border-emerald-300 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Marija DI Active
            </div>
            
            <div className="w-full flex flex-col items-center gap-4">
              <svg className="w-full h-32" viewBox="0 0 200 100" fill="none">
                <path d="M0 10H200M0 20H200M0 30H200M0 40H200M0 50H200M0 60H200M0 70H200M0 80H200M0 90H200" stroke="#E2E8F0" strokeWidth="0.5" />
                <path d="M20 0V100M40 0V100M60 0V100M80 0V100M100 0V100M120 0V100M140 0V100M160 0V100M180 0V100" stroke="#E2E8F0" strokeWidth="0.5" />
                <path 
                  d="M0 50 L60 50 L70 30 L80 70 L90 50 L100 50 L105 20 L110 80 L115 50 L125 50 L130 45 L135 55 L140 50 L200 50" 
                  stroke="#008DDA" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="animate-ecgPulse"
                />
              </svg>
              <div className="text-center font-black text-xs uppercase tracking-widest text-[#0B192C] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#008DDA]" />
                Autonominis klinikos valdymas
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Integration Platform / Ecosistema B2B */}
      <section className="px-6 md:px-12 py-12 z-10 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4.5xl font-black text-[#0B192C] tracking-tight mb-3">
            {t('agency_title')}
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-semibold leading-relaxed">
            {t('agency_desc')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#008DDA]/3 rounded-bl-full pointer-events-none z-0" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-[#008DDA]/10 border border-[#008DDA]/30 rounded-xl flex items-center justify-center text-[#008DDA] mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-[#0B192C] text-lg mb-2">{t('prod1_title')}</h3>
              <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed mb-6">{t('prod1_desc')}</p>
            </div>
            <Link href="/presentation-marija" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#008DDA] hover:text-[#0B192C] mt-2 relative z-10">
              Open Agent <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] hover:shadow-md transition-all">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-[#0B192C] text-lg mb-2">{t('prod2_title')}</h3>
              <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed mb-6">{t('prod2_desc')}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider self-start mt-2">COMING SOON</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] hover:shadow-md transition-all">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 mb-4">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-[#0B192C] text-lg mb-2">{t('prod3_title')}</h3>
              <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed mb-6">{t('prod3_desc')}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider self-start mt-2">COMING SOON</span>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="px-6 md:px-12 py-12 z-10 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4.5xl font-black text-[#0B192C] tracking-tight mb-2">
            {t('trust_title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-cyan-50 border border-cyan-200 rounded-full flex items-center justify-center text-[#008DDA] mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[#0B192C] text-lg mb-2">{t('trust_card1_title')}</h3>
            <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">{t('trust_card1_desc')}</p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-cyan-50 border border-cyan-200 rounded-full flex items-center justify-center text-[#008DDA] mb-4">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[#0B192C] text-lg mb-2">{t('trust_card2_title')}</h3>
            <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">{t('trust_card2_desc')}</p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-cyan-50 border border-cyan-200 rounded-full flex items-center justify-center text-[#008DDA] mb-4">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-[#0B192C] text-lg mb-2">{t('trust_card3_title')}</h3>
            <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">{t('trust_card3_desc')}</p>
          </div>
        </div>
      </section>

      {/* Footer & Institutional Contact */}
      <footer className="w-full bg-[#0B192C] text-white border-t border-slate-800 relative z-20 mt-12 py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ProcdiLogo className="w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-[0.05em] text-white leading-none">PRÓCDI</span>
              <span className="text-[8px] text-[#00E5FF] font-extrabold uppercase tracking-wider mt-1">Medical AI Systems</span>
            </div>
          </div>
          <div className="text-center md:text-right font-semibold">
            <span className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-black block">{t('contact_banner')}</span>
            <span className="text-[10px] md:text-xs text-white uppercase tracking-wider font-extrabold mt-1 block">{t('contact_details')}</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <span className="text-[9px] md:text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">
            {t('footer_text')}
          </span>
          <span className="text-[9px] md:text-[10px] text-slate-500 font-semibold uppercase">
            &copy; {new Date().getFullYear()} MB PROCDI. All rights reserved.
          </span>
        </div>
      </footer>

    </main>
  );
}
