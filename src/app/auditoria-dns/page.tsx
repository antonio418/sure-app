"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, ShieldAlert, Lock, ArrowRight, Loader2, Server, CheckCircle2, AlertTriangle, ChevronRight, Search, Copy, Globe, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import Image from 'next/image';
import SUREChatWidget from '@/components/ui/SUREChatWidget';

function DNSAuditContent() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  
  // URL Param OR state
  const initialDomain = searchParams.get('domain') || '';
  const [domain, setDomain] = useState(initialDomain);
  const [inputDomain, setInputDomain] = useState(initialDomain);
  
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'results' | 'success'>('idle');
  const [scanStep, setScanStep] = useState(0);
  const [dnsResult, setDnsResult] = useState<any>(null);
  const [isRescanning, setIsRescanning] = useState(false);
  
  // Vision AI State
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<any>(null);
  const [isVisionLoading, setIsVisionLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const SCAN_STEPS = [
    t('ui.dns_step_1'),
    t('ui.dns_step_2'),
    t('ui.dns_step_3'),
    t('ui.dns_step_4'),
    t('ui.dns_step_5'),
    t('ui.dns_step_6'),
    t('ui.dns_step_7')
  ];

  // Auto-start if domain is present in URL
  useEffect(() => {
    const step = searchParams.get('step');
    if (initialDomain && scanState === 'idle') {
      if (step === '8') {
        fetchFinalReport(initialDomain);
      } else {
        startScan(initialDomain);
      }
    }
  }, [initialDomain, searchParams]);

  const fetchFinalReport = async (targetDomain: string) => {
    if (!targetDomain) return;
    setDomain(targetDomain);
    setScanState('scanning');
    setScanStep(SCAN_STEPS.length - 1); // Jump to last step visually
    
    try {
      const res = await fetch('/api/dns-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain })
      });
      const data = await res.json();
      setDnsResult(data);
      setScanState('success');
    } catch (error) {
      console.error(error);
      setScanState('idle');
    }
  };

  const handleRescan = async () => {
    if (!domain || isRescanning) return;
    setIsRescanning(true);
    try {
      const res = await fetch('/api/dns-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain })
      });
      const data = await res.json();
      setDnsResult(data);
    } catch (error) {
      console.error('Error rescanning:', error);
    } finally {
      setIsRescanning(false);
    }
  };

  const startScan = async (targetDomain: string) => {
    if (!targetDomain) return;
    setDomain(targetDomain);
    setScanState('scanning');
    setScanStep(0);

    // Simulate Visual Scanning Steps
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
    }

    // Call actual API
    try {
      const res = await fetch('/api/dns-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain })
      });
      const data = await res.json();
      setDnsResult(data);
    } catch (error) {
      console.error(error);
      setDnsResult({ recommendedMission: "Analysis Failed", issues: ["Could not connect to DNS scanner."] });
    } finally {
      setScanState('results');
    }
  };

  const reVerify = async () => {
    setVisionImage(null);
    setVisionResult(null);
    setVerifyError(null);
    setScanState('scanning');
    setScanStep(0);

    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
    }

    try {
      const res = await fetch('/api/dns-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain })
      });
      const data = await res.json();
      setDnsResult(data);
      
      if (data.recommendedMission === 'mission_all_clear') {
         setScanState('results'); // Muestra la pantalla verde global
      } else {
         setVerifyError(t('ui.dns_err_not_detected'));
         setScanState('success'); // Los mantiene en el dashboard premium
      }
    } catch (error) {
       console.error(error);
       setVerifyError(t('ui.dns_err_verify'));
       setScanState('success');
    }
  };

  const handleCheckout = async () => {
    // Call Stripe Tactical Link or create a checkout session
    try {
      const res = await fetch('/api/checkout-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment error: " + data.error);
      }
    } catch (e) {
      console.error(e);
      // Fallback if the API is not ready
      window.location.href = process.env.NEXT_PUBLIC_STRIPE_TACTICAL_LINK || "#";
    }
  };

  const getRiskText = (issue: string, lang: string) => {
    switch (issue) {
      case 'issue_no_spf':
      case 'issue_spf_loop':
      case 'issue_txt_resolve':
        return t('ui.dns_vuln_spoof');
      case 'issue_no_dmarc':
      case 'issue_dmarc_resolve':
        return t('ui.dns_vuln_bec');
      case 'issue_no_mx':
      case 'issue_mx_resolve':
        return t('ui.dns_vuln_mx');
      default:
        return t('ui.dns_vuln_struct');
    }
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setVisionImage(base64);
      setIsVisionLoading(true);
      setVisionResult(null);

      try {
        const res = await fetch('/api/dns-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageBase64: base64,
            mimeType: file.type,
            context: {
              mission: 'Find where to add new DNS records (TXT/SPF/DMARC) or where to access DNS settings',
              domain: domain,
              language: language,
              browserLanguage: typeof window !== 'undefined' ? navigator.language : 'en',
              dnsIssues: dnsResult?.issues || [],
              missingDmarc: !dnsResult?.dmarc,
              missingSpf: !dnsResult?.spf || dnsResult?.issues?.includes('issue_spf_loop')
            }
          })
        });
        const data = await res.json();
        if (data.error) {
          setVisionResult({ found: false, instruction: `Error de Visión IA: ${data.error}` });
        } else {
          setVisionResult(data);
        }
      } catch (error: any) {
        console.error("Vision API Error", error);
        setVisionResult({ found: false, instruction: "Error analizando la imagen. Por favor, comunícate con soporte." });
      } finally {
        setIsVisionLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleClipboardButton = async () => {
    try {
      if (!navigator.clipboard) {
        setVerifyError(t('ui.dns_err_clip_1'));
        return;
      }
      
      const clipboardItems = await navigator.clipboard.read();
      let foundImage = false;
      
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
        for (const imageType of imageTypes) {
          const blob = await clipboardItem.getType(imageType);
          const file = new File([blob], "pasted-image.png", { type: imageType });
          processImageFile(file);
          foundImage = true;
          break;
        }
        if (foundImage) break;
      }
      
      if (!foundImage) {
        setVerifyError(t('ui.dns_err_clip_2'));
      }
    } catch (err) {
      console.error('Clipboard access error:', err);
      setVerifyError(t('ui.dns_err_clip_3'));
    }
  };

  // Listen for Paste (Ctrl+V) events globally
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Allow paste at any time while viewing results (even if domain is already green/success) for demo purposes
      if (scanState !== 'results' && scanState !== 'success') return; 
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault(); // Prevent default paste behavior (like scrolling or pasting in a random input)
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [scanState, visionImage, domain]);


  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-open-sans selection:bg-emerald-500/30 flex flex-col relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0f172a] to-[#0f172a]" />
         {scanState === 'results' && dnsResult?.recommendedMission !== 'mission_all_clear' && (
           <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px]" />
         )}
      </div>

      {/* Header */}
      <nav className="w-full px-6 py-4 border-b border-white/5 flex justify-between items-center relative z-20 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Image src="/logo-sure.png" alt="SURE Logo" width={32} height={32} className="object-contain" priority />
          <span className="font-montserrat font-black text-xl tracking-widest uppercase">
            SURE
          </span>
        </div>
        <LanguageSelector />
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 w-full max-w-5xl mx-auto">
        
        {scanState === 'idle' && (
          <div className="w-full max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-700">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              DNS Infrastructure Audit
            </h1>
            <p className="text-xl text-slate-400 mb-10 font-light">
              {t('ui.dns_audit_sub')}
            </p>
            <div className="relative group max-w-lg mx-auto">
              <input 
                type="text" 
                placeholder={t('ui.dns_audit_placeholder')}
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startScan(inputDomain)}
                className="w-full bg-[#1e293b] border border-white/10 rounded-xl pl-6 pr-32 py-5 text-xl text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-colors shadow-2xl"
              />
              <button 
                onClick={() => startScan(inputDomain)}
                disabled={!inputDomain}
                className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {t('ui.dns_btn_audit')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-8">
              <a 
                href="/BEC_Fraud_SURE_Executive_Briefing.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
              >
                <ShieldAlert className="w-4 h-4" />
                Read the BEC Fraud Executive Briefing
              </a>
            </div>
          </div>
        )}

        {scanState === 'scanning' && (
          <div className="w-full max-w-3xl mx-auto bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Scanning Laser Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20">
              <div className="h-full bg-emerald-500 w-1/3 animate-[scan_2s_ease-in-out_infinite]" />
            </div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-6">
                <Search className="w-12 h-12 text-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
                {t('ui.dns_progress_title')}
              </h2>
              <div className="font-mono text-emerald-400 text-lg tracking-wider">
                {domain.toUpperCase()}
              </div>
            </div>

            <div className="bg-black/50 rounded-xl p-6 font-mono text-sm space-y-3 border border-white/5">
              {SCAN_STEPS.map((stepText, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    idx < scanStep ? 'text-slate-500' : idx === scanStep ? 'text-emerald-400 font-bold translate-x-2' : 'opacity-0'
                  }`}
                >
                  {idx < scanStep ? <CheckCircle2 className="w-4 h-4" /> : idx === scanStep ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4" />}
                  {stepText}
                </div>
              ))}
            </div>
          </div>
        )}

        {scanState === 'results' && dnsResult && (
          <div className="w-full animate-in slide-in-from-bottom-8 fade-in duration-700">
            {dnsResult.recommendedMission === 'mission_all_clear' ? (
              <div className="max-w-3xl mx-auto bg-[#1e293b]/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-widest">
                  {t('ui.dns_secured_title')}
                </h2>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 inline-flex flex-col items-center gap-2 mb-8 mx-auto">
                   <div className="text-slate-400 text-sm uppercase font-bold tracking-widest">TARGET</div>
                   <div className="text-2xl font-mono text-emerald-400">{domain.toUpperCase()}</div>
                </div>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                  {t('ui.dns_secured_desc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button 
                    onClick={() => { setScanState('idle'); setDomain(''); setInputDomain(''); }}
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all"
                  >
                    {t('ui.dns_btn_run_another')}
                  </button>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all"
                  >
                    {t('ui.dns_btn_exit')}
                  </button>
                </div>
              </div>
            ) : dnsResult.recommendedMission === 'mission_dead_domain' ? (
              <div className="max-w-3xl mx-auto bg-[#1e293b]/90 backdrop-blur-xl border border-slate-500/30 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(148,163,184,0.1)]">
                <AlertTriangle className="w-24 h-24 text-slate-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-widest">
                  {t('ui.dns_inactive_title')}
                </h2>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 inline-flex flex-col items-center gap-2 mb-8 mx-auto">
                   <div className="text-slate-400 text-sm uppercase font-bold tracking-widest">TARGET</div>
                   <div className="text-2xl font-mono text-slate-400">{domain.toUpperCase()}</div>
                </div>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                  {t('ui.dns_inactive_desc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button 
                    onClick={() => { setScanState('idle'); setDomain(''); setInputDomain(''); }}
                    className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all"
                  >
                    {language === 'es' ? 'Hacer Otra Verificación' : 'Run Another Audit'}
                  </button>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all"
                  >
                    {language === 'es' ? 'Salir (Lobby)' : 'Exit to Lobby'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full grid lg:grid-cols-2 gap-8 items-center">
                {/* Visual Evidence Panel */}
                <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 lg:p-10 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                        {t('ui.dns_crit_vuln')}
                      </h2>
                      <div className="font-mono text-slate-400 text-sm">{domain.toUpperCase()}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {dnsResult.provider && (
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between mb-4">
                        <span className="text-blue-200 font-bold flex items-center gap-2"><Server className="w-4 h-4"/> {t('ui.dns_infra')}</span>
                        <span className="font-mono text-blue-400 font-bold text-right">
                          {dnsResult.provider === 'Unknown Provider' 
                            ? t('ui.dns_private_server') 
                            : dnsResult.provider}
                        </span>
                      </div>
                    )}
                    
                    {dnsResult.issues?.map((issue: string, idx: number) => (
                      <div key={idx} className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden gap-3">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                        <span className="text-red-200 font-bold flex items-center gap-2 ml-2 whitespace-nowrap"><AlertTriangle className="w-4 h-4 text-red-500"/> {t('ui.dns_risk_vector')}</span>
                        <div className="flex items-center gap-2 bg-red-900/40 px-3 py-1.5 rounded text-right">
                           <span className="font-mono text-red-400 font-bold text-sm">
                             {getRiskText(issue, language)}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-black/50 rounded-xl p-5 border border-white/5">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      <strong className="text-white block mb-2">{t('ui.dns_op_impact_title')}</strong>
                      {t('ui.dns_op_impact_desc')}
                    </p>
                  </div>
                </div>

                {/* Conversion Panel */}
                <div className="flex flex-col justify-center px-4 lg:px-12">
                  <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
                    {t('ui.dns_close_door')}
                  </h3>
                  <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                    <>{t('ui.dns_seal_breach_1')}{dnsResult.provider && dnsResult.provider !== 'Unknown Provider' ? dnsResult.provider : ''}{t('ui.dns_seal_breach_2')}</>
                  </p>
                  
                  <div className="flex items-center gap-6 mb-10">
                    <div className="text-5xl font-mono font-bold text-emerald-400">$70</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                      {t('ui.dns_rma_sub')}<br/>
                      <span className="text-slate-400 font-normal capitalize">{t('ui.dns_per_month')}</span>
                    </div>
                  </div>

                  <p className="text-white font-bold text-xl mb-4 text-center lg:text-left">
                    {t('ui.dns_want_protect')}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <button 
                      onClick={handleCheckout}
                      className="flex-1 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl py-5 rounded-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex justify-center items-center gap-3"
                    >
                      <Lock className="w-6 h-6" /> 
                      {t('ui.dns_btn_yes')}
                    </button>
                    
                    <button 
                      onClick={() => {
                        setScanState('idle');
                        setDomain('');
                        setInputDomain('');
                      }}
                      className="flex-1 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 font-black text-xl py-5 rounded-2xl uppercase tracking-widest transition-all"
                    >
                      {t('ui.dns_btn_no')}
                    </button>
                  </div>
                  
                  <p className="text-center text-slate-500 text-xs mt-6 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> {t('ui.dns_secure_pay')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {scanState === 'success' && dnsResult && (
          <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="bg-[#1e293b] border border-emerald-500/50 rounded-3xl p-8 lg:p-12 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-3xl font-black text-emerald-400 uppercase tracking-widest flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8" /> 
                    {t('ui.dns_unlocked_title')}
                  </h2>
                  <div className="font-mono text-slate-400 mt-2 text-lg">Target: {domain.toUpperCase()}</div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" /> 
                  {t('ui.dns_pay_verified')}
                </div>
              </div>

              <div className="space-y-8">
                {/* Provider Info */}
                <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    {t('ui.dns_provider_title')}
                  </h3>
                  <div className="text-2xl font-mono text-blue-300 bg-blue-900/30 inline-block px-6 py-3 rounded-xl border border-blue-500/30">
                    {dnsResult.provider === 'Unknown Provider' ? t('ui.dns_private_server') : dnsResult.provider}
                  </div>
                </div>

                {/* Full DNS Radiology */}
                <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-400" />
                      {t('ui.dns_radio_title')}
                    </h3>
                    <button 
                      onClick={handleRescan}
                      disabled={isRescanning}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-slate-700 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRescanning ? 'animate-spin text-emerald-400' : ''}`} />
                      {isRescanning ? t('ui.dns_scanning') : t('ui.dns_force_rescan')}
                    </button>
                  </div>
                  
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    <div className="grid grid-cols-[100px_1fr_120px] gap-4 p-4 border-b border-white/5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                      <div>{t('ui.dns_col_type')}</div>
                      <div>{t('ui.dns_col_val')}</div>
                      <div className="text-right">{t('ui.dns_col_status')}</div>
                    </div>
                    
                    {/* A Records */}
                    <div className="grid grid-cols-[100px_1fr_120px] gap-4 p-4 border-b border-white/5 items-center">
                      <div className="font-mono text-blue-400 font-bold">A / AAAA</div>
                      <div className="font-mono text-slate-300 text-sm truncate">
                        {dnsResult.a?.length > 0 ? dnsResult.a.join(', ') : 'No IPv4'} 
                        {dnsResult.aaaa?.length > 0 ? ` | ${dnsResult.aaaa.join(', ')}` : ''}
                      </div>
                      <div className="text-right">
                        {(dnsResult.a?.length > 0 || dnsResult.aaaa?.length > 0) ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">✅ OK</span>
                        ) : (
                          <span className="bg-slate-500/20 text-slate-400 border border-slate-500/30 px-3 py-1 rounded-full text-xs font-bold">-- N/A</span>
                        )}
                      </div>
                    </div>

                    {/* NS Records */}
                    <div className="grid grid-cols-[100px_1fr_120px] gap-4 p-4 border-b border-white/5 items-center">
                      <div className="font-mono text-blue-400 font-bold">NS</div>
                      <div className="font-mono text-slate-300 text-sm truncate">
                        {dnsResult.ns?.length > 0 ? dnsResult.ns.join(', ') : 'Not detected'}
                      </div>
                      <div className="text-right">
                        {dnsResult.ns?.length > 0 ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">✅ OK</span>
                        ) : (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold">❌ FAIL</span>
                        )}
                      </div>
                    </div>

                    {/* MX Records */}
                    <div className="grid grid-cols-[100px_1fr_120px] gap-4 p-4 border-b border-white/5 items-center">
                      <div className="font-mono text-blue-400 font-bold">MX</div>
                      <div className="font-mono text-slate-300 text-sm truncate">
                        {dnsResult.mx?.length > 0 ? dnsResult.mx.map((m:any) => m.exchange).join(', ') : 'No Mail Servers'}
                      </div>
                      <div className="text-right">
                        {dnsResult.mx?.length > 0 ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">✅ OK</span>
                        ) : (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold">❌ FAIL</span>
                        )}
                      </div>
                    </div>

                    {/* SPF Record */}
                    <div className="grid grid-cols-[100px_1fr_120px] gap-4 p-4 border-b border-white/5 items-center">
                      <div className="font-mono text-blue-400 font-bold">TXT (SPF)</div>
                      <div className="font-mono text-slate-300 text-sm truncate">
                        {dnsResult.spf ? dnsResult.spf : 'Missing SPF Policy'}
                      </div>
                      <div className="text-right">
                        {dnsResult.spf && !dnsResult.issues?.includes('issue_spf_loop') ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">✅ OK</span>
                        ) : (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse">❌ VULN</span>
                        )}
                      </div>
                    </div>

                    {/* DMARC Record */}
                    <div className="grid grid-cols-[100px_1fr_120px] gap-4 p-4 items-center">
                      <div className="font-mono text-blue-400 font-bold">TXT (DMARC)</div>
                      <div className="font-mono text-slate-300 text-sm truncate">
                        {dnsResult.dmarc ? dnsResult.dmarc : 'Missing DMARC Policy'}
                      </div>
                      <div className="text-right">
                        {dnsResult.dmarc ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">✅ OK</span>
                        ) : (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse">❌ CRIT</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    {t('ui.dns_exposed_vectors')}
                  </h3>
                  <div className="space-y-3">
                    {dnsResult.issues?.map((issue: string, idx: number) => (
                      <div key={idx} className="bg-red-950/20 border border-red-500/20 p-4 rounded-xl font-mono text-red-300">
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>



                {/* Action Plan */}
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <h3 className="text-xl font-bold text-white mb-4 ml-4">
                    {t('ui.dns_visual_ai')}
                  </h3>
                  <p className="text-slate-300 ml-4 text-lg leading-relaxed mb-4">
                    {t('ui.dns_ai_instr_1')}
                  </p>
                  <p className="text-slate-300 ml-4 text-lg leading-relaxed mb-6">
                    {t('ui.dns_ai_instr_2')}
                  </p>
                  
                  {verifyError && (
                    <div className="ml-4 mb-6 bg-red-500/20 border border-red-500 text-red-200 font-bold p-4 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                      <div>{verifyError}</div>
                    </div>
                  )}

                  <div className="ml-4 bg-black/40 border border-emerald-500/30 rounded-xl p-6">
                    {!visionImage ? (
                      <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/40 rounded-xl p-8 hover:bg-emerald-500/5 transition-colors cursor-pointer relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Loader2 className="w-10 h-10 text-emerald-500 mb-4" />
                          <h4 className="text-emerald-400 font-bold text-lg mb-2 text-center">
                            {t('ui.dns_upload_hint')}
                          </h4>
                          <p className="text-slate-400 text-sm text-center">
                            {t('ui.dns_upload_sub')}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/10">
                          <button 
                            onClick={handleClipboardButton}
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-8 py-3 rounded-xl uppercase tracking-widest transition-all w-full max-w-md flex items-center justify-center gap-3 text-center"
                          >
                            <Search className="w-5 h-5" />
                            {t('ui.dns_btn_paste')}
                          </button>
                          
                          <button 
                            onClick={reVerify}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-8 py-3 rounded-xl uppercase tracking-widest transition-all w-full max-w-md flex items-center justify-center gap-3 text-center"
                          >
                            {t('ui.dns_btn_continue')}
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {isVisionLoading ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Search className="w-12 h-12 text-emerald-500 animate-bounce mb-4" />
                            <div className="text-emerald-400 font-bold animate-pulse text-lg">
                              {t('ui.dns_ai_analyzing')}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-4">
                            {visionResult?.instruction && (
                              <div className="flex flex-col gap-3">
                                <div className="bg-emerald-500/20 border border-emerald-500 text-white font-bold p-4 rounded-xl text-lg flex items-start gap-3">
                                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                                  <div className="whitespace-pre-line">{visionResult.instruction}</div>
                                </div>
                              </div>
                            )}
                            
                            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                              <img src={visionImage} alt="Dashboard Screenshot" className="w-full h-auto" />
                              
                              {visionResult?.found && visionResult?.boxes_2d && visionResult.boxes_2d.map((box: number[], idx: number) => (
                                <div 
                                  key={idx}
                                  className="absolute border-[4px] border-red-500 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse"
                                  style={{
                                    top: `${(box[0] / 1000) * 100}%`,
                                    left: `${(box[1] / 1000) * 100}%`,
                                    height: `${((box[2] - box[0]) / 1000) * 100}%`,
                                    width: `${((box[3] - box[1]) / 1000) * 100}%`,
                                  }}
                                >
                                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-white/10 w-full">
                              <div className="w-full max-w-md flex flex-col gap-3">
                                <input
                                  type="text"
                                  placeholder={language === 'es' ? 'Comentario para la IA (opcional)...' : 'Comment for the AI (optional)...'}
                                  className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                  id="vision-comment"
                                />
                                
                                <button 
                                  onClick={handleClipboardButton}
                                  className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                  <Search className="w-4 h-4" />
                                  {language === 'es' ? 'PEGAR NUEVA CAPTURA (PORTAPAPELES)' : 'PASTE NEW SCREENSHOT (CLIPBOARD)'}
                                </button>

                                <button 
                                  onClick={() => {
                                    setVisionImage(null);
                                    setVisionResult(null);
                                  }}
                                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                  {language === 'es' ? 'O subir un archivo manualmente' : 'Or upload file manually'}
                                </button>

                                <button 
                                  onClick={() => reVerify()}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl px-8 py-4 rounded-xl uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full flex items-center justify-center gap-3 text-center mt-2"
                                >
                                  {language === 'es' ? 'VERIFICAR CAMBIOS' : 'VERIFY CHANGES'}
                                  <CheckCircle2 className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
      
      {/* Footer Disclaimer */}
      <footer className="w-full py-6 text-center text-slate-600 text-xs z-10 border-t border-white/5 bg-black/20">
         {language === 'es' 
           ? 'SURE audita infraestructura utilizando exclusivamente registros DNS públicos. No accedemos a redes privadas ni a contenido de comunicaciones.' 
           : 'SURE audits infrastructure using exclusively public DNS records. We do not access private networks or communication content.'}
      </footer>

      {/* Widget IA Flotante */}
      <SUREChatWidget />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function DNSAuditoriaWizard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
      <DNSAuditContent />
    </Suspense>
  );
}
