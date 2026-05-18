"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ShieldCheck, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Network, Search, Scale, Cpu } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';
import { msaTranslations } from '@/lib/msaTranslations';

const RMAPdfGenerator = dynamic(
  () => import('@/components/pdf/RMAPdfGenerator'),
  { ssr: false, loading: () => <div className="text-sm text-slate-400">Preparando motor PDF...</div> }
);

const AgentNode = ({ id, name, role, status, icon: Icon }: any) => {
  const { t } = useLanguage();
  const isRunning = status === 'running';
  const isSuccess = status === 'success';

  return (
    <div className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-500 ${
      isRunning ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
      isSuccess ? 'border-emerald-500 bg-emerald-500/10' :
      'border-white/10 bg-slate-900'
    }`}>
      {isRunning && <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/30 blur-2xl animate-pulse"></div>}
      <div className="flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
          isRunning ? 'border-emerald-500/50 text-emerald-400' :
          isSuccess ? 'border-emerald-500/50 text-emerald-400' :
          'border-white/10 text-slate-500'
        }`}>
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : 
           isSuccess ? <CheckCircle2 className="w-5 h-5" /> : 
           <Icon className="w-5 h-5" />}
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-slate-500">NODE: {id}</div>
          <div className={`text-[10px] font-mono font-bold uppercase ${
            isRunning ? 'text-emerald-400 animate-pulse' :
            isSuccess ? 'text-emerald-400' : 'text-slate-600'
          }`}>
            {isRunning ? t('ui.agent_proc') : isSuccess ? t('ui.agent_done') : t('ui.agent_standby')}
          </div>
        </div>
      </div>
      <div>
        <h4 className={`text-sm font-bold ${isRunning || isSuccess ? 'text-white' : 'text-slate-400'}`}>{name}</h4>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{role}</p>
      </div>
    </div>
  );
};

export default function IntakePortal() {
  const { t, language: uiLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [reportLanguage, setReportLanguage] = useState(uiLanguage || 'es');
  const [files, setFiles] = useState<File[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [finalReport, setFinalReport] = useState<any | null>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, 'idle'|'running'|'success'|'error'>>({
    roberto: 'idle', moises: 'idle', alcides: 'idle', consolidator: 'idle'
  });
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        if (session.user?.email) {
          setEmail(session.user.email);
          setEmailConfirm(session.user.email);
        }
      }
    };
    fetchSession();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const addLog = (msg: string) => setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !emailConfirm || !phone || files.length === 0) {
      setErrorMessage("Por favor llena los campos obligatorios y sube al menos un documento.");
      return;
    }
    if (email !== emailConfirm) {
      setErrorMessage("Los correos electrónicos no coinciden.");
      return;
    }

    try {
      setStatus('uploading');
      setErrorMessage('');

      const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const safePhone = phone.replace(/[^a-zA-Z0-9+]/g, '');
      
      const uploadedPaths: string[] = [];
      for (const file of files) {
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `intake_${safeEmail}_TEL_${safePhone}/${Date.now()}_${cleanFileName}`;
        const { error } = await supabase.storage.from('temp_dossiers').upload(filePath, file);
        if (error) throw error;
        uploadedPaths.push(filePath);
      }

      setStatus('analyzing');
      setProgress(10);
      addLog(t('ui.log_secured'));

      const subordinateAgents = ['roberto', 'moises', 'alcides'];
      const subordinateNames = [t('ui.agent1_name'), t('ui.agent2_name'), t('ui.agent3_name')];

      const fetchAgent = async (agent: string, name: string) => {
        setAgentStatus(prev => ({ ...prev, [agent]: 'running' }));
        const formData = new FormData();
        uploadedPaths.forEach(path => formData.append('filePath', path));
        formData.append('agent', agent);
        formData.append('targetLanguage', reportLanguage);
        
        const response = await fetch('/api/analyze', { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `El agente ${name} reportó un error.`);
        
        setAgentStatus(prev => ({ ...prev, [agent]: 'success' }));
        addLog(`${name} ${t('ui.log_agent_done')}`);
        return `\n\n--- REPORTE DE ${name.toUpperCase()} ---\n${data.report}`;
      };

      const subordinateReports = [];
      for (let i = 0; i < subordinateAgents.length; i++) {
        const report = await fetchAgent(subordinateAgents[i], subordinateNames[i]);
        subordinateReports.push(report);
        setProgress(20 + (i * 20)); // 20 -> 40 -> 60
      }

      setProgress(75);
      addLog(t('ui.log_deploy_exec'));
      setAgentStatus(prev => ({ ...prev, consolidator: 'running' }));

      const consolidatorFormData = new FormData();
      uploadedPaths.forEach(path => consolidatorFormData.append('filePath', path));
      consolidatorFormData.append('agent', 'consolidator');
      consolidatorFormData.append('targetLanguage', reportLanguage);
      consolidatorFormData.append('previousReports', subordinateReports.join('\n'));
      consolidatorFormData.append('email', email); // Sends copy to client via Resend
      
      const consolidatorResponse = await fetch('/api/analyze', { method: 'POST', body: consolidatorFormData });
      const consolidatorData = await consolidatorResponse.json();
      
      if (!consolidatorResponse.ok) throw new Error(consolidatorData.error || `Error en Consolidador.`);
      
      setAgentStatus(prev => ({ ...prev, consolidator: 'success' }));
      addLog(`${t('ui.log_dossier_done')} ${email}`);
      setProgress(90);

      try {
         let jsonStr = consolidatorData.report;
         if (jsonStr.includes('```json')) jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
         else if (jsonStr.includes('```')) jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
         
         // Fix trailing commas often hallucinated by LLMs
         jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1');
         
         const parsedReport = JSON.parse(jsonStr) as any;
         parsedReport.dateGenerated = new Date().toLocaleDateString();
         setFinalReport(parsedReport);
      } catch (e) {
         addLog(t('ui.log_error_pdf'));
         console.error(e);
      }

      setProgress(100);
      setStatus('success');

    } catch (error: any) {
      console.error("Error de análisis:", error);
      setErrorMessage(error.message || "Hubo un error de conexión.");
      setStatus('error');
    }
  };

  if (status === 'analyzing' || status === 'success') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-4xl bg-[#1e293b] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
           
           {status === 'analyzing' && (
             <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center font-bold mb-6 animate-pulse">
               {t('ui.intake_warn_stay')}
             </div>
           )}

           <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-2xl font-black mb-1">{t('ui.intake_process_title')}</h1>
                <p className="text-slate-400 text-sm">{t('ui.intake_process_sub')}</p>
              </div>
              <Image src="/logo-sure.png" alt="SURE Logo" width={40} height={40} className="object-contain opacity-50" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <AgentNode id="ROB-9X" name={t('ui.agent1_name')} role={t('ui.agent1_role2')} status={agentStatus.roberto} icon={Search} />
              <AgentNode id="MOI-2B" name={t('ui.agent2_name')} role={t('ui.agent2_role2')} status={agentStatus.moises} icon={Scale} />
              <AgentNode id="ALC-7V" name={t('ui.agent3_name')} role={t('ui.agent3_role2')} status={agentStatus.alcides} icon={Cpu} />
              <AgentNode id="EXE-1A" name={t('ui.agent4_name2')} role={t('ui.agent4_role2')} status={agentStatus.consolidator} icon={ShieldCheck} />
           </div>

           <div className="mb-6">
             <div className="flex justify-between text-xs text-slate-400 font-bold mb-2">
               <span>{t('ui.intake_progress')}</span>
               <span>{progress}%</span>
             </div>
             <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
             </div>
           </div>

           <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 font-mono text-[11px] h-32 overflow-y-auto">
              {logs.length === 0 && <span className="text-slate-600">{t('ui.intake_connecting')}</span>}
              {logs.map((log, i) => (
                <div key={i} className="mb-1 text-slate-400">
                  <span className="text-emerald-500">{'>'}</span> {log}
                </div>
              ))}
           </div>

           {status === 'success' && finalReport && (
             <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center">
               <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
               <h2 className="text-xl font-bold mb-2">{t('ui.intake_done_title')}</h2>
               <p className="text-slate-400 text-sm mb-6 text-center max-w-md">
                 {t('ui.intake_done_desc')} ({email}).
               </p>
               <RMAPdfGenerator finalReport={finalReport} language={reportLanguage} />
             </div>
           )}

           {status === 'success' && !finalReport && (
             <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <p className="text-emerald-400 font-bold">{t('ui.intake_done_success')}</p>
             </div>
           )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center py-20 px-6 font-open-sans">
      
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image src="/logo-sure.png" alt="SURE Logo" width={40} height={40} className="object-contain" />
          <span className="font-montserrat font-black text-2xl tracking-widest uppercase">
            SURE<span className="text-emerald-500">.</span>
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">{t('ui.intake_title')}</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          {t('ui.intake_desc')}
        </p>
      </div>

      <div className="max-w-xl w-full bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6 text-xs text-slate-300 leading-relaxed relative z-10">
            <strong className="text-white block mb-2 uppercase tracking-wider text-[10px]">{t('ui.intake_warn_title')}</strong>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t('ui.intake_warn_1')}</li>
              <li>{t('ui.intake_warn_2')}</li>
              <li>{t('ui.intake_warn_3')}</li>
            </ul>
          </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">{t('ui.intake_lbl_email')}</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@company.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">{t('ui.intake_lbl_email_confirm')}</label>
              <input 
                type="email" 
                required
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                placeholder="Confirm your corporate email"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">{t('ui.intake_lbl_phone')}</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">{t('ui.intake_lbl_company')}</label>
              <input 
                type="text" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="John Doe o Empresa (Opcional)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">{t('ui.intake_lbl_lang')}</label>
              <select
                value={reportLanguage}
                onChange={(e) => setReportLanguage(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                <option value="en">English (Inglés)</option>
                <option value="es">Español</option>
                <option value="pt">Português (Portugués)</option>
                <option value="fr">Français (Francés)</option>
                <option value="de">Deutsch (Alemán)</option>
                <option value="zh">中文 (Chino)</option>
                <option value="ru">Русский (Ruso)</option>
                <option value="ar">العربية (Árabe)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
             <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">{t('ui.intake_lbl_evidence')}</label>
             <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer relative">
               <input 
                 type="file" 
                 multiple 
                 onChange={handleFileChange}
                 accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
               />
               <UploadCloud className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
               <p className="text-sm font-bold mb-1">{t('ui.intake_drop')}</p>
               <p className="text-xs text-slate-500">{t('ui.intake_drop_sub')}</p>
             </div>
             
             {files.length > 0 && (
               <div className="mt-4 space-y-2">
                 {files.map((f, i) => (
                   <div key={i} className="flex items-center gap-3 bg-slate-900 px-4 py-3 rounded-lg border border-slate-700">
                     <FileText className="w-5 h-5 text-emerald-400" />
                     <span className="text-sm truncate flex-1">{f.name}</span>
                     <span className="text-xs text-slate-500">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="pt-6">
            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">
              {msaTranslations[uiLanguage]?.title || msaTranslations['en'].title}
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 h-48 overflow-y-auto text-xs text-slate-400 space-y-3 leading-relaxed shadow-inner">
               <p className="whitespace-pre-line font-semibold text-emerald-400">
                 {(msaTranslations[uiLanguage]?.parties || msaTranslations['en'].parties).replace('{{CLIENT}}', company || email || '___________________')}
               </p>
               <p>{msaTranslations[uiLanguage]?.p1 || msaTranslations['en'].p1}</p>
               
               <div>
                 <p className="whitespace-pre-line mb-2">{msaTranslations[uiLanguage]?.p2 || msaTranslations['en'].p2}</p>
                 <p className="font-semibold text-slate-300 mb-2">{msaTranslations[uiLanguage]?.p2_intro || msaTranslations['en'].p2_intro}</p>
                 <ul className="list-disc pl-5 space-y-1 mb-2">
                   {(msaTranslations[uiLanguage]?.bullets || msaTranslations['en'].bullets).map((bullet: string, idx: number) => (
                     <li key={idx}>{bullet}</li>
                   ))}
                 </ul>
               </div>

               <p>{msaTranslations[uiLanguage]?.p3 || msaTranslations['en'].p3}</p>
               <p>{msaTranslations[uiLanguage]?.p4 || msaTranslations['en'].p4}</p>
               <p>{msaTranslations[uiLanguage]?.p5 || msaTranslations['en'].p5}</p>
            </div>
          </div>

          <div className="pt-2 flex items-start gap-3">
            <input 
              type="checkbox" 
              id="terms" 
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer select-none">
              {t('ui.intake_terms')}
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800">
             <button 
               type="submit"
               disabled={status === 'uploading' || files.length === 0 || !email || !emailConfirm || !phone || !acceptedTerms}
               className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${status === 'uploading' || files.length === 0 || !email || !emailConfirm || !phone || !acceptedTerms ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
             >
               {status === 'uploading' ? (
                 <><Loader2 className="w-5 h-5 animate-spin" /> {t('ui.intake_btn_processing')}</>
               ) : (
                 <><Network className="w-5 h-5" /> {t('ui.intake_btn_start')}</>
               )}
             </button>
             {!session && (
               <p className="text-center text-xs text-slate-500 mt-4">
                 {t('ui.intake_disclaimer')}
               </p>
             )}
          </div>
        </form>
      </div>
    </div>
  );
}
