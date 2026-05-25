"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, Loader2, UploadCloud, Search, CheckCircle2, AlertTriangle } from 'lucide-react';

const LOCAL_TRANSLATIONS: Record<string, any> = {
  en: {
    s1_title: "The Problem",
    s1_sub: "(Why You're Here)",
    s1_desc: "Your important emails are falling into Spam or being blocked due to security issues (Spoofing) in your domain.",
    s2_title: "The Consequence",
    s2_sub: "(Lost Business)",
    s2_desc: "Because of this, receiving servers block your legitimate emails, causing severe communication breakdowns with clients and partners.",
    s3_title: "The Cause",
    s3_sub: "(Technical Failures)",
    s3_desc: "Your DNS records (SPF, DKIM, DMARC) are either missing or incorrectly configured, leaving your identity exposed.",
    s4_title: "The Solution",
    s4_sub: "(Meet Alfredo)",
    s4_desc: "Our AI Cyber Security Agent will guide you step-by-step to lock down your domain in less than 5 minutes.",
    continue: "CONTINUE",
    s1_img_text: "ARE YOUR QUOTES ENDING UP HERE?",
    spam_folder: "SPAM (127)",
    spam_subject: "URGENT! Commercial Proposal and Pricing...",
    spam_sender: "Industrial B2B",
    
    // Slide 5
    s5_hero_title: "DNS Infrastructure Audit",
    s5_hero_subtitle: "Discover if someone can send fake invoices from your corporate domain. In 30 seconds. No installations.",
    s5_placeholder: "ex: company.com",
    s5_btn_audit: "AUDIT ->",
    
    // Slide 6
    s6_crit_title: "CRITICAL VULNERABILITY",
    s6_infra: "Private Server (Unknown)",
    s6_risk_1: "Invalid Reception Infrastructure",
    s6_risk_2: "Identity Spoofing Allowed",
    s6_risk_3: "Lack of Anti-Fraud Monitoring (BEC)",
    s6_impact_title: "Operational Impact:",
    s6_impact_desc: "Right now, any external actor can spoof your domain, insert fake payment instructions in an active email thread, and trick your supplier or client into wiring funds to a fraudulent account.",
    s6_conv_title: "Close this door before your next wire transfer.",
    s6_conv_desc: "Our AI will guide you step-by-step to close this vulnerability in your specific provider. No technical team needed, in under 10 minutes.",
    s6_price_title: "$70",
    s6_price_sub: "FOUNDER'S LICENSE / Domain (One-Time Payment)",
    s6_prompt: "Do you want to protect your domain?",
    yes: "YES",
    no: "NO",
    
    // Slide 7
    s7_discount_note: "If you hold a discount code, please enter it in the box, click 'Apply', and then proceed to payment.",
    
    // Slide 8
    s8_unlocked_title: "AUDIT UNLOCKED",
    s8_unlocked_badge: "Payment Verified",
    s8_real_case: "This is a real case from one of our Clients",
    s8_infra_title: "Your Infrastructure Provider:",
    s8_radio_title: "Current DNS Radiology:",
    s8_exposed_title: "Exposed Technical Vectors:",
    
    // Slide 9
    s9_title: "VISUAL AI ASSISTANCE",
    s9_desc: "Please connect to your provider page, take a screenshot (Tip: use Win+Shift+S on Windows or Cmd+Shift+4 on Mac for better precision), paste it via \"CTRL V\" or click the blue \"Paste from clipboard\" button, and press \"CONTINUE\".",
    s9_desc2: "If you don't know WHERE you are or what to do, only screenshot the page where you are, paste it (Ctrl+V or blue button) here, and press \"CONTINUE\". We will indicate exactly what to do.",
    s9_upload_title: "Upload your screenshot or press Ctrl+V / blue button",
    s9_upload_sub: "Click, drag the image or paste from clipboard (PNG, JPG)",
    
    // Slide 10
    s10_title: "ALFREDO'S INSTRUCTIONS",
    s10_no_spoiler: "After Client uploads DNS detailed data, our AI agent will provide accurate instructions on what has to be changed in order to get your domain clean and safe.\n\nAs last step, after Client changed parameters, our AI agent performs a second security scan showing success of this operation.",
    
    // Slide 11 & 12 & 13
    s11_title: "VERIFICATION",
    s11_desc: "Take a new screenshot of the corrected records and paste it here (Ctrl+V or blue button) for final verification.",
    s12_title: "FINAL SECURE REPORT",
    s12_desc: "Your domain is now 100% Protected and Authenticated.",
    s13_q1: "Score 1 to 10 on how easy was to follow Alfredo's instructions.",
    s13_q2: "Yes/No on feeling complete confidence that your company's emails are now fully protected against SPAM and identity spoofing?",
    s13_q3: "Yes/No on recommending this to colleages and friends?",
    finish: "END",
  }
};

export default function DNSPresentation() {
  const [step, setStep] = useState(1);

  const { language } = useLanguage();
  const t = LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS['en'];

  const nextStep = () => {
    if (step < 13) setStep(step + 1);
    else window.location.href = '/';
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Keyboard navigation for presentation feel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
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
  }, [step]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex w-full max-w-6xl mx-auto gap-8 items-center cursor-pointer" onClick={nextStep}>
            <div className="flex-1">
              <div className="bg-[#1e293b] p-10 rounded-2xl border border-white/5 shadow-2xl">
                <p className="font-montserrat text-4xl font-black text-white leading-tight mb-4">
                  {t.s1_title}<br/><span className="text-blue-500 text-3xl">{t.s1_sub}</span>
                </p>
                <p className="text-slate-300 text-2xl leading-relaxed">
                  {t.s1_desc}
                </p>
                <button className="mt-8 px-10 py-4 bg-emerald-500 text-black font-bold rounded-lg uppercase tracking-wider hover:scale-105 transition-transform" onClick={(e) => { e.stopPropagation(); nextStep(); }}>{t.continue}</button>
              </div>
            </div>
            <div className="flex-1 flex justify-center w-full">
              {/* Dynamic Tailwind CSS Email Mockup */}
              <div className="w-full h-[450px] bg-white rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.2)] border-4 border-slate-700 flex flex-col overflow-hidden relative font-sans">
                {/* Gmail-style Header */}
                <div className="bg-slate-100 border-b border-slate-300 p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-black text-xl">M</div>
                  <div className="h-8 bg-white border border-slate-300 rounded-lg w-full max-w-md flex items-center px-3"><Search className="w-4 h-4 text-slate-400" /></div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-48 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-4">
                    <div className="h-3 bg-slate-300 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    <div className="py-2 px-3 bg-red-100 border border-red-200 rounded-lg text-red-700 font-bold text-sm flex items-center gap-2 mt-4">
                      <AlertTriangle className="w-4 h-4" /> {t.spam_folder}
                    </div>
                  </div>
                  {/* Inbox Area */}
                  <div className="flex-1 p-0 flex flex-col relative bg-white">
                    {/* Giant Translated Text Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <h2 className="text-3xl md:text-5xl font-black text-white px-8 py-6 bg-black/90 backdrop-blur-md rounded-2xl border-4 border-red-500 text-center uppercase leading-tight shadow-[0_0_50px_rgba(239,68,68,1)] -rotate-3 transform hover:rotate-0 transition-transform duration-500">
                        {t.s1_img_text}
                      </h2>
                    </div>
                    {/* Drawn Red Circle */}
                    <div className="absolute top-[80px] left-[5%] w-[90%] h-[180px] border-[8px] border-red-600 rounded-[50%] z-10 opacity-90 pointer-events-none" style={{boxShadow: '0 0 20px rgba(239,68,68,0.5), inset 0 0 20px rgba(239,68,68,0.5)'}}></div>
                    
                    {/* Rows */}
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className={`p-4 border-b border-slate-200 flex gap-4 items-center ${i >= 2 && i <= 4 ? 'bg-red-50/50' : 'bg-white'}`}>
                        <div className="w-16 text-red-600 font-black text-xs md:text-sm tracking-widest">[SPAM]</div>
                        <div className="flex-1 truncate">
                          <span className="text-black font-bold text-sm md:text-base mr-3">{t.spam_sender}</span>
                          <span className="text-slate-600 text-xs md:text-sm">{t.spam_subject}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex w-full max-w-6xl mx-auto gap-8 items-center cursor-pointer" onClick={nextStep}>
            <div className="flex-1">
              <div className="bg-[#1e293b] p-10 rounded-2xl border border-white/5 shadow-2xl">
                <p className="font-montserrat text-4xl font-black text-white leading-tight mb-4">
                  {t.s2_title}<br/><span className="text-red-500 text-3xl">{t.s2_sub}</span>
                </p>
                <p className="text-slate-300 text-2xl leading-relaxed">
                  {t.s2_desc}
                </p>
                <button className="mt-8 px-10 py-4 bg-emerald-500 text-black font-bold rounded-lg uppercase tracking-wider hover:scale-105 transition-transform" onClick={(e) => { e.stopPropagation(); nextStep(); }}>{t.continue}</button>
              </div>
            </div>
            <div className="flex-1 flex justify-center w-full">
              {/* Reuse the Dynamic Mockup for Consistency on Slide 2 */}
              <div className="w-full h-[450px] bg-white rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.2)] border-4 border-slate-700 flex flex-col overflow-hidden relative font-sans grayscale-[50%]">
                <div className="bg-slate-100 border-b border-slate-300 p-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-black text-xl">M</div>
                  <div className="h-8 bg-white border border-slate-300 rounded-lg w-full max-w-md flex items-center px-3"><Search className="w-4 h-4 text-slate-400" /></div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  <div className="w-48 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-4">
                    <div className="h-3 bg-slate-300 rounded w-3/4"></div>
                    <div className="py-2 px-3 bg-red-100 border border-red-200 rounded-lg text-red-700 font-bold text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> {t.spam_folder}
                    </div>
                  </div>
                  <div className="flex-1 p-0 flex flex-col bg-white">
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                      <div className="flex flex-col items-center">
                         <Lock className="w-24 h-24 text-red-500 mb-4" />
                         <h2 className="text-4xl font-black text-white text-center uppercase tracking-widest">{t.s2_sub}</h2>
                      </div>
                    </div>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="p-4 border-b border-slate-200 flex gap-4 items-center bg-red-50/50">
                        <div className="w-16 text-red-600 font-black text-xs md:text-sm tracking-widest">[SPAM]</div>
                        <div className="flex-1 truncate">
                          <span className="text-black font-bold text-sm md:text-base mr-3">{t.spam_sender}</span>
                          <span className="text-slate-600 text-xs md:text-sm">{t.spam_subject}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex w-full max-w-6xl mx-auto gap-8 items-center cursor-pointer" onClick={nextStep}>
            <div className="flex-1">
              <div className="bg-[#1e293b] p-10 rounded-2xl border border-white/5 shadow-2xl">
                <p className="font-montserrat text-4xl font-black text-white leading-tight mb-4">
                  {t.s3_title}<br/><span className="text-amber-500 text-3xl">{t.s3_sub}</span>
                </p>
                <p className="text-slate-300 text-2xl leading-relaxed">
                  {t.s3_desc}
                </p>
                <button className="mt-8 px-10 py-4 bg-emerald-500 text-black font-bold rounded-lg uppercase tracking-wider hover:scale-105 transition-transform" onClick={(e) => { e.stopPropagation(); nextStep(); }}>{t.continue}</button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img src="/tutorial/dns_management_interface_1777310333070.png" alt="Cause" className="max-w-full max-h-[500px] rounded-2xl border-2 border-slate-700 shadow-2xl" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex w-full max-w-6xl mx-auto gap-8 items-center cursor-pointer" onClick={nextStep}>
            <div className="flex-1">
              <div className="bg-[#1e293b] p-10 rounded-2xl border border-white/5 shadow-2xl">
                <p className="font-montserrat text-4xl font-black text-white leading-tight mb-4">
                  {t.s4_title}<br/><span className="text-blue-500 text-3xl">{t.s4_sub}</span>
                </p>
                <p className="text-slate-300 text-2xl leading-relaxed">
                  {t.s4_desc}
                </p>
                <button className="mt-8 px-10 py-4 bg-emerald-500 text-black font-bold rounded-lg uppercase tracking-wider hover:scale-105 transition-transform" onClick={(e) => { e.stopPropagation(); nextStep(); }}>{t.continue}</button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img src="/tutorial/alfredo_robot.png" alt="Solution" className="max-w-full max-h-[500px] rounded-2xl border-2 border-blue-500 shadow-2xl" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="w-full max-w-2xl mx-auto text-center cursor-pointer" onClick={nextStep}>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              DNS Infrastructure Audit
            </h1>
            <p className="text-xl text-slate-400 mb-10 font-light">
              Discover if someone can send fake invoices from your corporate domain. In 30 seconds. No installations.
            </p>
            <div className="relative group max-w-lg mx-auto">
              <input 
                type="text" 
                readOnly
                value="empresa.com"
                className="w-full bg-[#1e293b] border border-white/10 rounded-xl pl-6 pr-32 py-5 text-xl text-white placeholder-slate-600 outline-none shadow-2xl opacity-80 cursor-pointer text-center md:text-left"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); nextStep(); }}
                className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 rounded-lg transition-colors flex items-center gap-2 uppercase tracking-wider"
              >
                {t.s5_btn} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-amber-400 font-bold mt-8 text-sm">{t.s5_tip}<br/><span className="text-slate-300 text-base">juan.perez <span className="text-emerald-400">@mi-empresa.com</span></span></p>
          </div>
        );
      case 6:
        return (
          <div className="w-full max-w-7xl mx-auto cursor-pointer" onClick={nextStep}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Panel: Vulnerability Details */}
              <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />
                <div className="flex items-start gap-4 mb-8 pb-8 border-b border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                    <ShieldCheck className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                      {t.s6_crit_title}
                    </h2>
                    <div className="font-mono text-slate-400 text-sm">@EMPRESA.COM</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between mb-4">
                    <span className="text-blue-200 font-bold flex items-center gap-2">Infrastructure</span>
                    <span className="font-mono text-blue-400 font-bold text-right">{t.s6_infra}</span>
                  </div>
                  {[t.s6_risk_1, t.s6_risk_2, t.s6_risk_3].map((risk, idx) => (
                    <div key={idx} className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden gap-3">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                      <span className="text-red-200 font-bold flex items-center gap-2 ml-2 whitespace-nowrap"><AlertTriangle className="w-4 h-4 text-red-500"/> Risk Vector</span>
                      <div className="flex items-center gap-2 bg-red-900/40 px-3 py-1.5 rounded text-right">
                         <span className="font-mono text-red-400 font-bold text-sm">{risk}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-black/50 rounded-xl p-5 border border-white/5">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <strong className="text-white block mb-2">{t.s6_impact_title}</strong>
                    {t.s6_impact_desc}
                  </p>
                </div>
              </div>

              {/* Right Panel: Conversion */}
              <div className="flex flex-col justify-center px-4 lg:px-12 w-[500px] shrink-0">
                <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
                  {t.s6_conv_title}
                </h3>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  {t.s6_conv_desc}
                </p>

                <div className="mb-10">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black text-emerald-400">{t.s6_price_title}</span>
                    <div className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                      {t.s6_price_sub.split('/').map((part: string, i: number) => (
                        <div key={i}>{part}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                  <p className="text-white font-bold mb-6 text-center text-lg">{t.s6_prompt}</p>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextStep(); }}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      <Lock className="w-5 h-5" /> {t.yes}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextStep(); }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg py-4 rounded-xl border border-slate-700 transition-colors"
                    >
                      {t.no}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center cursor-pointer" onClick={nextStep}>
            <div className="mb-6 bg-blue-900/30 border border-blue-500/50 p-6 rounded-2xl max-w-3xl">
              <p className="text-blue-200 text-lg font-medium flex items-center justify-center gap-3">
                <AlertTriangle className="w-6 h-6 text-blue-400" />
                {t.s7_discount_note}
              </p>
            </div>
            
            {/* Mock Checkout Component for $70 Tactical Plan */}
            <div className="w-full max-w-2xl bg-[#1e293b] border border-white/10 rounded-2xl p-8 mb-8 text-left shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-8 pb-8 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-xl font-bold text-white">SURE. Tactical License</h3>
                  </div>
                  <p className="text-slate-400 text-sm">One-time operational forensic audit.</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white">$70<span className="text-lg text-slate-500 font-normal">.00</span></div>
                  <div className="text-xs text-slate-500 font-bold tracking-widest mt-1">USD</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <div className="w-full bg-black/30 border border-slate-700 rounded-lg p-3 text-slate-300">juan.perez@mi-empresa.com</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Card Information</label>
                  <div className="w-full bg-black/30 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
                     <span className="text-slate-300 font-mono">•••• •••• •••• 4242</span>
                     <div className="flex gap-2">
                       <span className="text-slate-500 text-sm font-mono">12/28</span>
                       <span className="text-slate-500 text-sm font-mono">CVC</span>
                     </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextStep(); }}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Lock className="w-5 h-5" /> Pay $70.00
                </button>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">(DEMO ENVIRONMENT)</p>
          </div>
        );
      case 8:
        return (
          <div className="w-full max-w-5xl mx-auto cursor-pointer" onClick={nextStep}>
            <div className="bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
              <div className="bg-slate-900/80 p-6 border-b border-slate-800 flex justify-between items-center relative">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" /> {t.s8_unlocked_title}
                  </h2>
                  <div className="font-mono text-slate-400 text-sm mt-1">Target: <span className="opacity-40 blur-[2px]">@MAILINGFAST.COM</span> <span className="ml-2 text-emerald-400/80 italic text-xs">({t.s8_real_case})</span></div>
                </div>
                <div className="px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {t.s8_unlocked_badge}
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Infrastructure Provider */}
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                     <Lock className="w-4 h-4 text-slate-400" /> {t.s8_infra_title}
                  </h3>
                  <div className="inline-block px-6 py-3 bg-blue-950/30 border border-blue-900 rounded-xl text-blue-400 font-mono font-bold">
                    Private Server
                  </div>
                </div>

                {/* DNS Radiology */}
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4 text-slate-400" /> {t.s8_radio_title}
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
                     <AlertTriangle className="w-4 h-4" /> {t.s8_exposed_title}
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 border border-red-900/50 bg-red-950/20 rounded-lg text-red-400 font-mono text-sm">issue_mx_resolve</div>
                    <div className="p-3 border border-red-900/50 bg-red-950/20 rounded-lg text-red-400 font-mono text-sm">issue_txt_resolve</div>
                    <div className="p-3 border border-red-900/50 bg-red-950/20 rounded-lg text-red-400 font-mono text-sm">issue_dmarc_resolve</div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                   <button onClick={(e) => { e.stopPropagation(); nextStep(); }} className="px-10 py-4 bg-emerald-500 text-black font-bold rounded-lg uppercase transition-transform hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]">{t.continue}</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="w-full max-w-5xl mx-auto cursor-pointer" onClick={nextStep}>
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <h3 className="text-2xl font-bold text-white mb-6 ml-4 tracking-wide">
                {t.s9_title}:
              </h3>
              <p className="text-slate-300 ml-4 text-lg leading-relaxed mb-6">
                {t.s9_desc}
              </p>
              <p className="text-slate-300 ml-4 text-lg leading-relaxed mb-8">
                {t.s9_desc2}
              </p>
              <div className="ml-4 bg-[#0a0f18] border border-white/10 rounded-2xl p-8">
                <div className="flex flex-col items-center justify-center border border-dashed border-emerald-500/30 rounded-xl py-16 px-8 relative bg-emerald-950/10">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-6" />
                  <p className="text-xl font-bold text-white mb-2">{t.s9_upload_title}</p>
                  <p className="text-slate-400 text-sm mb-8">{t.s9_upload_sub}</p>
                  <button onClick={(e) => { e.stopPropagation(); nextStep(); }} className="px-12 py-3 border border-emerald-500/50 text-emerald-400 font-bold rounded-lg uppercase hover:bg-emerald-500/10 transition-colors tracking-widest flex items-center gap-2">
                    {t.continue} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="w-full max-w-6xl mx-auto cursor-pointer" onClick={nextStep}>
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <h3 className="text-2xl font-bold text-white mb-6 ml-4 tracking-wide">{t.s10_title}:</h3>
              
              <div className="ml-4 flex flex-col lg:flex-row gap-8 items-center">
                {/* Left Side: Screenshot with Bounding Box */}
                <div className="flex-1 bg-[#0a0f18] border border-white/10 rounded-2xl p-4 relative w-full">
                  <img src="/tutorial/provider_dashboard.png" alt="Screenshot" className="w-full h-auto rounded-lg opacity-90 border border-slate-800" />
                  {/* Visual indication that AI is looking at the screen without giving away the exact fields */}
                  <div className="absolute border-4 border-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] bg-red-500/20 animate-pulse rounded-lg pointer-events-none" style={{top: '42%', left: '2%', width: '96%', height: '14%'}}></div>
                </div>

                {/* Right Side: Commercial AI Explanation Text (No Spoilers) */}
                <div className="w-full lg:w-[450px] shrink-0 flex flex-col gap-6">
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-8 shadow-xl flex-1 flex flex-col justify-center relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                      </div>
                      <span className="font-black text-white text-xl tracking-wider">AI FOUND MATCH</span>
                    </div>
                    
                    <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                      {t.s10_no_spoiler}
                    </div>
                  </div>

                  <button className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-lg uppercase tracking-wider transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2" onClick={(e) => { e.stopPropagation(); nextStep(); }}>
                    {t.continue} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 11:
        return (
          <div className="w-full max-w-5xl mx-auto cursor-pointer" onClick={nextStep}>
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <h3 className="text-xl font-bold text-white mb-4 ml-4">
                {t.s11_title}
              </h3>
              <p className="text-slate-300 ml-4 text-lg leading-relaxed mb-6">
                {t.s11_desc}
              </p>
              <div className="ml-4 bg-black/40 border border-emerald-500/30 rounded-xl p-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/40 rounded-xl p-12 relative bg-slate-900">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500/50 mb-4 animate-pulse" />
                  <p className="text-lg font-bold text-emerald-400 mb-2">CTRL + V</p>
                  <button onClick={(e) => { e.stopPropagation(); nextStep(); }} className="mt-6 px-10 py-3 bg-emerald-500 text-black font-bold rounded-lg uppercase shadow-[0_0_15px_rgba(16,185,129,0.5)]">SIMULATE VERIFICATION (DEMO)</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 12:
        return (
          <div className="w-full max-w-4xl mx-auto bg-[#1e293b] rounded-3xl p-12 text-center border border-white/5 cursor-pointer" onClick={nextStep}>
            <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-white mb-4">{t.s12_title}</h2>
            <p className="text-2xl text-emerald-400 mb-8">{t.s12_desc}</p>
            <div className="bg-black/50 p-6 rounded-2xl mb-8 flex items-center justify-center gap-4 border border-emerald-500/30">
               <ShieldCheck className="w-8 h-8 text-emerald-500" />
               <span className="text-xl font-bold font-mono tracking-widest">EMPRESA.COM</span>
               <Lock className="w-6 h-6 text-emerald-500" />
            </div>
            <button onClick={(e) => { e.stopPropagation(); nextStep(); }} className="px-10 py-4 bg-emerald-500 text-black font-bold rounded-lg uppercase">{t.continue}</button>
          </div>
        );
      case 13:
        return (
          <div className="w-full max-w-3xl mx-auto bg-[#1e293b] rounded-3xl p-10 border border-white/5">
            <h2 className="text-3xl font-black text-white text-center mb-8">Satisfaction Survey</h2>
            <div className="space-y-6 opacity-70">
              <div>
                <label className="block text-slate-300 mb-2 font-bold">{t.s13_q1}</label>
                <input type="text" readOnly value="10" className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white outline-none" />
              </div>
              <div>
                <label className="block text-slate-300 mb-2 font-bold">{t.s13_q2}</label>
                <input type="text" readOnly value="Yes" className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white outline-none" />
              </div>
              <div>
                <label className="block text-slate-300 mb-2 font-bold">{t.s13_q3}</label>
                <input type="text" readOnly value="Yes" className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white outline-none" />
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <button onClick={nextStep} className="px-16 py-4 bg-red-600 text-white font-bold rounded-xl uppercase hover:bg-red-500 transition-colors shadow-xl">
                {t.finish}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-open-sans overflow-x-hidden selection:bg-emerald-500/30 flex flex-col">
      {/* Navigation Bar with Presentation Banner */}
      <nav className="w-full px-6 py-4 bg-[#0f172a] border-b border-white/5 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
          <span className="font-montserrat font-black text-2xl tracking-tighter text-white">
            SURE<span className="text-emerald-500">.</span>
          </span>
        </div>
        
        {/* BIG PRESENTATION BANNER */}
        <div className="absolute left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full font-bold tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400 animate-pulse">
          PRESENTATION
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <div className="text-sm font-bold text-slate-400 tracking-widest uppercase hidden md:flex items-center gap-2">
            Slide {step}/13
          </div>
        </div>
      </nav>

      {/* Main Presentation Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Progress bar background visual */}
        <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full z-10">
          <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${(step / 13) * 100}%` }}></div>
        </div>
        
        {renderStepContent()}
      </main>
      
      {/* Back button for navigation if needed */}
      {step > 1 && step <= 13 && (
        <button onClick={prevStep} className="absolute bottom-8 left-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-400 z-50">
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
