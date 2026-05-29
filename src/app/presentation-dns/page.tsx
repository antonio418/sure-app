"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { 
  ShieldCheck, Lock, ArrowRight, ArrowLeft, Loader2, UploadCloud, Search, 
  CheckCircle2, AlertTriangle, Server, Shield, FileText, Check, HelpCircle,
  Mail, Play, RefreshCw, Layers, Database, ArrowDown, Activity, DollarSign,
  Globe
} from 'lucide-react';

const LOCAL_TRANSLATIONS: Record<string, any> = {
  en: {
    s1_title: "The Invisible Vulnerability of Corporate Email",
    s1_box_title: "90% of global B2B financial diversion occurs via email.",
    s1_box_desc: "Standard firewalls and Office365 lack the 'external security key' required to prevent exact domain spoofing.",
    
    s2_title: "Legal Precedent: Studco Bldg. Sys. v. 1st Advantage",
    s2_negligence_title: "Absent DNS Protocols",
    s2_negligence_tag: "Negligence",
    s2_bank_freed: "Bank is Freed from Liability",
    s2_loss_title: "100% Financial Loss Absorbed by Corporate Balance Sheet",
    s2_loss_tag: "Civil Liability",
    
    s3_title: "Passive Radar",
    s3_radar_sub: "PASSIVE RADAR SCANNING",
    s3_metric_1_val: "0",
    s3_metric_1_lbl: "Internal Server Access Required",
    s3_metric_2_val: "0",
    s3_metric_2_lbl: "Passwords or Credentials Needed",
    s3_metric_3_val: "60",
    s3_metric_3_lbl: "Seconds to Execute Passive Audit",
    s3_readout_title: "Forensic Readout",
    s3_readout_desc: "Because security records are public, the audit happens entirely from the outside. Zero operational friction. Zero network intrusion.",
    
    s4_fail_title: "75% of global corporations fail basic exterior domain configuration.",
    s4_alert_1: "DMARC ABSENT",
    s4_alert_2: "P=NONE",
    s4_desc: "Spoofing bypasses internal defenses. This is an industry-wide B2B architecture flaw, not a failure of your internal IT software.",
    
    s5_roberto_title: "Agent Roberto",
    s5_roberto_desc: "Server Provenance & IP Reputation Mapping.",
    s5_moises_title: "Agent Moisés",
    s5_moises_desc: "Contractual & Payment Metadata Validation.",
    s5_engine_desc: "An autonomous intelligence engine actively defending international payment protocols in real-time.",
    
    s6_supplier_title: "Vulnerable Asian/European Bulk Supplier",
    s6_supplier_desc: "Spoofed Invoice with Altered Bank Details",
    s6_supplier_shield: "SURE Shield Perimeter",
    s6_supplier_readout: "Fraud rarely starts on your servers. Attackers intercept authentic emails from vulnerable suppliers and alter payment data. SURE passively audits your *entire* B2B channel.",
    
    s7_act_title: "Input",
    s7_act_desc: "Submit Public Domains + Top 5 Bulk Suppliers.",
    s7_act_step2: "Processing",
    s7_act_step2_desc: "24-Hour Passive Scan.",
    s7_act_step3: "Output",
    s7_act_step3_desc: "Receive Comprehensive Forensic Risk Report.",
    s7_act_banner: "Your fiduciary defense begins today. Zero operational friction. Zero risk.",
    s7_input_placeholder: "Enter domain (e.g., company.com)",
    s7_input_btn: "AUDIT ->",
    s7_scan_running: "Scanning records...",
    
    s8_price_title: "$70",
    s8_price_sub: "USD / domain",
    s8_price_sub2: "(One-Time Payment)",
    s8_benefit_1: "Immediate Technical Closure.",
    s8_benefit_1_sub: "(The SURE Shield active mitigation).",
    s8_benefit_2: "Immutable Forensic Risk Reports.",
    s8_benefit_2_sub: "(Provable due diligence for courts and banks).",
    s8_banner: "The most cost-effective fiduciary legal defense available.",
    s8_loss_label: "Catastrophic Fiduciary Loss",
    s8_btn_protect: "PROTECT DOMAIN",
    s8_btn_skip: "No, expose domain risk",
    
    s9_checkout_title: "SURE. Tactical License",
    s9_checkout_desc: "One-time operational forensic audit & shield activation.",
    s9_checkout_price: "$70.00",
    s9_checkout_payment: "Card Information",
    s9_checkout_btn: "Pay $70.00",
    s9_checkout_note: "If you hold a discount code, please enter it in the box, click 'Apply', and then proceed to payment.",
    
    s10_unlocked_title: "AUDIT UNLOCKED",
    s10_unlocked_badge: "Payment Verified",
    s10_real_case: "Real client case analysis",
    s10_infra_title: "Your Infrastructure Provider:",
    s10_radio_title: "Current DNS Radiology:",
    s10_exposed_title: "Exposed Technical Vectors:",
    
    s11_title: "VISUAL AI ASSISTANCE",
    s11_desc: "Please connect to your provider page, take a screenshot (Tip: use Win+Shift+S on Windows or Cmd+Shift+4 on Mac for better precision), paste it via \"CTRL+V\" or click the blue button below, and press \"CONTINUE\".",
    s11_desc2: "If you don't know WHERE you are or what to do, only screenshot the page where you are, paste it here, and we will indicate exactly what to do.",
    s11_upload_title: "Upload your screenshot or press Ctrl+V",
    s11_upload_sub: "Click, drag the image or paste from clipboard (PNG, JPG)",
    
    s12_title: "ALFREDO'S INSTRUCTIONS",
    s12_no_spoiler: "After DNS screenshot uploaded, our AI agent Alfredo will parse the text and provide accurate instructions on what has to be changed in order to get your domain clean and safe.\n\nAs last step, after parameters are updated, our AI agent performs a second security scan verifying successful domain protection.",
    s12_badge: "AI MATCH FOUND",
    
    s13_title: "VERIFICATION",
    s13_desc: "Take a new screenshot of the corrected records and paste it here (Ctrl+V or drag & drop) for final verification.",
    s13_btn_simulate: "SIMULATE VERIFICATION (DEMO)",
    
    s14_title: "FINAL SECURE REPORT",
    s14_desc: "Your domain is now 100% Protected and Authenticated.",
    s14_q1: "Score 1 to 10 on how easy was to follow Alfredo's instructions:",
    s14_q2: "Do you feel complete confidence that your company's emails are now fully protected against SPAM and identity spoofing?",
    s14_q3: "Would you recommend SURE to colleagues and friends?",
    s14_finish: "COMPLETE REGISTRATION",
    s14_contact: "Support & Audit Inquiries: alfredo@sureforensic.com",
    
    continue: "CONTINUE",
    back: "BACK"
  },
  es: {
    s1_title: "La Vulnerabilidad Invisible del Correo Corporativo",
    s1_box_title: "El 90% de los desvíos financieros B2B globales ocurren por email.",
    s1_box_desc: "Los firewalls estándar y Office365 carecen de la 'llave de seguridad externa' requerida para prevenir la suplantación exacta de dominio.",
    
    s2_title: "Precedente Legal: Studco Bldg. Sys. v. 1st Advantage",
    s2_negligence_title: "Protocolos DNS Ausentes",
    s2_negligence_tag: "Negligencia",
    s2_bank_freed: "El Banco queda Liberado de Responsabilidad",
    s2_loss_title: "100% de la Pérdida Financiera Absorbida por el Balance Corporativo",
    s2_loss_tag: "Resp. Civil",
    
    s3_title: "Radar Pasivo",
    s3_radar_sub: "ESCANEANDO CON RADAR PASIVO",
    s3_metric_1_val: "0",
    s3_metric_1_lbl: "Acceso a Servidores Internos Requerido",
    s3_metric_2_val: "0",
    s3_metric_2_lbl: "Contraseñas o Credenciales Necesarias",
    s3_metric_3_val: "60",
    s3_metric_3_lbl: "Segundos para Ejecutar la Auditoría Pasiva",
    s3_readout_title: "Reporte Forense",
    s3_readout_desc: "Al ser los registros de seguridad públicos, la auditoría ocurre enteramente desde el exterior. Cero fricción operativa. Cero intrusión en la red.",
    
    s4_fail_title: "El 75% de las corporaciones globales fallan en la configuración básica de dominio externo.",
    s4_alert_1: "DMARC AUSENTE",
    s4_alert_2: "P=NONE",
    s4_desc: "La suplantación elude las defensas internas. Este es un fallo de arquitectura B2B en toda la industria, no un error de su software de TI interno.",
    
    s5_roberto_title: "Agente Roberto",
    s5_roberto_desc: "Mapeo de Procedencia de Servidor y Reputación de IP.",
    s5_moises_title: "Agente Moisés",
    s5_moises_desc: "Validación de Metadatos Contractuales y de Pago.",
    s5_engine_desc: "Un motor de inteligencia autónomo que defiende activamente los protocolos de pago internacionales en tiempo real.",
    
    s6_supplier_title: "Proveedor Bulk Vulnerable en Asia/Europa",
    s6_supplier_desc: "Factura Suplantada con Datos Bancarios Alterados",
    s6_supplier_shield: "Perímetro SURE Shield",
    s6_supplier_readout: "El fraude rara vez comienza en sus servidores. Los atacantes interceptan correos auténticos de proveedores vulnerables y alteran los datos de pago. SURE audita pasivamente todo su canal B2B.",
    
    s7_act_title: "Entrada",
    s7_act_desc: "Envíe Dominios Públicos + 5 Principales Proveedores Bulk.",
    s7_act_step2: "Procesamiento",
    s7_act_step2_desc: "Escaneo Pasivo de 24 Horas.",
    s7_act_step3: "Resultado",
    s7_act_step3_desc: "Reciba un Informe de Riesgo Forense Completo.",
    s7_act_banner: "Su defensa fiduciaria comienza hoy. Cero fricción operativa. Cero riesgo.",
    s7_input_placeholder: "Ingrese dominio (ej: empresa.com)",
    s7_input_btn: "AUDITAR ->",
    s7_scan_running: "Escaneando registros...",
    
    s8_price_title: "$70",
    s8_price_sub: "USD / dominio",
    s8_price_sub2: "(Pago Único)",
    s8_benefit_1: "Cierre Técnico Inmediato.",
    s8_benefit_1_sub: "(Mitigación activa SURE Shield).",
    s8_benefit_2: "Informes Forenses de Riesgo Inmutables.",
    s8_benefit_2_sub: "(Prueba de debida diligencia ante tribunales y bancos).",
    s8_banner: "La defensa legal fiduciaria más rentable del mercado.",
    s8_loss_label: "Pérdida Fiduciaria Catastrófica",
    s8_btn_protect: "PROTEGER DOMINIO",
    s8_btn_skip: "No, exponer dominio al riesgo",
    
    s9_checkout_title: "Licencia Táctica SURE",
    s9_checkout_desc: "Auditoría forense operacional de pago único y activación de escudo.",
    s9_checkout_price: "$70.00",
    s9_checkout_payment: "Información de Tarjeta",
    s9_checkout_btn: "Pagar $70.00",
    s9_checkout_note: "Si posee un código de descuento, ingréselo en la casilla, haga clic en 'Aplicar' y luego proceda al pago.",
    
    s10_unlocked_title: "AUDITORÍA DESBLOQUEADA",
    s10_unlocked_badge: "Pago Verificado",
    s10_real_case: "Análisis de caso real de cliente",
    s10_infra_title: "Su Proveedor de Infraestructura:",
    s10_radio_title: "Radiología DNS Actual:",
    s10_exposed_title: "Vectores Técnicos Expuestos:",
    
    s11_title: "ASISTENCIA VISUAL POR IA",
    s11_desc: "Por favor conecte a la página de su proveedor, tome una captura de pantalla (Tip: use Win+Shift+S en Windows o Cmd+Shift+4 en Mac), péguela con \"CTRL+V\" o use el botón azul inferior, y presione \"CONTINUAR\".",
    s11_desc2: "Si no sabe DÓNDE está o qué hacer, solo capture la página donde se encuentre, péguela aquí y le indicaremos exactamente qué hacer.",
    s11_upload_title: "Suba su captura de pantalla o presione Ctrl+V",
    s11_upload_sub: "Haga clic, arrastre la imagen o pegue del portapapeles (PNG, JPG)",
    
    s12_title: "INSTRUCCIONES DE ALFREDO",
    s12_no_spoiler: "Una vez subida la captura de pantalla de su DNS, nuestro agente de IA Alfredo analizará el texto e indicará las instrucciones exactas de los cambios necesarios para limpiar y proteger su dominio.\n\nComo último paso, tras actualizar los parámetros, el agente de IA realiza un segundo escaneo para verificar el éxito de la protección.",
    s12_badge: "COINCIDENCIA ENCONTRADA",
    
    s13_title: "VERIFICACIÓN",
    s13_desc: "Tome una nueva captura de pantalla de los registros corregidos y péguela aquí (Ctrl+V o arrastrar) para la verificación final.",
    s13_btn_simulate: "SIMULAR VERIFICACIÓN (DEMO)",
    
    s14_title: "REPORTE SEGURO FINAL",
    s14_desc: "Su dominio se encuentra 100% Protegido y Autenticado.",
    s14_q1: "Califique del 1 al 10 qué tan fácil fue seguir las instrucciones de Alfredo:",
    s14_q2: "¿Siente total confianza de que los correos de su empresa ahora están completamente protegidos contra SPAM y suplantación?",
    s14_q3: "¿Recomendaría SURE a colegas y amigos?",
    s14_finish: "COMPLETAR REGISTRO",
    s14_contact: "Consultas de Auditoría y Soporte: alfredo@sureforensic.com",
    
    continue: "CONTINUAR",
    back: "ATRÁS"
  }
};

export default function DNSPresentation() {
  const [step, setStep] = useState(1);
  const [domainInput, setDomainInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDomain, setScannedDomain] = useState('empresa.com');
  const [clipboardImage, setClipboardImage] = useState<string | null>(null);

  const { language } = useLanguage();
  const t = LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS['en'];

  const nextStep = () => {
    if (step < 14) setStep(step + 1);
    else window.location.href = '/';
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    
    setIsScanning(true);
    setTimeout(() => {
      setScannedDomain(domainInput.trim());
      setIsScanning(false);
      setStep(8); // Move to Commercial Proposal slide (Catastrophic Loss)
    }, 2000);
  };

  // Keyboard navigation for presentation feel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Avoid navigating when typing in the domain input
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') {
        nextStep();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, domainInput]);

  // Handle Ctrl+V paste simulation
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (step === 11 || step === 13) {
        // Mock image paste for visual demo
        setClipboardImage('/tutorial/provider_dashboard.png');
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [step]);

  const renderStepContent = () => {
    switch (step) {
      case 1: // Portada: The Invisible Vulnerability
        return (
          <div className="flex flex-col items-center justify-center text-center w-full max-w-5xl mx-auto py-12 px-6 relative cursor-pointer" onClick={nextStep}>
            {/* Tech grid elements & glowing networks visual */}
            <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30 flex items-center justify-center">
              <svg className="w-[800px] h-[400px]" viewBox="0 0 800 400" fill="none">
                <path d="M 50,200 Q 200,100 400,200 T 750,200" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                <path d="M 50,150 Q 250,250 400,150 T 750,250" stroke="#008dda" strokeWidth="1.5" />
                <path d="M 50,250 Q 150,120 400,220 T 750,120" stroke="#64748b" strokeWidth="1" />
                <circle cx="200" cy="150" r="4" fill="#008dda" className="animate-ping" />
                <circle cx="400" cy="200" r="5" fill="#10b981" />
                <circle cx="550" cy="170" r="4" fill="#ef4444" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Branding badge */}
              <div className="flex items-center gap-3 mb-10 px-5 py-2 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <span className="font-montserrat font-bold text-slate-300 uppercase tracking-widest text-sm">SURE AUTONOMOUS CERTAINTY</span>
              </div>

              {/* Giant Title */}
              <h1 className="font-montserrat text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mb-12 select-none">
                {t.s1_title}
              </h1>

              {/* Sci-fi plus sign container */}
              <div className="relative w-full max-w-2xl bg-[#0F1E36]/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-8 md:p-12 shadow-[0_0_40px_rgba(16,185,129,0.05)] text-center transition-all duration-300 hover:border-emerald-500/40">
                {/* 4 corner plus signs */}
                <span className="absolute top-2 left-2 text-emerald-500/40 font-mono text-sm">+</span>
                <span className="absolute top-2 right-2 text-emerald-500/40 font-mono text-sm">+</span>
                <span className="absolute bottom-2 left-2 text-emerald-500/40 font-mono text-sm">+</span>
                <span className="absolute bottom-2 right-2 text-emerald-500/40 font-mono text-sm">+</span>

                {/* Box Content */}
                <h3 className="text-emerald-400 font-extrabold text-xl md:text-2xl mb-4 tracking-wide leading-snug">
                  {t.s1_box_title}
                </h3>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                  {t.s1_box_desc}
                </p>
              </div>

              {/* Subtle navigation cue */}
              <p className="text-slate-500 text-xs uppercase tracking-widest mt-12 animate-bounce">Click anywhere or press Right Arrow to proceed</p>
            </div>
          </div>
        );

      case 2: // Slide 2: Civil Liability Shift / Case Studco
        return (
          <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto gap-12 py-10 px-6 cursor-pointer" onClick={nextStep}>
            {/* Left: Folder graphic representing Legal Precedent */}
            <div className="flex-1 flex justify-center w-full relative">
              <div className="relative w-[340px] h-[400px] bg-[#14233c]/60 border border-blue-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-105">
                {/* Isometric folder cut tab */}
                <div className="absolute -top-4 left-6 w-36 h-8 bg-[#14233c] border-t border-l border-r border-blue-500/30 rounded-t-xl z-0" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">{language === 'es' ? 'Precedente Judicial' : 'Legal Precedent'}</span>
                    <div className="h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent w-full mt-2" />
                  </div>

                  <h2 className="text-center font-serif text-3xl font-black text-white leading-relaxed px-4 py-8 rounded-xl bg-slate-950/40 border border-blue-500/20 shadow-inner">
                    Studco Bldg. Sys. v. 1<sup>st</sup> Advantage
                  </h2>

                  <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                    <span>CASE ID: #260529</span>
                    <span>ACTIVE COURT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Divider */}
            <div className="hidden lg:block w-[1px] h-[350px] bg-gradient-to-b from-transparent via-slate-800 to-transparent" />

            {/* Right: Cascade flow diagram */}
            <div className="flex-1 w-full flex flex-col gap-6">
              <h2 className="text-3xl font-black text-white tracking-wide mb-2">
                {t.s2_title}
              </h2>

              {/* Cascade Item 1 */}
              <div className="relative bg-slate-900/80 border border-red-500/30 rounded-xl p-5 shadow-lg flex items-center justify-between overflow-hidden transition-all duration-300 hover:border-red-500/60">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 animate-pulse" />
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                  <span className="text-white font-extrabold text-lg">{t.s2_negligence_title}</span>
                </div>
                <span className="bg-red-500/10 border border-red-500/20 text-red-500 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest">{t.s2_negligence_tag}</span>
              </div>

              {/* Arrow */}
              <div className="flex justify-center w-full">
                <ArrowDown className="w-6 h-6 text-blue-500/60 animate-bounce" />
              </div>

              {/* Cascade Item 2 */}
              <div className="relative bg-[#1A263B] border border-blue-500/20 rounded-xl p-5 shadow-lg flex items-center gap-4 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                <Server className="w-6 h-6 text-blue-400 shrink-0" />
                <span className="text-slate-200 font-bold text-lg">{t.s2_bank_freed}</span>
              </div>

              {/* Arrow */}
              <div className="flex justify-center w-full">
                <ArrowDown className="w-6 h-6 text-blue-500/60 animate-bounce" />
              </div>

              {/* Cascade Item 3 */}
              <div className="relative bg-red-600/90 border border-red-500 rounded-xl p-5 shadow-lg flex items-center justify-between overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white" />
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-6 h-6 text-white shrink-0" />
                  <span className="text-white font-black text-base md:text-lg leading-snug">{t.s2_loss_title}</span>
                </div>
                <span className="bg-white text-red-600 font-black px-3 py-1 rounded-full text-xs uppercase tracking-widest shrink-0 shadow-md ml-3">{t.s2_loss_tag}</span>
              </div>
            </div>
          </div>
        );

      case 3: // Slide 3: Passive Radar (isometric pile and checklist)
        return (
          <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto gap-12 py-10 px-6 cursor-pointer" onClick={nextStep}>
            {/* Left: Passive Radar box with 3D isometric network plates */}
            <div className="flex-1 w-full bg-[#0A1220]/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                <span className="text-slate-400 text-xs font-mono font-bold tracking-widest uppercase">{t.s3_radar_sub}</span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>

              {/* Custom CSS Isometric Representation */}
              <div className="flex flex-col items-center py-6 relative overflow-hidden" style={{ height: '280px' }}>
                {/* Plate 1 (SPF - Red alert absent) */}
                <div className="absolute transition-all duration-500 hover:-translate-y-2 cursor-pointer" style={{ transform: 'rotateX(55deg) rotateZ(-30deg) translateY(-40px)', zIndex: 10 }}>
                  <div className="w-64 h-24 bg-red-950/90 border-2 border-red-500 rounded-2xl flex items-center justify-between px-6 shadow-[0_15px_30px_rgba(239,68,68,0.2)]">
                    <span className="font-mono text-2xl font-black text-white uppercase tracking-widest">SPF</span>
                    <span className="bg-red-500/20 border border-red-500/40 text-red-500 font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> DNS ABSENT
                    </span>
                  </div>
                </div>

                {/* Plate 2 (DKIM - Green verified) */}
                <div className="absolute transition-all duration-500 hover:-translate-y-2 cursor-pointer" style={{ transform: 'rotateX(55deg) rotateZ(-30deg) translateY(30px)', zIndex: 5 }}>
                  <div className="w-64 h-24 bg-emerald-950/80 border-2 border-emerald-500/60 rounded-2xl flex items-center justify-between px-6 shadow-[0_10px_25px_rgba(16,185,129,0.1)]">
                    <span className="font-mono text-2xl font-black text-slate-300 uppercase tracking-widest">DKIM</span>
                    <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> VERIFIED
                    </span>
                  </div>
                </div>

                {/* Plate 3 (DMARC - Green verified) */}
                <div className="absolute transition-all duration-500 hover:-translate-y-2 cursor-pointer" style={{ transform: 'rotateX(55deg) rotateZ(-30deg) translateY(100px)', zIndex: 2 }}>
                  <div className="w-64 h-24 bg-emerald-950/80 border-2 border-emerald-500/60 rounded-2xl flex items-center justify-between px-6 shadow-[0_5px_20px_rgba(16,185,129,0.05)]">
                    <span className="font-mono text-2xl font-black text-slate-300 uppercase tracking-widest">DMARC</span>
                    <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: KPI List and Readout */}
            <div className="flex-1 w-full flex flex-col gap-6">
              <h2 className="text-4xl font-extrabold text-white tracking-wide mb-2">
                {t.s3_title}
              </h2>

              <div className="flex flex-col gap-4">
                {/* Metric 1 */}
                <div className="bg-[#142035]/60 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 font-extrabold text-xl font-mono">
                      {t.s3_metric_1_val}
                    </div>
                    <span className="text-slate-300 font-semibold text-base md:text-lg">{t.s3_metric_1_lbl}</span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                </div>

                {/* Metric 2 */}
                <div className="bg-[#142035]/60 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 font-extrabold text-xl font-mono">
                      {t.s3_metric_2_val}
                    </div>
                    <span className="text-slate-300 font-semibold text-base md:text-lg">{t.s3_metric_2_lbl}</span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                </div>

                {/* Metric 3 */}
                <div className="bg-[#142035]/60 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-500 font-extrabold text-xl font-mono">
                      {t.s3_metric_3_val}
                    </div>
                    <span className="text-slate-300 font-semibold text-base md:text-lg">{t.s3_metric_3_lbl}</span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                </div>
              </div>

              {/* Forensic Readout container */}
              <div className="bg-slate-950/60 rounded-2xl p-6 border border-white/5 shadow-inner">
                <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">{t.s3_readout_title}</span>
                <p className="text-slate-400 text-sm leading-relaxed">{t.s3_readout_desc}</p>
              </div>
            </div>
          </div>
        );

      case 4: // Slide 4: 75% absent and Attacker bypass Firewall
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto py-8 px-6 cursor-pointer" onClick={nextStep}>
            {/* Header statistics */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left mb-12">
              <span className="font-montserrat text-7xl md:text-8xl font-black text-slate-300 tracking-tighter shrink-0">
                75%
              </span>
              <h2 className="text-xl md:text-3xl font-extrabold text-white leading-snug max-w-2xl">
                {t.s4_fail_title}
              </h2>
            </div>

            {/* Glowing warning badges */}
            <div className="flex gap-6 mb-12">
              <div className="px-6 py-3 border border-red-500 bg-red-500/10 text-red-500 font-black rounded-lg uppercase tracking-widest text-sm md:text-base animate-pulse">
                {t.s4_alert_1}
              </div>
              <div className="px-6 py-3 border border-red-500 bg-red-500/10 text-red-500 font-black rounded-lg uppercase tracking-widest text-sm md:text-base animate-pulse">
                {t.s4_alert_2}
              </div>
            </div>

            {/* Attacker Bypass Diagram */}
            <div className="relative w-full max-w-4xl bg-slate-950/60 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Attacker Node */}
              <div className="flex flex-col items-center gap-4 shrink-0 z-10">
                <div className="w-20 h-20 bg-slate-900 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500 text-3xl shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <i className="fas fa-user-secret"></i>
                </div>
                <span className="text-red-400 font-mono text-sm font-bold">{language === 'es' ? 'Atacante Externo' : 'External Attacker'}</span>
              </div>

              {/* Firewall / Shield Gate */}
              <div className="relative flex flex-col items-center shrink-0 z-10">
                {/* Glowing border vertical bar */}
                <div className="w-8 h-40 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/10" />
                  <span className="font-mono text-slate-500 text-xs font-bold uppercase tracking-widest rotate-90 leading-none py-4 w-40 text-center h-4 flex items-center justify-center">
                    FIREWALL
                  </span>
                </div>
                <span className="text-slate-400 font-semibold text-xs mt-3 text-center w-32 leading-relaxed">
                  Internal Antivirus / Firewall
                </span>
              </div>

              {/* Corporate Network Node */}
              <div className="flex flex-col items-center gap-4 shrink-0 z-10">
                <div className="w-20 h-20 bg-slate-900 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-500 text-3xl shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  <i className="fas fa-server"></i>
                </div>
                <span className="text-blue-400 font-mono text-sm font-bold">{language === 'es' ? 'Red Corporativa' : 'Corporate Network'}</span>
              </div>

              {/* Red Laser Arc Bypass Graphic (using absolute SVG overlay) */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block">
                <svg className="w-full h-full" viewBox="0 0 800 250" fill="none">
                  {/* Attacker is around X=150, Y=125, Firewall X=400, Y=125, Network X=650, Y=125 */}
                  <path d="M 150,110 Q 400,-30 650,110" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" className="animate-pulse shadow-md" style={{ filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.8))' }} />
                  <path d="M 150,110 L 400,110" stroke="#008dda" strokeWidth="2" strokeDasharray="4,4" />
                </svg>
              </div>

              {/* Tech Callout Label next to the laser bypass */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-64 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl text-xs md:text-sm">
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 border-l border-b border-slate-700 rotate-45 hidden md:block"></span>
                <p className="text-slate-300 leading-relaxed">
                  {t.s4_desc}
                </p>
              </div>
            </div>
          </div>
        );

      case 5: // Slide 5: Roberto & Moisés AI Engine
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto py-8 px-6 cursor-pointer" onClick={nextStep}>
            {/* SURE Header */}
            <div className="flex items-center gap-3 mb-12">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <span className="font-montserrat text-3xl font-black text-white tracking-tighter">SURE<span className="text-emerald-500">.</span></span>
            </div>

            {/* Loop Network container */}
            <div className="relative w-full max-w-4xl bg-slate-950/60 border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden min-h-[380px]">
              
              {/* Circuit SVG Loops connecting them */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 800 380" fill="none">
                  {/* Loop path between Left Node (X=180, Y=120) and Right Node (X=620, Y=120) */}
                  <path d="M 180,120 C 300,50 300,200 400,200 C 500,200 500,50 620,120" stroke="#10b981" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
                  <path d="M 180,120 C 300,200 300,50 400,50 C 500,50 500,200 620,120" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Flows merging down to SURE Shield (X=400, Y=300) */}
                  <path d="M 400,200 L 400,260" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 400,50 Q 350,120 400,200" stroke="#10b981" strokeWidth="1" />
                </svg>
              </div>

              {/* Two Column Nodus */}
              <div className="flex flex-col md:flex-row justify-between w-full gap-12 z-10">
                {/* Agent Roberto Node */}
                <div className="flex-1 bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4 transition-transform duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 text-2xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-white text-lg mb-1">{t.s5_roberto_title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{t.s5_roberto_desc}</p>
                  </div>
                </div>

                {/* Agent Moisés Node */}
                <div className="flex-1 bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4 transition-transform duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 text-2xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-white text-lg mb-1">{t.s5_moises_title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{t.s5_moises_desc}</p>
                  </div>
                </div>
              </div>

              {/* Logotipo Central Inferior */}
              <div className="flex flex-col items-center mt-12 z-10 shrink-0">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-pulse">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <span className="font-montserrat font-black text-white tracking-widest text-sm mt-3 uppercase">SURE</span>
              </div>
            </div>

            {/* Bottom engine note */}
            <p className="text-slate-400 text-sm font-semibold max-w-xl text-center leading-relaxed mt-10">
              {t.s5_engine_desc}
            </p>
          </div>
        );

      case 6: // Slide 6: Supply Chain bulk supplier threat
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto py-8 px-6 cursor-pointer" onClick={nextStep}>
            {/* Header Title */}
            <h2 className="text-3xl font-black text-white text-center tracking-wide mb-12">
              {language === 'es' ? 'Blindaje de Proveedores Bulk' : 'Supply Chain Protection'}
            </h2>

            {/* Network Vector Diagram */}
            <div className="relative w-full max-w-4xl bg-slate-950/60 border border-slate-800 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden min-h-[350px]">
              
              {/* Cyber Nodes Network Backdrop */}
              <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0">
                <svg className="w-full h-full" viewBox="0 0 800 300" fill="none">
                  <path d="M 150,150 L 300,100 L 450,200 L 650,150 L 450,100 L 300,200 Z" stroke="white" strokeWidth="1" />
                  <circle cx="150" cy="150" r="3" fill="white" />
                  <circle cx="300" cy="100" r="3" fill="white" />
                  <circle cx="450" cy="200" r="3" fill="white" />
                  <circle cx="650" cy="150" r="3" fill="white" />
                </svg>
              </div>

              {/* Left Node: Vulnerable Supplier */}
              <div className="flex flex-col items-center gap-4 shrink-0 z-10">
                <div className="w-20 h-20 bg-slate-900 border border-red-500/40 rounded-full flex items-center justify-center text-red-500 text-3xl shadow-[0_0_20px_rgba(239,68,68,0.2)] relative">
                  <div className="absolute -inset-1 rounded-full border border-red-500/20 animate-ping" />
                  <i className="fas fa-industry"></i>
                </div>
                <span className="text-red-400 font-mono text-xs font-bold text-center w-36 leading-relaxed">
                  {t.s6_supplier_title}
                </span>
              </div>

              {/* Central Barrier: SURE Shield Perimeter */}
              <div className="relative flex flex-col items-center shrink-0 z-10 transition-transform duration-300 hover:scale-105">
                {/* Glowing green wall */}
                <div className="w-6 h-36 bg-emerald-500/20 border-2 border-emerald-500 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                  <ShieldCheck className="w-4 h-4 text-emerald-400 rotate-90" />
                </div>
                <span className="text-emerald-400 font-bold text-xs mt-3 text-center w-28 leading-relaxed uppercase">
                  {t.s6_supplier_shield}
                </span>
              </div>

              {/* Right Node: Client (Secure Receipt) */}
              <div className="flex flex-col items-center gap-4 shrink-0 z-10">
                <div className="w-20 h-20 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 text-3xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <i className="fas fa-building-user"></i>
                </div>
                <span className="text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">{language === 'es' ? 'Cliente (Usted)' : 'Client (You)'}</span>
              </div>

              {/* Red laser impact visual */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block">
                <svg className="w-full h-full" viewBox="0 0 800 300" fill="none">
                  {/* Electrical red wave hitting the green barrier (X=400) from Supplier (X=150) */}
                  <path d="M 170,140 Q 250,110 320,150 T 395,140" stroke="#ef4444" strokeWidth="3" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.6))' }} />
                  {/* Shattered red pieces at X=400, Y=140 */}
                  <circle cx="395" cy="140" r="4" fill="#ef4444" />
                  <circle cx="398" cy="135" r="3" fill="#ef4444" />
                  <circle cx="396" cy="146" r="2" fill="#ef4444" />
                  
                  {/* Safe silver line from barrier (X=405) to Client (X=610) */}
                  <path d="M 405,140 L 610,140" stroke="#cbd5e1" strokeWidth="2" />
                </svg>
              </div>

              {/* Small explanation box */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-64 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl text-xs md:text-sm">
                <p className="text-slate-300 font-medium text-center leading-normal">
                  {t.s6_supplier_desc}
                </p>
              </div>
            </div>

            {/* Bottom text explanation */}
            <div className="bg-[#0F1E36]/60 border border-emerald-500/10 rounded-2xl p-6 max-w-3xl text-center leading-relaxed mt-10 shadow-lg">
              <p className="text-slate-300 text-sm md:text-base">
                {t.s6_supplier_readout}
              </p>
            </div>
          </div>
        );

      case 7: // Slide 7: 1-2-3 Activation CTA slide with integrated interactive SCANNER!
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto py-8 px-6">
            {/* SURE Header */}
            <div className="flex items-center gap-3 mb-10">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <span className="font-montserrat text-3xl font-black text-white tracking-tighter">SURE<span className="text-emerald-500">.</span></span>
            </div>

            {/* Steps Container */}
            <div className="relative w-full max-w-4xl bg-slate-950/60 border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden mb-10">
              
              {/* Connecting line */}
              <div className="absolute top-24 left-[20%] right-[20%] h-[3px] bg-slate-800 z-0 hidden md:block">
                <div className="h-full bg-emerald-500/60 w-2/3" />
              </div>

              {/* Steps columns */}
              <div className="flex flex-col md:flex-row justify-between w-full gap-8 z-10 mb-8">
                {/* Step 1 */}
                <div className="flex-1 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center text-slate-300 text-2xl font-black mb-4 shrink-0 shadow-inner">
                    1
                  </div>
                  <h3 className="font-montserrat font-bold text-white text-lg mb-2">{t.s7_act_title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">{t.s7_act_desc}</p>
                </div>

                {/* Step 2 */}
                <div className="flex-1 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center text-slate-300 text-2xl font-black mb-4 shrink-0 shadow-inner">
                    2
                  </div>
                  <h3 className="font-montserrat font-bold text-white text-lg mb-2">{t.s7_act_step2}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">{t.s7_act_step2_desc}</p>
                </div>

                {/* Step 3 */}
                <div className="flex-1 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500 bg-slate-900 flex items-center justify-center text-emerald-400 text-2xl font-black mb-4 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    3
                  </div>
                  <h3 className="font-montserrat font-bold text-emerald-400 text-lg mb-2">{t.s7_act_step3}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">{t.s7_act_step3_desc}</p>
                </div>
              </div>

              {/* Bottom box */}
              <div className="w-full max-w-2xl bg-emerald-950/20 border-2 border-emerald-500 rounded-2xl p-4 text-center mt-4">
                <p className="text-emerald-400 font-bold text-sm md:text-base">
                  {t.s7_act_banner}
                </p>
              </div>
            </div>

            {/* LIVE DYNAMIC SCANNER FIELD */}
            <div className="w-full max-w-2xl bg-[#0F1E36]/90 border border-emerald-500/30 rounded-2xl p-8 shadow-2xl relative">
              <h3 className="text-xl font-bold text-white mb-6 text-center tracking-wide">
                {language === 'es' ? 'Prueba la Auditoría Pasiva en Vivo (Sin Costo)' : 'Try the Live Passive Audit (Free)'}
              </h3>
              
              <form onSubmit={handleStartScan} className="relative group max-w-lg mx-auto">
                <input 
                  type="text" 
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder={t.s7_input_placeholder}
                  disabled={isScanning}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-6 pr-36 py-4 text-lg text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={isScanning}
                  className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-6 rounded-lg transition-all flex items-center gap-2 uppercase text-xs md:text-sm tracking-wider shadow-md active:scale-95 disabled:bg-slate-800 disabled:text-slate-500"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>...</span>
                    </>
                  ) : (
                    <>
                      <span>{t.s7_input_btn}</span>
                    </>
                  )}
                </button>
              </form>

              {isScanning && (
                <div className="flex items-center justify-center gap-3 mt-4 text-emerald-400 font-bold animate-pulse text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.s7_scan_running}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 8: // Slide 8: Commercial pricing Catastrophic loss ($70 One-time per domain!)
        return (
          <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto gap-12 py-8 px-6">
            
            {/* Left Column: Catastrophic Fiduciary Loss Chart */}
            <div className="flex-1 w-full bg-[#0A1220]/80 border border-slate-800 rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between min-h-[380px]">
              <div>
                <span className="text-red-500 text-xs font-mono font-bold tracking-widest block mb-2 uppercase">{t.s8_loss_label}</span>
                <div className="h-[2px] bg-gradient-to-r from-red-500/50 to-transparent w-full mt-2 mb-8" />
              </div>

              {/* Red glowing line chart graphic with invoice */}
              <div className="relative py-6 w-full flex items-center justify-center" style={{ height: '200px' }}>
                
                {/* Floating Invoice Icon in glowing red */}
                <div className="absolute top-0 left-12 w-16 h-20 bg-slate-900 border-2 border-red-500 rounded-xl flex flex-col justify-between p-3.5 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-bounce">
                  <span className="font-mono font-bold text-[9px] uppercase tracking-tighter">INVOICE</span>
                  <div className="h-1 bg-red-500/50 w-full" />
                  <div className="h-1 bg-red-500/50 w-3/4" />
                  <div className="h-1 bg-red-500/50 w-1/2" />
                </div>

                {/* Jagged downtrend chart SVG */}
                <svg className="w-full h-full" viewBox="0 0 350 180" fill="none">
                  {/* Red jagged drop line */}
                  <path d="M 10,20 L 70,60 L 120,40 L 180,120 L 230,90 L 290,160 M 290,160 L 275,160 M 290,160 L 290,145" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.7))' }} />
                  {/* Alert circle */}
                  <circle cx="290" cy="160" r="5" fill="#ef4444" />
                </svg>
              </div>

              <div className="text-center font-bold text-red-400 text-lg uppercase tracking-wide mt-4">
                {language === 'es' ? 'Pérdida Fiduciaria Catastrófica' : 'Catastrophic Fiduciary Loss'}
              </div>
            </div>

            {/* Middle Divider */}
            <div className="hidden lg:block w-[1px] h-[350px] bg-gradient-to-b from-transparent via-slate-800 to-transparent" />

            {/* Right Column: Premium $70 Pricing commercial layout */}
            <div className="flex-1 w-full flex flex-col justify-center px-4 lg:px-8">
              {/* Price Tag header */}
              <div className="flex items-center gap-6 mb-6">
                <span className="font-montserrat text-6xl md:text-7xl font-black text-emerald-400 shrink-0">
                  {t.s8_price_title}
                </span>
                <div>
                  <h3 className="text-white font-extrabold text-2xl tracking-wide uppercase">
                    {t.s8_price_sub}
                  </h3>
                  <span className="text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                    {t.s8_price_sub2}
                  </span>
                </div>
              </div>

              {/* Green Safe Box Graphic */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 mb-8">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-3xl shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
                  <i className="fas fa-vault"></i>
                </div>
                <div>
                  <span className="text-white font-bold text-sm md:text-base uppercase tracking-wider block">{language === 'es' ? 'Fideicomiso Blindado' : 'Fiduciary Shield Secured'}</span>
                  <span className="text-emerald-400 text-xs font-semibold">{t.s8_banner}</span>
                </div>
              </div>

              {/* Bullet Silver Plates */}
              <div className="space-y-4 mb-8">
                {/* Plate 1 */}
                <div className="relative bg-[#1A263B] border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4 shadow-md">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-white font-bold text-sm block">{t.s8_benefit_1}</span>
                    <span className="text-slate-400 text-xs">{t.s8_benefit_1_sub}</span>
                  </div>
                </div>

                {/* Plate 2 */}
                <div className="relative bg-[#1A263B] border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4 shadow-md">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-white font-bold text-sm block">{t.s8_benefit_2}</span>
                    <span className="text-slate-400 text-xs">{t.s8_benefit_2_sub}</span>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={nextStep}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Lock className="w-4 h-4" /> {t.s8_btn_protect}
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-sm py-4 px-4 rounded-xl border border-slate-800 transition-colors text-center"
                >
                  {t.s8_btn_skip}
                </button>
              </div>
            </div>
          </div>
        );

      case 9: // Stripe Checkout
        return (
          <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="mb-6 bg-blue-900/20 border border-blue-500/30 p-5 rounded-2xl max-w-3xl">
              <p className="text-blue-200 text-sm md:text-base font-semibold flex items-center justify-center gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0" />
                {t.s9_checkout_note}
              </p>
            </div>
            
            <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-8 mb-8 text-left shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
              
              <div className="flex justify-between items-start mb-8 pb-8 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-xl font-bold text-white">{t.s9_checkout_title}</h3>
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm">{t.s9_checkout_desc}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">{t.s9_checkout_price}</div>
                  <div className="text-xs text-slate-500 font-bold tracking-widest mt-1">USD ({language === 'es' ? 'Pago Único' : 'One-Time'})</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email</label>
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-slate-300 font-mono text-sm">
                    {language === 'es' ? 'contacto@tu-empresa.com' : 'contact@your-company.com'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{t.s9_checkout_payment}</label>
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
                     <span className="text-slate-300 font-mono">•••• •••• •••• 4242</span>
                     <div className="flex gap-2">
                       <span className="text-slate-500 text-sm font-mono">12/28</span>
                       <span className="text-slate-500 text-sm font-mono">CVC</span>
                     </div>
                  </div>
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 hover:scale-[1.02] shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                >
                  <Lock className="w-5 h-5" /> {t.s9_checkout_btn}
                </button>
              </div>
            </div>
            
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">(DEMO SECURE ENVIRONMENT)</p>
          </div>
        );

      case 10: // Technical radiology
        return (
          <div className="w-full max-w-5xl mx-auto cursor-pointer" onClick={nextStep}>
            <div className="bg-[#0A1220]/80 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
              <div className="bg-slate-900/80 p-6 border-b border-slate-800 flex justify-between items-center relative">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" /> {t.s10_unlocked_title}
                  </h2>
                  <div className="font-mono text-slate-400 text-sm mt-1">Target: <span className="text-blue-400 font-bold">@{scannedDomain.toUpperCase()}</span> <span className="ml-2 text-emerald-400/80 italic text-xs">({t.s10_real_case})</span></div>
                </div>
                <div className="px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {t.s10_unlocked_badge}
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Infrastructure Provider */}
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                     <Lock className="w-4 h-4 text-slate-400" /> {t.s10_infra_title}
                  </h3>
                  <div className="inline-block px-6 py-3 bg-blue-950/30 border border-blue-900 rounded-xl text-blue-400 font-mono font-bold">
                    Private DNS Server
                  </div>
                </div>

                {/* DNS Radiology */}
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4 text-slate-400" /> {t.s10_radio_title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 border-b border-slate-800 text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <div className="w-1/4">Type</div>
                      <div className="w-1/2">Detected Values</div>
                      <div className="w-1/4 text-right">Status</div>
                    </div>
                    <div className="flex justify-between p-3 items-center text-sm">
                      <div className="w-1/4 font-mono text-blue-400 font-bold">A / AAAA</div>
                      <div className="w-1/2 text-slate-300">No IPv4</div>
                      <div className="w-1/4 text-right"><span className="px-3 py-1 bg-slate-800 rounded text-slate-400 font-bold text-xs">- N/A</span></div>
                    </div>
                    <div className="flex justify-between p-3 items-center text-sm">
                      <div className="w-1/4 font-mono text-blue-400 font-bold">NS</div>
                      <div className="w-1/2 text-slate-300">Not detected</div>
                      <div className="w-1/4 text-right"><span className="px-3 py-1 bg-red-950/50 border border-red-900 rounded text-red-500 font-bold text-xs">x FAIL</span></div>
                    </div>
                    <div className="flex justify-between p-3 items-center text-sm">
                      <div className="w-1/4 font-mono text-blue-400 font-bold">MX</div>
                      <div className="w-1/2 text-slate-300">No Mail Servers</div>
                      <div className="w-1/4 text-right"><span className="px-3 py-1 bg-red-950/50 border border-red-900 rounded text-red-500 font-bold text-xs">x FAIL</span></div>
                    </div>
                    <div className="flex justify-between p-3 items-center text-sm">
                      <div className="w-1/4 font-mono text-blue-400 font-bold">TXT (SPF)</div>
                      <div className="w-1/2 text-slate-300">Missing SPF Policy</div>
                      <div className="w-1/4 text-right"><span className="px-3 py-1 bg-red-950/50 border border-red-500/50 rounded text-red-500 font-bold text-xs">x VULN</span></div>
                    </div>
                    <div className="flex justify-between p-3 items-center text-sm bg-red-500/5 rounded-lg border border-red-500/20">
                      <div className="w-1/4 font-mono text-blue-400 font-bold">TXT (DMARC)</div>
                      <div className="w-1/2 text-red-400 font-bold">Missing DMARC Policy</div>
                      <div className="w-1/4 text-right"><span className="px-3 py-1 bg-red-500 text-white rounded font-black text-xs uppercase animate-pulse">CRIT</span></div>
                    </div>
                  </div>
                </div>

                {/* Exposed Technical Vectors */}
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4" /> {t.s10_exposed_title}
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 border border-red-900/50 bg-red-950/20 rounded-lg text-red-400 font-mono text-sm">issue_mx_resolve</div>
                    <div className="p-3 border border-red-900/50 bg-red-950/20 rounded-lg text-red-400 font-mono text-sm">issue_txt_resolve</div>
                    <div className="p-3 border border-red-900/50 bg-red-950/20 rounded-lg text-red-400 font-mono text-sm">issue_dmarc_resolve</div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                   <button onClick={(e) => { e.stopPropagation(); nextStep(); }} className="px-12 py-4 bg-emerald-500 text-black font-extrabold rounded-lg uppercase transition-transform hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]">{t.continue}</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 11: // Visual AI screenshot upload
        return (
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-[#0A1220]/80 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <h3 className="text-2xl font-bold text-white mb-6 ml-4 tracking-wide">
                {t.s11_title}
              </h3>
              <p className="text-slate-300 ml-4 text-base md:text-lg leading-relaxed mb-4">
                {t.s11_desc}
              </p>
              <p className="text-slate-300 ml-4 text-base md:text-lg leading-relaxed mb-8">
                {t.s11_desc2}
              </p>
              
              <div className="ml-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
                <div 
                  onClick={nextStep}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/40 rounded-xl py-16 px-8 relative bg-emerald-950/5 cursor-pointer transition-all hover:bg-emerald-950/10"
                >
                  {clipboardImage ? (
                    <div className="flex flex-col items-center">
                      <img src={clipboardImage} alt="Clipboard content" className="max-h-[220px] rounded-lg border border-emerald-500/30 shadow-lg mb-4" />
                      <p className="text-emerald-400 font-extrabold text-lg">{language === 'es' ? '¡Imagen Cargada!' : 'Image Loaded!'}</p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-16 h-16 text-emerald-500/40 mb-4 animate-bounce" />
                      <p className="text-xl font-bold text-white mb-2">{t.s11_upload_title}</p>
                      <p className="text-slate-500 text-sm mb-8">{t.s11_upload_sub}</p>
                    </>
                  )}
                  
                  <button onClick={(e) => { e.stopPropagation(); nextStep(); }} className="px-10 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-lg uppercase transition-all tracking-wider flex items-center gap-2 shadow-md">
                    {t.continue} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 12: // Alfredo instructions
        return (
          <div className="w-full max-w-6xl mx-auto cursor-pointer" onClick={nextStep}>
            <div className="bg-[#0A1220]/80 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <h3 className="text-2xl font-bold text-white mb-6 ml-4 tracking-wide">{t.s12_title}</h3>
              
              <div className="ml-4 flex flex-col lg:flex-row gap-10 items-center">
                {/* Left Side: Screenshot with Bounding Box */}
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 relative w-full">
                  <img src="/tutorial/dns_settings.png" alt="DNS Settings" className="w-full h-auto rounded-lg opacity-90 border border-slate-800" />
                  {/* Bounding box outline */}
                  <div className="absolute border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] bg-red-500/20 animate-pulse rounded-lg pointer-events-none" style={{top: '40%', left: '2%', width: '96%', height: '22%'}}></div>
                </div>

                {/* Right Side: Commercial AI Explanation Text */}
                <div className="w-full lg:w-[450px] shrink-0 flex flex-col gap-6">
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-8 shadow-xl flex-1 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="font-montserrat font-black text-white text-lg tracking-wider uppercase">{t.s12_badge}</span>
                    </div>
                    
                    <div className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                      {t.s12_no_spoiler}
                    </div>
                  </div>

                  <button className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-lg uppercase tracking-wider transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2" onClick={(e) => { e.stopPropagation(); nextStep(); }}>
                    {t.continue} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 13: // Final verification screenshot upload
        return (
          <div className="w-full max-w-5xl mx-auto cursor-pointer" onClick={nextStep}>
            <div className="bg-[#0A1220]/80 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <h3 className="text-2xl font-bold text-white mb-4 ml-4">
                {t.s13_title}
              </h3>
              <p className="text-slate-300 ml-4 text-base md:text-lg leading-relaxed mb-8">
                {t.s13_desc}
              </p>
              
              <div className="ml-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/30 rounded-xl py-12 px-6 relative bg-slate-900">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500/50 mb-4 animate-pulse" />
                  <p className="text-xl font-bold text-emerald-400 mb-2">CTRL + V</p>
                  <button onClick={(e) => { e.stopPropagation(); nextStep(); }} className="mt-6 px-10 py-4 bg-emerald-500 text-black font-extrabold rounded-lg uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)] tracking-wide">
                    {t.s13_btn_simulate}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 14: // Final Report & Satisfaction survey
        return (
          <div className="w-full max-w-3xl mx-auto bg-slate-900 border border-emerald-500/20 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            <div className="text-center mb-8 flex flex-col items-center">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4" />
              <h2 className="text-3xl font-black text-white">{t.s14_title}</h2>
              <p className="text-lg text-emerald-400 mt-2 font-bold">{t.s14_desc}</p>
            </div>

            <div className="space-y-6 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 mb-8">
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{t.s14_q1}</label>
                <input type="text" readOnly value="10" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none font-mono font-bold text-emerald-400 text-center" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{t.s14_q2}</label>
                <input type="text" readOnly value={language === 'es' ? 'Sí' : 'Yes'} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none font-mono font-bold text-emerald-400 text-center" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{t.s14_q3}</label>
                <input type="text" readOnly value={language === 'es' ? 'Sí' : 'Yes'} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none font-mono font-bold text-emerald-400 text-center" />
              </div>
            </div>
            
            <div className="text-center text-slate-500 text-xs font-bold font-mono tracking-wide mb-8 uppercase">
              {t.s14_contact}
            </div>

            <div className="flex justify-center">
              <button onClick={nextStep} className="px-16 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl uppercase tracking-wider transition-all transform hover:scale-105 shadow-xl">
                {t.s14_finish}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B192C] text-white font-open-sans overflow-x-hidden selection:bg-emerald-500/30 flex flex-col justify-between">
      {/* Navigation Bar with Presentation Banner */}
      <nav className="w-full px-6 py-4 bg-[#0B192C] border-b border-white/5 flex justify-between items-center relative z-20 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
          <span className="font-montserrat font-black text-2xl tracking-tighter text-white">
            SURE<span className="text-emerald-500">.</span>
          </span>
        </div>
        
        {/* BIG PRESENTATION BANNER */}
        <div className="absolute left-1/2 -translate-x-1/2 bg-red-500 text-white px-5 py-1.5 rounded-full text-xs font-black tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400 animate-pulse hidden md:block">
          SURE DNS COMMERCIAL
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <div className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3.5 py-2 rounded-lg font-mono">
            Slide {step}/14
          </div>
        </div>
      </nav>

      {/* Main Presentation Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative w-full overflow-hidden">
        {/* Progress bar background visual */}
        <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full z-10">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(step / 14) * 100}%` }}></div>
        </div>
        
        {renderStepContent()}
      </main>

      {/* Bottom control bar */}
      <footer className="w-full px-6 py-4 bg-[#0B192C] border-t border-white/5 flex justify-between items-center z-20 shrink-0">
        {step > 1 ? (
          <button 
            onClick={prevStep} 
            className="px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </button>
        ) : (
          <div />
        )}
        
        {step < 14 && (
          <button 
            onClick={nextStep} 
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md ml-auto"
          >
            {t.continue} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
}
