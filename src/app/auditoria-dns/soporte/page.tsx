"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, UploadCloud, Search, ShieldAlert, CheckCircle2, ChevronRight, Loader2, Server, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';

const LOCAL_TRANSLATIONS: Record<string, any> = {
  es: {
    title: "Portal de Soporte VIP",
    subtitle: "Sube una captura de tu proveedor (GoDaddy, Namecheap, etc.) y nuestro equipo de IA te guiará paso a paso.",
    domainPlaceholder: "Ej: miempresa.com",
    dragDrop: "Haz clic, pega (Ctrl+V) o arrastra tu captura de pantalla aquí",
    uploading: "Analizando captura y dominio...",
    btnAnalyze: "Iniciar Auditoría",
    successTitle: "Guía de Configuración",
    successSub: "Sigue estos pasos exactos en tu proveedor de dominio para recuperar tu entregabilidad.",
    badge: "SOPORTE 24/7",
    resetBtn: "Subir otra captura",
    screenshotTip: "💡 Tip: Presiona 'Print Screen' (PrtScn) en tu teclado, o 'Win+Shift+S' (Windows) / 'Cmd+Shift+4' (Mac), y luego presiona Ctrl+V aquí.",
    domainLabel: "DOMINIO AFECTADO",
    screenshotLabel: "CAPTURA DE PANTALLA",
    tutorialLink: "¿No sabes cómo tomar la captura? Mira este tutorial"
  },
  en: {
    title: "VIP Support Portal",
    subtitle: "Upload a screenshot of your provider (GoDaddy, Namecheap, etc.) and our AI team will guide you step by step.",
    domainPlaceholder: "Ex: mycompany.com",
    dragDrop: "Click, paste (Ctrl+V) or drag your screenshot here",
    uploading: "Analyzing screenshot and domain...",
    btnAnalyze: "Start Audit",
    successTitle: "Configuration Guide",
    successSub: "Follow these exact steps in your domain provider to recover your deliverability.",
    badge: "24/7 SUPPORT",
    resetBtn: "Upload another screenshot",
    screenshotTip: "💡 Tip: Press 'Print Screen' (PrtScn) on your keyboard, or 'Win+Shift+S' (Windows) / 'Cmd+Shift+4' (Mac), then press Ctrl+V here.",
    domainLabel: "AFFECTED DOMAIN",
    screenshotLabel: "SCREENSHOT",
    tutorialLink: "Don't know how to take a screenshot? Watch this tutorial"
  },
  // Adding quick fallbacks for the other 7 languages so it never breaks
  fr: { title: "Portail VIP", subtitle: "Téléchargez une capture d'écran...", domainPlaceholder: "Ex: monsite.com", dragDrop: "Cliquez ou glissez ici", uploading: "Analyse...", btnAnalyze: "Démarrer", successTitle: "Guide", successSub: "Suivez ces étapes.", badge: "SUPPORT 24/7", resetBtn: "Télécharger une autre capture", screenshotTip: "💡 Astuce: Appuyez sur 'Print Screen' (PrtScn) ou 'Win+Shift+S' (Win) / 'Cmd+Shift+4' (Mac), puis Ctrl+V ici." },
  de: { title: "VIP-Portal", subtitle: "Laden Sie einen Screenshot hoch...", domainPlaceholder: "Bsp: meinefirma.de", dragDrop: "Klicken oder ziehen", uploading: "Analysieren...", btnAnalyze: "Starten", successTitle: "Anleitung", successSub: "Folgen Sie diesen Schritten.", badge: "24/7 SUPPORT", resetBtn: "Weiteren Screenshot hochladen", screenshotTip: "💡 Tipp: Drücken Sie 'Print Screen' (PrtScn) oder 'Win+Shift+S' (Win) / 'Cmd+Shift+4' (Mac) und dann hier Ctrl+V." },
  pt: { title: "Portal VIP", subtitle: "Faça upload de uma captura...", domainPlaceholder: "Ex: minhaempresa.com", dragDrop: "Clique ou arraste", uploading: "Analisando...", btnAnalyze: "Iniciar", successTitle: "Guia", successSub: "Siga estes passos.", badge: "SUPORTE 24/7", resetBtn: "Fazer upload de outra captura", screenshotTip: "💡 Dica: Pressione 'Print Screen' (PrtScn) ou 'Win+Shift+S' (Win) / 'Cmd+Shift+4' (Mac) e depois Ctrl+V aqui." },
  zh: { title: "VIP 门户", subtitle: "上传截图...", domainPlaceholder: "例如: mycompany.com", dragDrop: "点击或拖拽", uploading: "分析中...", btnAnalyze: "开始", successTitle: "指南", successSub: "按照这些步骤操作。", badge: "24/7 支持", resetBtn: "上传另一张截图", screenshotTip: "💡 提示：按键盘上的 'Print Screen' (PrtScn) 或 'Win+Shift+S' (Win) / 'Cmd+Shift+4' (Mac)，然后在此处按 Ctrl+V。" },
  ru: { title: "VIP Портал", subtitle: "Загрузите скриншот...", domainPlaceholder: "Например: mycompany.com", dragDrop: "Нажмите или перетащите", uploading: "Анализ...", btnAnalyze: "Начать", successTitle: "Руководство", successSub: "Следуйте этим шагам.", badge: "ПОДДЕРЖКА 24/7", resetBtn: "Загрузить другой скриншот", screenshotTip: "💡 Подсказка: Нажмите 'Print Screen' (PrtScn) или 'Win+Shift+S' (Win) / 'Cmd+Shift+4' (Mac), затем нажмите Ctrl+V здесь." },
  ar: { title: "بوابة VIP", subtitle: "ارفع لقطة شاشة...", domainPlaceholder: "مثال: mycompany.com", dragDrop: "انقر أو اسحب", uploading: "جاري التحليل...", btnAnalyze: "ابدأ", successTitle: "دليل", successSub: "اتبع هذه الخطوات.", badge: "دعم 24/7", resetBtn: "رفع لقطة شاشة أخرى", screenshotTip: "💡 نصيحة: اضغط على 'Print Screen' أو 'Win+Shift+S' (Win) / 'Cmd+Shift+4' (Mac)، ثم اضغط Ctrl+V هنا." },
  hi: { title: "VIP पोर्टल", subtitle: "एक स्क्रीनशॉट अपलोड करें...", domainPlaceholder: "जैसे: mycompany.com", dragDrop: "क्लिक करें या खींचें", uploading: "विश्लेषण कर रहा है...", btnAnalyze: "प्रारंभ", successTitle: "मार्गदर्शिका", successSub: "इन चरणों का पालन करें।", badge: "24/7 समर्थन", resetBtn: "एक और स्क्रीनशॉट अपलोड करें", screenshotTip: "💡 टिप: अपने कीबोर्ड पर 'Print Screen' (PrtScn) या 'Win+Shift+S' (Win) / 'Cmd+Shift+4' (Mac) दबाएं, फिर यहां Ctrl+V दबाएं।" }
};

export default function DNSSupportPortal() {
  const { language } = useLanguage();
  const t = LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS['es'];

  const [domain, setDomain] = useState('');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setFileBase64(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setFileBase64(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Global Paste Handler
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setFileName(`Screenshot_Pasted.png`);
            const reader = new FileReader();
            reader.onload = (evt) => {
              if (evt.target?.result) {
                setFileBase64(evt.target.result as string);
              }
            };
            reader.readAsDataURL(file);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

  const handleAnalyze = async () => {
    if (!domain || !fileBase64) {
      setError("Por favor, ingresa tu dominio y sube una captura de pantalla.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch('/api/dns/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          domain, 
          imageBase64: fileBase64,
          language: language
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Falló el análisis");

      setReport(data.report);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-white font-open-sans overflow-x-hidden selection:bg-emerald-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full px-6 py-4 border-b border-white/5 bg-[#050a14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <span className="font-montserrat font-black text-2xl tracking-tighter text-white">
              SURE<span className="text-emerald-500">.</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <LanguageSelector />
            <div className="text-sm font-bold text-slate-400 tracking-widest uppercase hidden md:flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-500" /> {t.badge}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-12 md:pt-40 md:pb-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-montserrat mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            {t.title}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {!report ? (
          /* Input Section */
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Server className="w-48 h-48" />
            </div>

            <div className="space-y-6 relative z-10">
              {/* Educational Onboarding Box */}
              <div className="mb-8 p-5 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  ¿A qué debo tomarle foto exactamente?
                </h3>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside font-medium mb-4">
                  <li>Inicia sesión en la empresa donde compraste tu página web (GoDaddy, Hostinger, etc.).</li>
                  <li>Busca y haz clic en opciones como <span className="text-emerald-400 font-bold">"Administrar DNS", "Zona DNS" o "Registros"</span>.</li>
                  <li>Toma una "foto" (captura) de la lista de códigos que veas ahí y pégala aquí abajo. ¡La IA se encarga del resto!</li>
                </ol>
                <div className="mt-4 rounded-lg overflow-hidden border border-blue-500/30 shadow-lg relative">
                  <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/80 to-transparent z-10">
                    <p className="text-xs text-blue-200 font-bold text-center">EJEMPLO: Tómale foto a algo que se vea así 👇</p>
                  </div>
                  <img src="/tutorial/dns_management_interface_1777310333070.png" alt="Ejemplo de Panel DNS" className="w-full opacity-90 hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Domain Input */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3 font-montserrat uppercase tracking-wider">
                  {t.domainLabel || "DOMINIO AFECTADO"}
                </label>
                
                {/* Visual Explanation of a Domain */}
                <div className="mb-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center gap-2">
                  <p className="text-sm text-slate-300">
                    💡 Tu dominio es lo que va <strong>después del @</strong> en tu correo corporativo:
                  </p>
                  <p className="text-xl text-slate-400 tracking-wide mt-1 font-light">
                    juan.perez<strong className="text-emerald-400 font-bold ml-1">@mi-empresa.com</strong>
                  </p>
                </div>

                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder={t.domainPlaceholder}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 font-montserrat uppercase tracking-wider">
                  {t.screenshotLabel || "CAPTURA DE PANTALLA"}
                </label>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/20 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <UploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-4 group-hover:text-emerald-400 transition-colors" />
                  {fileName ? (
                    <p className="text-emerald-400 font-bold">{fileName}</p>
                  ) : (
                    <p className="text-slate-400">{t.dragDrop}</p>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center px-4">
                  {t.screenshotTip}
                </p>
                <div className="mt-6 flex justify-center">
                  <a href="/tutorial/1.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border border-blue-500/30 rounded-full transition-all text-sm font-medium text-blue-300 hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.15)] group">
                    <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform text-blue-400" />
                    {t.tutorialLink || "¿No sabes cómo tomar la captura? Mira este tutorial"}
                  </a>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <button 
                onClick={handleAnalyze}
                disabled={isProcessing || !domain || !fileBase64}
                className="w-full relative group overflow-hidden bg-white text-black font-bold py-4 px-8 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-3 text-lg mt-4"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin relative z-10 text-black" />
                    <span className="relative z-10">{t.uploading}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 relative z-10" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">{t.btnAnalyze}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-500/20 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-montserrat text-white">{t.successTitle}</h2>
                <p className="text-slate-400">{t.successSub}</p>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Markdown Content styling specific for dark mode */}
              <div className="prose prose-invert prose-emerald max-w-none 
                prose-headings:font-montserrat prose-headings:font-bold 
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-li:text-slate-300
                prose-code:bg-black/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-emerald-400 prose-code:before:content-none prose-code:after:content-none
                prose-strong:text-white"
              >
                <ReactMarkdown>
                  {report}
                </ReactMarkdown>
              </div>

              <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
                <button 
                  onClick={() => setReport(null)}
                  className="text-slate-400 hover:text-white text-sm font-bold transition-colors"
                >
                  {t.resetBtn}
                </button>
                <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                  SURE AI Agent <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
