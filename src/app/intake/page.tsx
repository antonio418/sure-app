"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Loader2, 
  Sparkles, Globe, User, Mail, Phone, Link2, Send, Check
} from 'lucide-react';

export default function MarijaIntakePortal() {
  const [clinicName, setClinicName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clinicName || !contactPerson || !email || !phone) {
      setErrorMessage("Prašome užpildyti visus privalomus laukus.");
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage("Prašome sutikti su privatumo politika ir sąlygomis.");
      return;
    }

    try {
      setStatus('submitting');
      setErrorMessage('');
      
      // Visual steps for premium feel
      setLoadingStep(1); // Connecting...
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingStep(2); // Saving...
      const response = await fetch('/api/marija-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicName,
          contactPerson,
          email,
          phone,
          website
        })
      });

      setLoadingStep(3); // Notifying...
      await new Promise(resolve => setTimeout(resolve, 600));

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Nepavyko išsiųsti užklausos. Pabandykite vėliau.");
      }

      setStatus('success');
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(err.message || "Įvyko ryšio klaida. Prašome pabandyti dar kartą.");
      setStatus('error');
    }
  };

  const ProcdiLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
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

  return (
    <div className="min-h-screen bg-[#0B192C] text-white flex flex-col justify-between font-montserrat relative selection:bg-[#008DDA]/20 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        .font-montserrat {
          font-family: 'Montserrat', sans-serif !important;
        }
      `}</style>

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#008DDA]/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#008DDA]/3 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header */}
      <nav className="w-full px-6 md:px-12 py-6 flex justify-between items-center bg-[#0B192C]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ProcdiLogo className="w-9 h-9" />
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-[0.05em] text-white leading-none">PRÓCDI</span>
            <span className="text-[8px] text-[#008DDA] font-extrabold uppercase tracking-wider mt-1">Medical AI Systems</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          Marija DI Demo Portal
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6 relative z-10 max-w-4xl mx-auto w-full">
        
        {status === 'success' ? (
          <div className="w-full max-w-xl bg-[#0e1f35]/60 backdrop-blur-xl border-2 border-[#008DDA]/30 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,141,218,0.1)] text-center relative overflow-hidden animate-fadeIn">
            {/* Cyber bracket decoration */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#008DDA] rounded-tl-lg pointer-events-none" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#008DDA] rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#008DDA] rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#008DDA] rounded-br-lg pointer-events-none" />

            <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 uppercase tracking-wider">
              Užklausa gauta sėkmingai!
            </h2>
            
            <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed mb-8">
              Ačiū už Jūsų susidomėjimą <strong>Marija DI</strong> asistentu. Gavome Jūsų kontaktinius duomenis ir pradėjome demo versijos ruošimą.
            </p>

            <div className="bg-[#0B192C]/80 border border-white/5 rounded-2xl p-6 text-left space-y-3 mb-8">
              <h3 className="text-xs font-bold text-[#008DDA] uppercase tracking-wider">Kas vyks toliau?</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#008DDA] rounded-full mt-1.5 shrink-0" />
                  <span>Mūsų komanda išanalizuos Jūsų nurodytą svetainę (jei nurodėte) bei kainyną.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#008DDA] rounded-full mt-1.5 shrink-0" />
                  <span>Sukurti interaktyvų demonstracinį kloną su Jūsų klinikos logotipu užtruks apie 24-48 val.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#008DDA] rounded-full mt-1.5 shrink-0" />
                  <span>Direktorius <strong>Antonio Baronas (MB PROCDI)</strong> susisieks su Jumis el. paštu arba telefonu ir pateiks nuorodą išbandymui.</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => {
                setStatus('idle');
                setClinicName('');
                setContactPerson('');
                setEmail('');
                setPhone('');
                setWebsite('');
                setAcceptedTerms(false);
              }}
              className="px-8 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-xs rounded-xl transition-all tracking-widest uppercase"
            >
              Užregistruoti kitą kliniką
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#008DDA]/10 border border-[#008DDA]/30 text-[#008DDA] text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Interaktyvus demonstracinis klonas
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 uppercase tracking-tight">
                Išbandykite Marija DI <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#008DDA]">
                  Savo klinikoje
                </span>
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed">
                Užpildykite kontaktinius duomenis. Mes sukursime demonstracinį AI asistento kloną, apmokytą pagal Jūsų klinikos paslaugas, kad patys įvertintumėte jos darbą.
              </p>
            </div>

            <div className="bg-[#0e1f35]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#008DDA]/5 rounded-bl-full pointer-events-none" />

              {status === 'submitting' ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-pulse">
                  <Loader2 className="w-12 h-12 text-[#008DDA] animate-spin" />
                  <div className="text-center">
                    <p className="font-extrabold text-white text-base tracking-wider uppercase">
                      {loadingStep === 1 && "Jungiamasi su saugiu serveriu..."}
                      {loadingStep === 2 && "Išsaugoma užklausa sistemoje..."}
                      {loadingStep === 3 && "Siunčiamas pranešimas Antonio Baronas..."}
                    </p>
                    <p className="text-slate-500 text-xs mt-2 font-medium">Prašome palaukti, tai užtruks kelias sekundes.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs font-bold leading-relaxed">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Clinic Name */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#008DDA]" />
                        Klinikos pavadinimas *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        placeholder="Pvz., Vilniaus Odontologijos Centras"
                        className="w-full bg-[#0B192C] border border-white/10 focus:border-[#008DDA] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors shadow-inner font-medium placeholder:text-slate-600"
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#008DDA]" />
                        Kontaktinis asmuo *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="Vardas, Pavardė (pvz. Jonas Jonaitis)"
                        className="w-full bg-[#0B192C] border border-white/10 focus:border-[#008DDA] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors shadow-inner font-medium placeholder:text-slate-600"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#008DDA]" />
                        El. paštas *
                      </label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Pvz. jonas@klinika.lt"
                        className="w-full bg-[#0B192C] border border-white/10 focus:border-[#008DDA] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors shadow-inner font-medium placeholder:text-slate-600"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#008DDA]" />
                        Telefono numeris *
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Pvz. +370 612 34567"
                        className="w-full bg-[#0B192C] border border-white/10 focus:border-[#008DDA] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors shadow-inner font-medium placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#008DDA]" />
                      Klinikos svetainė (neprivaloma)
                    </label>
                    <input 
                      type="text" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Pvz. www.klinika.lt (Naudojama AI apmokymui)"
                      className="w-full bg-[#0B192C] border border-white/10 focus:border-[#008DDA] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors shadow-inner font-medium placeholder:text-slate-600"
                    />
                  </div>

                  {/* Terms checkbox */}
                  <div className="pt-2 flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      required
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#008DDA] focus:ring-[#008DDA] cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer select-none leading-relaxed font-semibold">
                      Sutinku, kad MB PROCDI naudos mano pateiktus duomenis demonstracinio klono kūrimui ir susisieks su manimi dėl jo pristatymo.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button 
                      type="submit"
                      disabled={!clinicName || !contactPerson || !email || !phone || !acceptedTerms}
                      className={`w-full md:w-auto px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all ${
                        (!clinicName || !contactPerson || !email || !phone || !acceptedTerms)
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                        : 'bg-[#008DDA] hover:bg-[#00e5ff] text-white hover:text-[#0B192C] hover:scale-[1.02] shadow-[0_0_20px_rgba(0,141,218,0.2)]'
                      }`}
                    >
                      <span>Siųsti užklausą demo versijai</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#07111e] text-white border-t border-slate-800 py-8 px-6 md:px-12 relative z-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <span className="text-[9px] md:text-[10px] text-slate-500 font-extrabold tracking-wider uppercase">
            MB PROCDI • Įmonės kodas: 307515454 • Partizanų g. 61-806, LT-49282, Kaunas, Lietuva
          </span>
          <span className="text-[9px] md:text-[10px] text-slate-600 font-semibold uppercase">
            &copy; {new Date().getFullYear()} MB PROCDI. Visos teisės saugomos.
          </span>
        </div>
      </footer>

    </div>
  );
}
